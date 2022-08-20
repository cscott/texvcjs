'use strict';
const assert = require('assert');
const texvcjs = require('../');
const NodeUtil = require("../lib/nodes/nodeutil");

describe('Run test for all mathjax-texvc commands:', function () {
    this.timeout(0);
    // read test cases
    const formulae = require('./mathjax-texvc.json');
    // create a mocha test case for each chunk
    formulae.forEach(function (testcase) {
        if (testcase.ignore !== true) {
            it(testcase.id + ' $' + testcase.input + '$', function () {
                const result = texvcjs.check(testcase.input, testcase.options);
                assert.equal(result.output, testcase.texvcjs,
                    JSON.stringify({
                        id: testcase.id,
                        output: result.output,
                        expected: testcase.texvcjs
                    }, null, 2));
                assert.equal(result.status, '+');
                assert.equal(
                    result.warnings.length,
                    testcase.warnCount || 0,
                    'incorrect number of warnings');
                assert.strictEqual(
                    NodeUtil.toNode(result.input).render(),
                    result.output,
                    'Traditional and node based rendering differ');
            });
        }
    });
});
