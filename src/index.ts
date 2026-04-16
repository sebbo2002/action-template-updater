import * as core from '@actions/core';
import { context } from '@actions/github';

import Action from './lib/index.js';

try {
    const token = core.getInput('token');
    const botToken = core.getInput('bot-token') || token;
    const myContext = {
        assignees: core
            .getInput('assignees')
            .split(',')
            .map((u) => u.trim())
            .filter(Boolean),
        owner: context.repo.owner,
        repo: context.repo.repo,
        template: core.getInput('template'),
    };

    const action = new Action(token, myContext, core, botToken);
    action.run().catch((error: unknown) => core.setFailed(String(error)));
} catch (error) {
    if (error instanceof Error) {
        core.setFailed(error.message);
    } else {
        core.setFailed(String(error));
    }
}
