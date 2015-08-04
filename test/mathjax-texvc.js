"use strict";
var assert = require('assert');
var texvcjs = require('../');

var fs = require('fs');
var path = require('path');


describe('Wikimedia-specific commands should be translated', function () {
    // read test cases
    var formulae = require('./mathjax-texvc.json');
    // create a mocha test case for each chunk
    formulae.forEach(function (testcase) {
        if(testcase.ignore !== true ) {
            it(testcase.id+": $"+testcase.input+"$", function (done) {
                var result = texvcjs.check(testcase.input);
                assert.equal(result.output, testcase.texvcjs, testcase.id + " failed\n got '" +
                    result.output + "' and not '" + testcase.texvcjs +"'.");
                done();
            });
        }
    });
});

