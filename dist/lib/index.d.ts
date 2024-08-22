import { type CoreInterface } from './core-mock.js';
export interface Context {
    owner: string;
    repo: string;
    template: string;
    assignees: string[];
}
export interface Repository {
    name: string;
    defaultBranch: string;
    cloneUrl: string;
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
    private readonly github;
    private readonly botGithub;
    private readonly git;
    private readonly context;
    private readonly token;
    private readonly botToken;
    private readonly core;
    private readonly commitCache;
    private static readonly PR_BRANCH_UPDATE_NAME;
    constructor(token: string, context: Context, core: CoreInterface, botToken?: string);
    run(): Promise<void>;
    getTokenUser(): Promise<string>;
    getRepository(): Promise<Repository>;
    getTemplateAndBranch(): Promise<{
        template: TemplateContext;
        templateBranch: TemplateBranch;
    }>;
    findPullRequest(defaultBranch: string): Promise<null | PullRequest>;
    private repoIncludesCommit;
    addTokenToRepositoryUrl(url: string): string;
    createUpdateBranch(repository: Repository, template: TemplateContext, branch: TemplateBranch, username: string, push?: boolean): Promise<void>;
    createOrUpdatePullRequest(pr: PullRequest | null, repository: Repository, template: TemplateContext): Promise<PullRequest>;
}
