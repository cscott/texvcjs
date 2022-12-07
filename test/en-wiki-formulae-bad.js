'use strict';
const assert = require('assert');
const texvcjs = require('../');


describe('Some broken formulae from en-wiki:', function () {
    const formulae = require('./en-wiki-formulae-bad.json');
    Object.keys(formulae).forEach(function (key) {
        it(formulae[key].substring(0,20) + ' ' + key, () => {
            const testcase = {
                inputhash: key,
                input: formulae[key]
            }
            const f = testcase.input;
            const result = texvcjs.check(f);
            const good = (result.status === '+');
            assert.ok(!good, f + ' hash: ' + testcase.inputhash);
            });
        });
});

