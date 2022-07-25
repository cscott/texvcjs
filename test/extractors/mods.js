"use strict";
const assert = require('assert');
const ast = require('../../').ast;

describe('getModIdent', function () {
    it('visitor should handle ARRAY', function () {
        const expr = new ast.Tex.ARRAY( new ast.Tex.LITERAL('a'))
        assert.deepStrictEqual(expr.getModIdent(),'a')
    });
});
