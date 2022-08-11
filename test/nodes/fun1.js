const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Fun1 = require('../../lib/nodes/fun1');

describe('Fun1 Node test', function () {

    it('Should not create an empty Fun1', function () {
        assert.throws(()=> new Fun1())
    });

    it('Should not create a Fun1 with one argument', function () {
        assert.throws(()=> new Fun1('\\f'));
    });

    it('Should not create a Fun1 with incorrect type', function () {
        assert.throws(()=> new Fun1('\\f','x'))
    });

    it('Should create an basic function', function () {
        const f =  new Fun1( '\\f', new Literal('a') );
        assert.strictEqual('{\\f {a}}',
            f.render())
    });

    it('Should create exactly on set of curlies', function () {
        const f =  new Fun1( '\\f', new Literal('a') );
        assert.strictEqual('{\\f {a}}',
            f.inCurlies())
    });
    it('Should extract identifiers', function () {
        const n = new Fun1('\\mathbf',new Literal('B'));
        assert.deepEqual(['\\mathbf{B}'],n.extractIdentifiers());
    });
    it('Should not extract extended literals as identifiers', function () {
        const n = new Fun1('\\mathbf', new Literal('\\infty'));
        assert.deepEqual([],n.extractIdentifiers());
    });
    it('Should not extract phantom identifiers', function () {
        const n = new Fun1('\\hphantom', new Literal('A'));
        assert.deepEqual([],n.extractIdentifiers());
    });
    it('Should ignore unknown functions', function () {
        const n = new Fun1('\\unknown', new Literal('A'));
        assert.deepEqual(['A'],n.extractIdentifiers());
    });
    it('Should extract identifier modifications', function () {
        const n = new Fun1('\\mathbf', new Literal('B'));
        assert.deepEqual(['\\mathbf{B}'],n.getModIdent());
    });
    it('Should extract subscripts', function () {
        const n = new Fun1('\\mathbf', new Literal('B'));
        assert.deepEqual(['\\mathbf{B}'],n.extractSubscripts());
    });
    it('Should extract subscripts for extended literals', function () {
        const n = new Fun1('\\mathbf', new Literal('\\infty'));
        assert.deepEqual(['\\mathbf{\\infty}'],n.extractSubscripts());
    });
    it('Should not extract subscripts for empty mods', function () {
        const n = new Fun1('\\mathbf', new Literal(''));
        assert.deepEqual([],n.extractSubscripts());
    });
});
