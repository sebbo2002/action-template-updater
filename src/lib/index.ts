import { Octokit } from '@octokit/rest';
import { CoreInterface } from './core-mock';
import simpleGit, { SimpleGit } from 'simple-git';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { URL } from 'url';


export interface Context {
    owner: string;
    repo: string;
    template: string;
    assignees: string[];
}
export interface Repository {
    name: string,
    defaultBranch: string,
    cloneUrl: string
}
export interface PullRequest {
    number: number;
    assignees: string[];
}
export interface TemplateContext {
    name: string;
    owner: string;
    url: string;
    cloneUrl: string;
}
export interface TemplateBranchCommit {
    sha: string;
    date: Date | null;
    parents: string[];
}
export interface TemplateBranch {
    name: string;
    sha: string;
    parents: string[];
    commits: TemplateBranchCommit[];
    unique: string[];
}

export default class Action {
    private readonly github: Octokit;
    private readonly git: SimpleGit;
    private readonly context: Context;
    private readonly token: string;
    private readonly core: CoreInterface;
    private readonly commitCache: Map<string, boolean> = new Map();
    private static readonly PR_BRANCH_UPDATE_NAME = 'template-updater/update';

    constructor (token: string, context: Context, core: CoreInterface) {
        this.github = new Octokit({
            auth: token,
            userAgent: '@sebbo2002/action-template-updater',
            log: {
                debug: () => ({}),
                info: () => ({}),
                warn: message => core.warning(message),
                error: message => core.error(message)
            },
        });
        this.git = simpleGit();
        this.token = token;

        this.context = context;
        this.core = core;
    }

    public async run (): Promise<void> {
        const tokenUserName = await this.getTokenUser();
        const repository = await this.getRepository();
        const template = await this.getTemplate();

        let pr = await this.findPullRequest(repository.defaultBranch, tokenUserName);
        const templateBranch = await this.getTemplateBranch(template);
        if(await this.repoIncludesCommit(templateBranch.sha)) {
            this.core.info(`Latest template commit (${templateBranch.sha.substring(0, 8)}) included in repository.`);
            this.core.notice('Repository seems to be up to date, stop here…');
            return;
        }

        await this.createUpdateBranch(repository, template, templateBranch, tokenUserName);
        pr = await this.createOrUpdatePullRequest(pr, repository, template);

        if(pr) {
            this.core.notice(`Pull Request #${pr.number} is up to date`);
        }
    }

    public async getTokenUser (): Promise<string> {
        let tokenUserName = 'github-actions[bot]';
        try {
            const user = await this.github.rest.users.getAuthenticated();
            this.core.info(`Hello ${user.data.login}, nice to meet you 👋🏼`);
            tokenUserName = user.data.login;
        } catch (error) {
            this.core.warning(`Unable to detect user, using default value ${tokenUserName}`);
            this.core.info(String(error));
        } finally {
            this.core.endGroup();
        }

        return tokenUserName;
    }

    public async getRepository (): Promise<Repository> {
        try {
            const { data } = await this.github.rest.repos.get({
                ...this.context
            });

            return {
                name: data.name,
                defaultBranch: data.default_branch,
                cloneUrl: data.clone_url
            };
        } catch (error) {
            throw new Error(`Unable to find template: ${error}`);
        }
    }

    public async getTemplate (): Promise<TemplateContext> {
        const [owner, repo] = this.context.template.split('/');

        try {
            const { data } = await this.github.rest.repos.get({
                owner,
                repo
            });

            return {
                name: data.name,
                owner: data.owner.login,
                url: data.html_url,
                cloneUrl: data.clone_url
            };
        } catch (error) {
            throw new Error(`Unable to find template ${owner}/${repo}: ${error}`);
        }
    }

    public async findPullRequest (defaultBranch: string, tokenUser: string): Promise<null | PullRequest> {
        this.core.startGroup('Check for existing PRs');
        const prs = await this.github.rest.pulls.list({
            ...this.context,
            base: Action.PR_BRANCH_UPDATE_NAME,
            head: defaultBranch,
            sort: 'updated',
            direction: 'desc',
            state: 'open'
        });

        const pr = prs.data.find(pr => {
            if (pr.user?.login !== tokenUser) {
                this.core.info(`Pull request #${pr.number} was not created by this bot (${tokenUser}). Ignore it…`);
                return null;
            }

            return pr;
        });

        if (pr) {
            this.core.info('Found an existing pull request, continue with this one…');
        }

        this.core.endGroup();
        if(pr) {
            return {
                number: pr.number,
                assignees: pr.assignees?.map(a => a.login) ?? []
            };
        }
        return null;
    }

    public async getTemplateBranch (template: TemplateContext): Promise<TemplateBranch> {
        this.core.startGroup('Scan template branches');

        const { data: branches } = await this.github.rest.repos.listBranches({
            owner: template.owner,
            repo: template.name
        });

        const branchNames = branches.map(branch => branch.name);
        const branchesWithCommits = await Promise.all(branchNames.map(async branchName => {
            const { data: commits } = await this.github.rest.repos.listCommits({
                owner: template.owner,
                repo: template.name,
                sha: branchName
            });

            return {
                name: branchName,
                commits: commits
                    .map(commit => ({
                        sha: commit.sha,
                        date: commit.commit.author?.date ? new Date(commit.commit.author.date) : null,
                        parents: commit.parents.map(parent => parent.sha)
                    })),
                minDate: Math.min(...commits
                    .map(commit => commit.commit.author?.date)
                    .filter(date => date)
                    .map(date => new Date(date || '1970-01-01').getTime())
                )
            };
        }));

        const minDate = Math.min(...branchesWithCommits.map(branch => branch.minDate));
        const result = branchesWithCommits
            .map(branch => {
                let parents: string[] = [];
                const unique: string[] = [];
                for (const commit of branch.commits) {
                    const branchesWithSameCommit = branchesWithCommits
                        .filter(otherBranch =>
                            otherBranch.name !== branch.name &&
                            otherBranch.commits.find(otherCommit => commit.sha === otherCommit.sha)
                        )
                        .map(branch => branch.name);

                    if (branchesWithSameCommit.length && branch.commits.indexOf(commit) === 0) {
                        break;
                    }
                    if (branchesWithSameCommit.length && !parents.length) {
                        parents = branchesWithSameCommit;
                    }
                    if (
                        !branchesWithSameCommit.length &&
                        commit.date &&
                        new Date(commit.date).getTime() > minDate
                    ) {
                        unique.push(commit.sha);
                    }
                }

                return {
                    name: branch.name,
                    sha: branch.commits[0].sha,
                    commits: branch.commits,
                    parents,
                    unique
                };
            })
            .sort((a, b) => b.parents.indexOf(a.name));

        for(const branch of result) {
            this.core.info(`- ${branch.name}${branch.parents.length ? ` (extends ${branch.parents.join(', ')})` : ''}`);
        }

        const branch = await this.detectTemplateBranch(result);

        this.core.endGroup();
        return branch;
    }

    private async detectTemplateBranch (branches: TemplateBranch[]): Promise<TemplateBranch> {
        for(const branch of branches) {
            if(branch.unique.length) {
                for(const sha of branch.unique) {
                    if(await this.repoIncludesCommit(sha)) {
                        this.core.info(`Branch ${branch.name} detected as template branch (detected by unique commit ${sha.substring(0, 8)})`);
                        return branch;
                    }

                    this.core.info(`Commit ${sha.substring(0, 8)} not found in repository`);
                }
            }
            else if(branch.commits.length) {
                for(const commit of branch.commits) {
                    if(await this.repoIncludesCommit(commit.sha)) {
                        this.core.info(`Branch ${branch.name} detected as template branch (detected by commit ${commit.sha.substring(0, 8)})`);
                        return branch;
                    }
                }
            }
        }

        throw new Error(`Unable to detect template branch. Is ${this.context.template} the correct template repository?`);
    }

    private async repoIncludesCommit (sha: string): Promise<boolean> {
        const cache = this.commitCache.get(sha);
        if(cache !== undefined) {
            return cache;
        }

        try {
            await this.github.rest.git.getCommit({
                ...this.context,
                commit_sha: sha
            });

            this.commitCache.set(sha, true);
            return true;
        }
        catch(error) {
            if(String(error).includes('Not Found')) {
                this.commitCache.set(sha, false);
                return false;
            }

            throw error;
        }
    }

    public addTokenToRepositoryUrl (url: string): string {
        const urlObj = new URL(url);
        urlObj.username = this.token;
        return urlObj.toString();
    }

    public async createUpdateBranch(repository: Repository, template: TemplateContext, branch: TemplateBranch, username: string, push = true) {
        this.core.startGroup('Create update branch for pull request');

        const tmp = await mkdtemp(join(tmpdir(), 'action-template-updater'));

        try {
            this.core.info('Set git user name and email');
            await this.git.addConfig('user.email', 'uyiebuogiacahdohhohd@e.sebbo.net');
            await this.git.addConfig('user.name', username);

            this.core.info(`Clone ${repository.cloneUrl}`);
            await this.git.clone(this.addTokenToRepositoryUrl(repository.cloneUrl), tmp);
            this.git.cwd(tmp);

            this.core.info(`Add template remote (${template.cloneUrl})`);
            await this.git.addRemote('template', template.cloneUrl);

            this.core.info('Fetch template');
            await this.git.fetch('template', branch.name);

            this.core.info(`Checkout template branch as ${Action.PR_BRANCH_UPDATE_NAME}`);
            await this.git.checkout(['-f', '-b', Action.PR_BRANCH_UPDATE_NAME, '--track', 'template/' + branch.name]);

            if(push) {
                this.core.info('Push template to repository');
                await this.git.push('origin', Action.PR_BRANCH_UPDATE_NAME);
            }
        }
        finally {
            this.core.info('Remove local repository');
            await rm(tmp, { recursive: true });
            this.core.endGroup();
        }
    }

    public async createOrUpdatePullRequest(pr: PullRequest | null, repository: Repository, template: TemplateContext): Promise<PullRequest> {
        if(!pr) {
            this.core.info('Create Pull Request');
            const data = await this.github.rest.pulls.create({
                ...this.context,
                head: Action.PR_BRANCH_UPDATE_NAME,
                base: repository.defaultBranch,
                title: '🔧 Update template',
                body: `This pull request merges the current state of [the template](${template.url}) used here into this project so that it is up to date.`,
                maintainer_can_modify: true
            });
            pr = {
                number: data.data.number,
                assignees: data.data.assignees?.map(a => a.login) ?? []
            };
        }
        if(!pr) {
            throw new Error('Unable to continue: Unable to create Pull Request.');
        }
        const pullRequest = pr as PullRequest;
        const assigneesToAdd = this.context.assignees.filter(assignee => !pullRequest.assignees.includes(assignee));
        if(assigneesToAdd.length) {
            this.core.info('Assign these users to pull request: ' + assigneesToAdd.join(', '));
            this.github.rest.issues.addAssignees({
                ...this.context,
                issue_number: pullRequest.number
            });
        }

        return pullRequest;
    }
}
