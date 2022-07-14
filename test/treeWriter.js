"use strict";
var assert = require('assert');
var texvc = require('../');
var lister = require('../lib/arrayTree');
var testcases = [
    {in: '', out: []},
    {
        in: '3+\\frac1{7+\\frac1{15+\\dots}}',
        out: [["LITERAL", ["3"]], ["LITERAL", ["+"]], ["FUN2", ["\\frac"], ["LITERAL",  ["1"]], ["CURLY", [["LITERAL",  ["7"]], ["LITERAL",  ["+"]], ["FUN2", ["\\frac"], ["LITERAL", ["1"]], ["CURLY", [["LITERAL",  ["1"]], ["LITERAL",  ["5"]], ["LITERAL",  ["+"]], ["LITERAL",  ["\\dots "]]]]]]]]]
    },
    {
        in: '\\ce{H2O}',
        out: [["MHCHEM", ["\\ce"], ["CURLY", [["CHEM_WORD", ["LITERAL", ["H"]], ["CHEM_WORD", ["LITERAL", ["2"]], ["CHEM_WORD", ["LITERAL", ["O"]], ["LITERAL",  [""]]]]]]]]]
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
