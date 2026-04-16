import { type CoreInterface } from './core-mock.js';
export interface Context {
    assignees: string[];
    owner: string;
    repo: string;
    template: string;
}
export interface PullRequest {
    assignees: string[];
    number: number;
}
export interface Repository {
    cloneUrl: string;
    defaultBranch: string;
    name: string;
}
export interface TemplateBranch {
    name: string;
    sha: string;
}
export interface TemplateBranchCommit {
    date: Date | null;
    parents: string[];
    sha: string;
}
export interface TemplateContext {
    cloneUrl: string;
    name: string;
    owner: string;
    url: string;
}
export default class Action {
    private static readonly PR_BRANCH_UPDATE_NAME;
    private readonly botGithub;
    private readonly botToken;
    private readonly commitCache;
    private readonly context;
    private readonly core;
    private readonly git;
    private readonly github;
    private readonly token;
    constructor(token: string, context: Context, core: CoreInterface, botToken?: string);
    addTokenToRepositoryUrl(url: string): string;
    createOrUpdatePullRequest(pr: null | PullRequest, repository: Repository, template: TemplateContext): Promise<PullRequest>;
    createUpdateBranch(repository: Repository, template: TemplateContext, branch: TemplateBranch, username: string, push?: boolean): Promise<void>;
    findPullRequest(defaultBranch: string): Promise<null | PullRequest>;
    getRepository(): Promise<Repository>;
    getTemplateAndBranch(): Promise<{
        template: TemplateContext;
        templateBranch: TemplateBranch;
    }>;
    getTokenUser(): Promise<string>;
    run(): Promise<void>;
    private repoIncludesCommit;
}
