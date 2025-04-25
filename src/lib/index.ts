import { CoreInterface } from './core-mock.js';

export interface Context {
    owner: string;
    repo: string;
}

export default class Action {
    private readonly context: Context;
    private readonly core: CoreInterface;

    constructor(token: string, context: Context, core: CoreInterface) {
        this.context = context;
        this.core = core;
    }
    public async run(): Promise<void> {
        this.core.info(`Hello ${this.context.owner} 👋🏼`);
    }
}
