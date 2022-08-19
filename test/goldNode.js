"use strict";
const assert = require('assert');
const texvc = require("../");
const goldData = require('./goldData');
const NodeUtil = require("../lib/nodes/nodeutil");


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

describe('Gold Identifiers (Node test)', function () {
    goldData.goldData.forEach(function (testcase) {
        const input = testcase.math_inputtex;
        const output = testcase.identifier.filter(onlyUnique);
        testcase.fn.forEach(function (fn) {
            const index = output.indexOf(fn);
            if(index > -1){
                output.splice(index, 1);
            }
        });
        it('in qID' + testcase.qID + ' should be discovered ' + JSON.stringify(input), function () {
            const extracted = NodeUtil.toNode(texvc.parse(input)).extractIdentifiers().filter(onlyUnique);
            testcase.fp.forEach(function (falsePositive) {
                const index = extracted.indexOf(falsePositive);
                if(index > -1){
                    extracted.splice(index, 1);
                }
            });
            assert.deepStrictEqual(extracted, output);
        });
    });
});
