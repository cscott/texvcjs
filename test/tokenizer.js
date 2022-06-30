"use strict";
var assert = require('assert');
var texvc = require('../');
var lister = require('../lib/flatList');
var testcases = [
    {in: '', out: []},
    {in: 'a', out: [['LITERAL', ''], ['TEX_ONLY', 'a']]},
    {in: 'a^2', out: [['UQ', ''], ['LITERAL', ''], ['TEX_ONLY', 'a'], ['LITERAL', ''], ['TEX_ONLY', '2']]},
    {
        in: 'a^2+b^2',
        out: [['UQ', ''], ['LITERAL', ''], ['TEX_ONLY', 'a'], ['LITERAL', ''], ['TEX_ONLY', '2'],
            ["LITERAL", ""], ["TEX_ONLY", "+"],
            ['UQ', ''], ['LITERAL', ''], ['TEX_ONLY', 'b'], ['LITERAL', ''], ['TEX_ONLY', '2']]
    },
    {
        in: 'a^{2}+b^{2}',
        out: [['UQ', ''], ['LITERAL', ''], ['TEX_ONLY', 'a'], ['CURLY', ''], ['LITERAL', ''], ['TEX_ONLY', '2'],
            ["LITERAL", ""], ["TEX_ONLY", "+"],
            ['UQ', ''], ['LITERAL', ''], ['TEX_ONLY', 'b'], ['CURLY', ''], ['LITERAL', ''], ['TEX_ONLY', '2']]
    },
    {
        in: '\\frac2b',
        out: [['FUN2', '\\frac'], ['LITERAL', ''], ['TEX_ONLY', '2'], ['LITERAL', ''], ['TEX_ONLY', 'b']]
    }
];

describe('Tokens', function () {
    testcases.forEach(function (tc) {
        var input = tc.in;
        var output = tc.out;
        it('should correctly render ' + JSON.stringify(input), function () {
            assert.deepEqual(lister(texvc.parse(input)), output);
        });
    });
});