"use strict";
var assert = require('assert');
var texvc = require("../");
var lister = require('../lib/identifier').render;
var goldData = require('./goldData');


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

/**
 * Self test with the data generated with a gold standard.
 */
describe('Gold Identifiers', function () {
    goldData.goldData.forEach(function (tc) {
        var input = tc.math_inputtex;
        var output = tc.identifier.filter(onlyUnique);
        tc.fn.forEach(function (fn) {
            var index = output.indexOf(fn);
            if(index > -1){
                output.splice(index, 1);
            }
        });
        it('in qID' + tc.qID + ' should be discovered ' + JSON.stringify(input), function () {
            var extracted = lister(texvc.parse(input)).filter(onlyUnique);
            tc.fp.forEach(function (fp) {
                var index = extracted.indexOf(fp);
                if(index > -1){
                    extracted.splice(index, 1);
                }
            });
            assert.deepEqual(extracted, output);
        });
    });
});
