'use strict';

import assert from 'assert';

import { core, getBuffer, resetBuffer } from '../../src/lib/core-mock.js';
import Action, { Context } from '../../src/lib/index.js';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token) {
    throw new Error(
        'Unable to run tests, please set GITHUB_TOKEN or GH_TOKEN environment variable',
    );
}

describe('Action', function () {
    this.timeout(10000);
    beforeEach(function () {
        resetBuffer();
    });

    it('should print the owner', async function () {
        const context: Context = {
            owner: 'sebbo2002',
            repo: 'test',
        };

        await new Action(token, context, core).run();
        assert.deepStrictEqual(getBuffer(), [['info', 'Hello sebbo2002 👋🏼']]);
    });
});
