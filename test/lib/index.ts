'use strict';

import assert from 'assert';

import { core, resetBuffer } from '../../src/lib/core-mock.js';
import Action, {
    Context,
    Repository,
    TemplateBranch,
    TemplateContext,
} from '../../src/lib/index.js';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token) {
    throw new Error(
        'Unable to run tests, please set GITHUB_TOKEN or GH_TOKEN environment variable',
    );
}

describe('Action', function () {
    this.timeout(90000);
    beforeEach(function () {
        resetBuffer();
    });

    describe('getTokenUser()', function () {
        it('should not return fallback value as we probably have a real token', async function () {
            const context: Context = {
                assignees: [],
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
            };
            const action = new Action(token, context, core);
            const username = await action.getTokenUser();
            assert.ok(username);
        });
    });
    describe('getRepository()', function () {
        it('should work', async function () {
            const context: Context = {
                assignees: [],
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
            };
            const action = new Action(token, context, core);
            const repo = await action.getRepository();

            assert.deepStrictEqual(repo, {
                cloneUrl: 'https://github.com/sebbo2002/ical-generator.git',
                defaultBranch: 'develop',
                name: 'ical-generator',
            });
        });
        it('should throw error if invalid', async function () {
            const context: Context = {
                assignees: [],
                owner: 'sebbo2002',
                repo: 'not-found',
                template: 'sebbo2002/js-template',
            };
            const action = new Action(token, context, core);

            await assert.rejects(async () => {
                await action.getRepository();
            }, /Unable to find template:/);
        });
    });
    describe('getTemplate()', function () {
        it('should work', async function () {
            const context: Context = {
                assignees: [],
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template/typescript-docker',
            };
            const action = new Action(token, context, core);
            const result = await action.getTemplateAndBranch();

            assert.deepEqual(result.template, {
                cloneUrl: 'https://github.com/sebbo2002/js-template.git',
                name: 'js-template',
                owner: 'sebbo2002',
                url: 'https://github.com/sebbo2002/js-template',
            });
            assert.equal(result.templateBranch.name, 'typescript-docker');
        });
        it('should throw error if invalid', async function () {
            const context: Context = {
                assignees: [],
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/not-found',
            };
            const action = new Action(token, context, core);

            await assert.rejects(async () => {
                await action.getTemplateAndBranch();
            }, /Unable to find template sebbo2002\/not-found/);
        });
    });
    describe('findPullRequest()', function () {
        it('should not throw errors', async function () {
            const context: Context = {
                assignees: [],
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
            };
            const action = new Action(token, context, core);
            await action.findPullRequest('develop');
        });
    });
    describe('createUpdateBranch()', function () {
        it('should work (dry-run)', async function () {
            const context: Context = {
                assignees: [],
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
            };
            const repository: Repository = {
                cloneUrl: 'https://github.com/sebbo2002/ical-generator.git',
                defaultBranch: 'develop',
                name: 'ical-generator',
            };
            const template: TemplateContext = {
                cloneUrl: 'https://github.com/sebbo2002/js-template.git',
                name: 'js-template',
                owner: 'sebbo2002',
                url: 'https://github.com/sebbo2002/js-template',
            };
            const branch: TemplateBranch = {
                name: 'typescript',
                sha: '',
            };

            const action = new Action(token, context, core);
            await action.createUpdateBranch(
                repository,
                template,
                branch,
                'unit-test',
                false,
            );
        });
    });
});
