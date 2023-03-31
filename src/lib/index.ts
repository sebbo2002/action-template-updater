import { Octokit } from '@octokit/rest';
import { CoreInterface } from './core-mock.js';
import { simpleGit, SimpleGit } from 'simple-git';
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
}

export default class Action {
    private readonly github: Octokit;
    private readonly botGithub: Octokit;
    private readonly git: SimpleGit;
    private readonly context: Context;
    private readonly token: string;
    private readonly botToken: string;
    private readonly core: CoreInterface;
    private readonly commitCache: Map<string, boolean> = new Map();
    private static readonly PR_BRANCH_UPDATE_NAME = 'template-updater/update';

    constructor (token: string, context: Context, core: CoreInterface, botToken = token) {
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
        this.botGithub = new Octokit({
            auth: botToken,
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
        this.botToken = botToken;

        this.context = context;
        this.core = core;
    }

    public async run (): Promise<void> {
        const tokenUserName = await this.getTokenUser();
        const repository = await this.getRepository();
        const { template, templateBranch } = await this.getTemplateAndBranch();
        if (this.context.owner == template.owner && this.context.repo === template.name) {
            this.core.notice('Repository and template are the same, stop here…');
            return;
        }

        let pr = await this.findPullRequest(repository.defaultBranch);
        if (await this.repoIncludesCommit(templateBranch.sha)) {
            this.core.info(`Latest template commit (${templateBranch.sha.substring(0, 8)}) included in repository.`);
            this.core.notice('Repository seems to be up to date, stop here…');
            return;
        }

        await this.createUpdateBranch(repository, template, templateBranch, tokenUserName);

        try {
            pr = await this.createOrUpdatePullRequest(pr, repository, template);
        }
        catch(error) {
            if (String(error).includes('A pull request already exists for')) {
                this.core.info('Pull request already exists.');
                return;
            }

            throw error;
        }

        if (pr) {
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
            this.core.info(`Unable to detect user, using default value ${tokenUserName}`);
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

    public async getTemplateAndBranch (): Promise<{ template: TemplateContext, templateBranch: TemplateBranch }> {
        const [owner, repo, branch] = this.context.template.split('/');
        let template: TemplateContext | undefined;
        let defaultBranch: string | undefined;

        try {
            const { data } = await this.github.rest.repos.get({
                owner,
                repo
            });

            defaultBranch = data.default_branch;
            template = {
                name: data.name,
                owner: data.owner.login,
                url: data.html_url,
                cloneUrl: data.clone_url
            };
        } catch (error) {
            throw new Error(`Unable to find template ${owner}/${repo}: ${error}`);
        }

        try {
            const { data } = await this.github.rest.repos.getBranch({
                owner,
                repo,
                branch: branch || defaultBranch || 'develop'
            });
            return {
                template,
                templateBranch: {
                    name: data.name,
                    sha: data.commit.sha
                }
            };
        } catch (error) {
            throw new Error(`Unable to find branch: ${error}`);
        }
    }

    public async findPullRequest (defaultBranch: string): Promise<null | PullRequest> {
        this.core.startGroup('Check for existing PRs');
        const prs = await this.botGithub.rest.pulls.list({
            ...this.context,
            base: Action.PR_BRANCH_UPDATE_NAME,
            head: defaultBranch,
            sort: 'updated',
            direction: 'desc',
            state: 'open'
        });

        if (prs.data.length > 0) {
            this.core.info('Found an existing pull request, continue with this one…');
        }

        this.core.endGroup();
        if (prs.data.length > 0) {
            return {
                number: prs.data[0].number,
                assignees: prs.data[0].assignees?.map(a => a.login) ?? []
            };
        }
        return null;
    }

    private async repoIncludesCommit (sha: string): Promise<boolean> {
        const cache = this.commitCache.get(sha);
        if (cache !== undefined) {
            return cache;
        }

        try {
            await this.github.rest.git.getCommit({
                ...this.context,
                commit_sha: sha
            });

            this.commitCache.set(sha, true);
            return true;
        } catch (error) {
            if (String(error).includes('Not Found')) {
                this.commitCache.set(sha, false);
                return false;
            }

            throw error;
        }
    }

    public addTokenToRepositoryUrl (url: string): string {
        const urlObj = new URL(url);
        if (process.env.GITHUB_ACTOR) {
            urlObj.username = process.env.GITHUB_ACTOR;
            urlObj.password = this.token;
        } else {
            urlObj.username = this.token;
        }

        return urlObj.toString();
    }

    public async createUpdateBranch (repository: Repository, template: TemplateContext, branch: TemplateBranch, username: string, push = true) {
        this.core.startGroup('Create update branch for pull request');

        const tmp = await mkdtemp(join(tmpdir(), 'action-template-updater'));

        try {
            this.core.info(`Clone ${repository.cloneUrl}`);
            await this.git.clone(this.addTokenToRepositoryUrl(repository.cloneUrl), tmp);
            this.git.cwd(tmp);

            this.core.info('Set git user name and email');
            await this.git.addConfig('user.email', 'uyiebuogiacahdohhohd@e.sebbo.net');
            await this.git.addConfig('user.name', username);

            this.core.info(`Add template remote (${template.cloneUrl})`);
            await this.git.addRemote('template', template.cloneUrl);

            this.core.info('Fetch template');
            await this.git.fetch('template', branch.name);

            this.core.info(`Checkout template branch as ${Action.PR_BRANCH_UPDATE_NAME}`);
            await this.git.checkout(['-f', '-b', Action.PR_BRANCH_UPDATE_NAME, '--track', 'template/' + branch.name]);

            if (push) {
                this.core.info('Push template to repository');
                await this.git.push('origin', Action.PR_BRANCH_UPDATE_NAME);
            }
        } finally {
            this.core.info('Remove local repository');
            await rm(tmp, { recursive: true });
            this.core.endGroup();
        }
    }

    public async createOrUpdatePullRequest (pr: PullRequest | null, repository: Repository, template: TemplateContext): Promise<PullRequest> {
        if (!pr) {
            this.core.info('Create Pull Request');
            const data = await this.botGithub.rest.pulls.create({
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
        if (!pr) {
            throw new Error('Unable to continue: Unable to create Pull Request.');
        }
        const pullRequest = pr as PullRequest;
        const assigneesToAdd = this.context.assignees.filter(assignee => !pullRequest.assignees.includes(assignee));
        if (assigneesToAdd.length) {
            this.core.info('Assign these users to pull request: ' + assigneesToAdd.join(', '));
            this.botGithub.rest.issues.addAssignees({
                ...this.context,
                issue_number: pullRequest.number
            });
        }

        return pullRequest;
    }
}
