import { CoreInterface } from './core-mock';
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
    parents: string[];
    commits: TemplateBranchCommit[];
    unique: string[];
}
export default class Action {
    private readonly github;
    private readonly git;
    private readonly context;
    private readonly token;
    private readonly core;
    private readonly commitCache;
    private static readonly PR_BRANCH_UPDATE_NAME;
    constructor(token: string, context: Context, core: CoreInterface);
    run(): Promise<void>;
    getTokenUser(): Promise<string>;
    getRepository(): Promise<Repository>;
    getTemplate(): Promise<TemplateContext>;
    findPullRequest(defaultBranch: string, tokenUser: string): Promise<null | PullRequest>;
    getTemplateBranch(template: TemplateContext): Promise<TemplateBranch>;
    private detectTemplateBranch;
    private repoIncludesCommit;
    addTokenToRepositoryUrl(url: string): string;
    createUpdateBranch(repository: Repository, template: TemplateContext, branch: TemplateBranch, username: string, push?: boolean): Promise<void>;
    createOrUpdatePullRequest(pr: PullRequest | null, repository: Repository, template: TemplateContext): Promise<PullRequest>;
}
