const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Lr = require('../../lib/nodes/lr');
const TexArray = require('../../lib/nodes/texArray');
const TexNode = require("../../lib/nodes/texnode");


describe('Lr Node test', function () {

    it('Should not create an empty Lr', function () {
        assert.throws(()=> new Lr())
    });

    it('Should not create a Lr with one argument', function () {
        assert.throws(()=> new Lr('('));
    });

    it('Should not create a Lr with incorrect type', function () {
        assert.throws(()=> new Lr('(',')', new Literal('a')))
    });

    it('Should create a basic function', function () {
        const f =  new Lr( '(',')', new TexArray( new Literal('a')) );
        assert.strictEqual('\\left(a\\right)',
            f.render())
    });

    it('Should create exactly one set of curlies', function () {
        const f =  new Lr( '(',')', new TexArray( new Literal('a'), new Literal('b') ) );
        assert.strictEqual('{\\left(ab\\right)}',
            f.inCurlies())
    });

    it('Should extract identifiers', function () {
        const n = new Lr( '(',')', new TexArray( new Literal('a'), new Literal('b') ) );
        assert.deepEqual(['a','b'],n.extractIdentifiers());
    });
});
