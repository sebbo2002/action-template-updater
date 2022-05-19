'use strict';

import assert from 'assert';
import { core, resetBuffer } from '../../src/lib/core-mock';
import Action, { Context, Repository, TemplateBranch, TemplateContext } from '../../src/lib';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token) {
    throw new Error('Unable to run tests, please set GITHUB_TOKEN or GH_TOKEN environment variable');
}

describe('Action', function () {
    this.timeout(90000);
    beforeEach(function () {
        resetBuffer();
    });

    describe('getTokenUser()', function () {
        it('should not return fallback value as we probably have a real token', async function () {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
                assignees: []
            };
            const action = new Action(token, context, core);
            const username = await action.getTokenUser();
            assert.ok(username);
        });
    });
    describe('getRepository()', function () {
        it('should work', async function () {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
                assignees: []
            };
            const action = new Action(token, context, core);
            const repo = await action.getRepository();

            assert.deepStrictEqual(repo, {
                name: 'ical-generator',
                defaultBranch: 'develop',
                cloneUrl: 'https://github.com/sebbo2002/ical-generator.git'
            });
        });
        it('should throw error if invalid', async function () {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'not-found',
                template: 'sebbo2002/js-template',
                assignees: []
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
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
                assignees: []
            };
            const action = new Action(token, context, core);
            const repo = await action.getTemplate();

            assert.deepEqual(repo, {
                name: 'js-template',
                owner: 'sebbo2002',
                url: 'https://github.com/sebbo2002/js-template',
                cloneUrl: 'https://github.com/sebbo2002/js-template.git'
            });
        });
        it('should throw error if invalid', async function () {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/not-found',
                assignees: []
            };
            const action = new Action(token, context, core);

            await assert.rejects(async () => {
                await action.getTemplate();
            }, /Unable to find template sebbo2002\/not-found/);
        });
    });
    describe('findPullRequest()', function () {
        it('should not throw errors', async function () {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
                assignees: []
            };
            const action = new Action(token, context, core);
            await action.findPullRequest('develop', 'sebbo2002');
        });
    });
    describe('getTemplateBranches()', function () {
        it('should work for typescript repos', async function () {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
                assignees: []
            };
            const action = new Action(token, context, core);
            const branch = await action.getTemplateBranch({
                name: 'js-template',
                owner: 'sebbo2002',
                url: '',
                cloneUrl: ''
            });

            assert.strictEqual(branch.name, 'typescript');
        });
        it('should work for javascript repos', async function () {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'ble2mqtt',
                template: 'sebbo2002/js-template',
                assignees: []
            };
            const action = new Action(token, context, core);
            const branch = await action.getTemplateBranch({
                name: 'js-template',
                owner: 'sebbo2002',
                url: '',
                cloneUrl: ''
            });

            assert.strictEqual(branch.name, 'javascript-docker');
        });
        it('should work for github-action repos', async function () {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'action-is-semantic-pr',
                template: 'sebbo2002/js-template',
                assignees: []
            };
            const action = new Action(token, context, core);
            const branch = await action.getTemplateBranch({
                name: 'js-template',
                owner: 'sebbo2002',
                url: '',
                cloneUrl: ''
            });

            assert.strictEqual(branch.name, 'github-actions');
        });
    });
    /* describe('addTokenToRepositoryUrl()', function () {
        it('should work', async function () {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
                assignees: []
            };
            const action = new Action('hello-world', context, core);
            const url = action.addTokenToRepositoryUrl('https://github.com/sebbo2002/ical-generator.git');
            assert.strictEqual(url, 'https://hello-world@github.com/sebbo2002/ical-generator.git');
        });
    }); */
    describe('createUpdateBranch()', function () {
        it('should work (dry-run)', async function() {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'ical-generator',
                template: 'sebbo2002/js-template',
                assignees: []
            };
            const repository: Repository = {
                name: 'ical-generator',
                defaultBranch: 'develop',
                cloneUrl: 'https://github.com/sebbo2002/ical-generator.git'
            };
            const template: TemplateContext = {
                name: 'js-template',
                owner: 'sebbo2002',
                url: 'https://github.com/sebbo2002/js-template',
                cloneUrl: 'https://github.com/sebbo2002/js-template.git'
            };
            const branch: TemplateBranch = {
                name: 'typescript',
                sha: '',
                parents: [],
                commits: [],
                unique: []
            };

            const action = new Action(token, context, core);
            await action.createUpdateBranch(repository, template, branch, 'unit-test', false);
        });
    });

    describe('Playground', function () {
        it('@sebbo2002/action-is-semantic-pr', async function () {
            const context: Context = {
                owner: 'sebbo2002',
                repo: 'fhem-log2db',
                template: 'sebbo2002/js-template',
                assignees: ['sebbo2002']
            };
            await new Action(token, context, core).run();
        });
    });
});
