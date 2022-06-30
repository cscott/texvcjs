"use strict";
var assert = require('assert');
var texvc = require('../');
var lister = require('../lib/arrayTree');
var testcases = [
    {in: '', out: []},
    {
        in: '3+\\frac1{7+\\frac1{15+\\dots}}',
        out: [["LITERAL", ["TEX_ONLY", ["3"]]], ["LITERAL", ["TEX_ONLY", ["+"]]], ["FUN2", ["\\frac"], ["LITERAL", ["TEX_ONLY", ["1"]]], ["CURLY", [["LITERAL", ["TEX_ONLY", ["7"]]], ["LITERAL", ["TEX_ONLY", ["+"]]], ["FUN2", ["\\frac"], ["LITERAL", ["TEX_ONLY", ["1"]]], ["CURLY", [["LITERAL", ["TEX_ONLY", ["1"]]], ["LITERAL", ["TEX_ONLY", ["5"]]], ["LITERAL", ["TEX_ONLY", ["+"]]], ["LITERAL", ["TEX_ONLY", ["\\dots "]]]]]]]]]]
    },
    {
        in: '\\ce{H2O}',
        out: [["MHCHEM", ["\\ce"], ["CURLY", [["CHEM_WORD", ["LITERAL", ["TEX_ONLY", ["H"]]], ["CHEM_WORD", ["LITERAL", ["TEX_ONLY", ["2"]]], ["CHEM_WORD", ["LITERAL", ["TEX_ONLY", ["O"]]], ["LITERAL", ["TEX_ONLY", [""]]]]]]]]]]
    },
];

describe('Array Tree', function () {
    testcases.forEach(function (tc) {
        var input = tc.in;
        var output = tc.out;
        it('should correctly render ' + JSON.stringify(input), function () {
            assert.deepEqual(lister(texvc.parse(input)), output);
        });
    });
});