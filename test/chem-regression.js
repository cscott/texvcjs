"use strict";
var assert = require('assert');
var texvcjs = require('../');

// mocha is too slow if we run these as individual test cases.
// run them in chunks in order to speed up reporting.
var CHUNKSIZE = 1000;

describe('All formulae from chem regression dataset:', function() {
    this.timeout(0);

    // read test cases
    var formulae =  require('./chem-regression.json');

    // group them into chunks
    var mkgroups = function(arr, n) {
        var result = [], group = [];
        var seen = Object.create(null);
        arr.forEach(function(elem) {
            if (seen[elem.input]) { return; } else { seen[elem.input] = true; }
            group.push(elem);
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
    var grouped = mkgroups(formulae, CHUNKSIZE);

    // create a mocha test case for each chunk
    grouped.forEach(function (group) {
        it(group[0].input + ' ... ' + group[group.length - 1].input, function () {
            group.forEach(function (testcase) {
                  if(testcase.type === 'chem'){
                    testcase.options = {
                      usemhchem:true
                    };
                  }
              var result = texvcjs.check(testcase.input,testcase.options);
              assert.equal(result.status, '+',
                JSON.stringify({
                  id: testcase.inputhash,
                  output: result.output
                }, null, 2));
            });
        });
    });
});
