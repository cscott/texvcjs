"use strict";
var assert = require('assert');
var texvcjs = require('../');

var fs = require('fs');
var path = require('path');


describe('Run test for all mathjax-texvc commands:', function () {
    this.timeout(0);
    // read test cases
    var formulae = require('./mathjax-texvc.json');
    // create a mocha test case for each chunk
    formulae.forEach(function (testcase) {
        if (testcase.ignore !== true) {
            it(testcase.id+"$"+testcase.input+"$", function () {
                var result = texvcjs.check(testcase.input,{usemathrm:true});
                assert.equal(result.output, testcase.texvcjs,
                    JSON.stringify({
                        id: testcase.id,
                        output: result.output,
                        expected: testcase.texvcjs
                    }, null, 2));
            });
        }
    });
});
