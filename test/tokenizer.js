"use strict";
var assert = require('assert');
var texvc = require('../');
var lister = require('../lib/flatList');
var testcases = [
    {in: '', out: []},
    {in: 'a', out: [['LITERAL', 'a']]},
    {in: 'a^2', out: [['UQ', ''], ['LITERAL', 'a'], ['LITERAL', '2']]},
    {
        in: 'a^2+b^2',
        out: [['UQ', ''], ['LITERAL',  'a'], ['LITERAL',  '2'],
            ["LITERAL",  "+"],
            ['UQ', ''], ['LITERAL', 'b'], ['LITERAL', '2']]
    },
    {
        in: 'a^{2}+b^{2}',
        out: [['UQ', ''], ['LITERAL', 'a'], ['CURLY', ''], ['LITERAL',  '2'],
            ["LITERAL",  "+"],
            ['UQ', ''], ['LITERAL', 'b'], ['CURLY', ''], ['LITERAL',  '2']]
    },
    {
        in: '\\frac2b',
        out: [['FUN2', '\\frac'], ['LITERAL',  '2'], ['LITERAL',  'b']]
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
