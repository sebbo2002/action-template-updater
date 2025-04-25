import * as core from '@actions/core';
import { context } from '@actions/github';

import Action from './lib/index.js';

try {
    const token = core.getInput('token');
    const myContext = {
        owner: context.repo.owner,
        repo: context.repo.repo,
    };

    const action = new Action(token, myContext, core);
    action.run().catch((error: unknown) => core.setFailed(String(error)));
} catch (error) {
    if (error instanceof Error) {
        core.setFailed(error.message);
    } else {
        core.setFailed(String(error));
    }
}
