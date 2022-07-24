"use strict";
const assert = require('assert');
const ast = require('../../').ast;

describe('extractSubscipts visitor should', function () {
    it('handle ARRAY', function () {
        const expr = new ast.Tex.ARRAY( new ast.Tex.LITERAL('a'))
        assert.deepStrictEqual(expr.extractSubscipts(),'a')
    });
    it('handle Fun1', function () {
        const expr = new ast.Tex.FUN1( 'invalid', new ast.Tex.LITERAL('a'))
        assert.deepStrictEqual(expr.extractSubscipts(),[])
    });
});
