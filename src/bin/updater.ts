import { type CoreInterface, type CoreMockMessage } from '../lib/core-mock.js';
import Action, { type Context } from '../lib/index.js';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token) {
    throw new Error('GITHUB_TOKEN not set.');
}

const args = process.argv.filter((s) => s.substring(0, 1) !== '/');
let group: string | undefined;
let context: Context | null = null;

if (
    args.length === 2 &&
    args[0].split('/').length === 3 &&
    args[1].split('/').length === 2
) {
    context = {
        assignees: [],
        owner: args[1].split('/')[0],
        repo: args[1].split('/')[1],
        template: args[0],
    };
} else {
    throw new Error('Usage: updater [user/template/branch] [user/repo]');
}

function add(message: CoreMockMessage): void {
    if (group) {
        console.log(
            `[${new Date().toJSON()}][${group}][${message[0]}] ${message[1]}`,
        );
    } else {
        console.log(`[${new Date().toJSON()}][${message[0]}] ${message[1]}`);
    }
}

const core: CoreInterface = {
    endGroup() {
        if (group) {
            group = undefined;
        }
    },

    error(message: Error | string) {
        add(['error', message]);
    },

    info(message: string) {
        add(['info', message]);
    },

    notice(message: string) {
        add(['notice', message]);
    },

    setOutput(key: string, value: unknown): void {
        console.log(
            `[${new Date().toJSON()}] Set output variable ${key} to ${value}`,
        );
    },

    startGroup(message: string) {
        group = message;
    },

    warning(message: Error | string) {
        add(['warning', message]);
    },
};

new Action(token, context, core).run().catch((error) => {
    console.log(error);
    process.exit(1);
});
