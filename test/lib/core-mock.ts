'use strict';

import assert from 'assert';
import { core, getBuffer } from '../../src/lib/core-mock.js';

describe('CoreMock', function () {
    it('should support basic methods to work with', function () {
        const error = new Error('Error');

        core.info('Info');
        core.endGroup();
        core.error(error);
        core.startGroup('Start group');
        core.warning('Warning');
        core.setOutput('key', 'value');
        core.endGroup();
        core.notice('Notice');

        assert.deepStrictEqual(getBuffer(), [
            ['info', 'Info'],
            ['error', error],
            ['group', 'Start group', [
                ['warning', 'Warning']
            ]],
            ['output', 'key', 'value'],
            ['notice', 'Notice']
        ]);
    });
});
