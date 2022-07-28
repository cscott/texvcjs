// Test AST.
'use strict';
const assert = require('assert');
const ast = require('../lib/ast');

describe('AST', function () {
    it('should construct and stringify', function () {
        const x = ast.Tex.LITERAL('a');
        const y = ast.Tex.UQ(ast.Tex.ARRAY(), x);
        const z = ast.Tex.CURLY([x, y]);

        assert.strictEqual(z.toString(), 'CURLY([LITERAL("a"),UQ(ARRAY(),LITERAL("a"))])');
    });
    it('should perform type-check for custom types', function () {
        assert.strictEqual(
            ast.typecheck(
                {name:'test'},
                {contains:()=>'return-value'} ,
                {}),
            'return-value');
    });
    it('should throw an error on incorrect type', function () {
        assert.throws( () => new ast.Tex.CURLY('a'));
    });

});
