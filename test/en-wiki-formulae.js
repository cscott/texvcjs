'use strict';
const assert = require('assert');
const texvcjs = require('../');

// mocha is too slow if we run these as 287,201 individual test cases.
// run them in chunks in order to speed up reporting.
const CHUNKSIZE = 1000;

describe('All formulae from en-wiki:', function () {
    this.timeout(0);

    // read test cases
    const formulae = require('./en-wiki-formulae-good.json');

    // group them into chunks
    const mkgroups = function (arr, n) {
        const result = [];
        let group = [];
        Object.keys(arr).forEach(function (elem) {
            group.push({
                input: arr[elem],
                inputhash: elem
            });
            if (group.length >= n) {
                result.push(group);
                group = [];
            }
        });
        if (group.length > 0) {
            result.push(group);
        }
        return result;
    };
    const grouped = mkgroups(formulae, CHUNKSIZE);

    // create a mocha test case for each chunk
    grouped.forEach(function (group) {
        it(group[0].input + ' ... ' + group[group.length - 1].input, () => {
            group.forEach(function (testcase) {
                const f = testcase.input;
                const result = texvcjs.check(f);
                const good = (result.status === '+');
                assert.ok(good, f + ' hash: ' + testcase.inputhash);
                const r1 = texvcjs.check(result.output);
                assert.equal(r1.status, '+', f + ' -> ' + result.output);
            });
        });
    });
});
