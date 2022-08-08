"use strict";
const assert = require('assert');
const texvc = require("../");
const goldData = require('./goldData');


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

/**
 * Self test with the data generated with a gold standard.
 */
describe('Gold Identifiers', function () {
    goldData.goldData.forEach(function (tc) {
        const input = tc.math_inputtex;
        const output = tc.identifier.filter(onlyUnique);
        tc.fn.forEach(function (fn) {
            const index = output.indexOf(fn);
            if(index > -1){
                output.splice(index, 1);
            }
        });
        it('in qID' + tc.qID + ' should be discovered ' + JSON.stringify(input), function () {
            const extracted = texvc.parse(input).extractIdentifiers().filter(onlyUnique);
            tc.fp.forEach(function (fp) {
                const index = extracted.indexOf(fp);
                if(index > -1){
                    extracted.splice(index, 1);
                }
            });
            assert.deepEqual(extracted, output);
        });
    });
});
