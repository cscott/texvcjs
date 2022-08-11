const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const TexArray = require('../../lib/nodes/texArray');

const TexNode = require('../../lib/nodes/texnode');

describe('Array Node test', function () {
    // This seems not be not easily possible in JS, without the trick to
    // pass a base type to the constructor of texNode.
    it.skip('Should create an instance of Array', function () {
        assert.ok(Array.isArray(new TexArray()));
    });
    it('Should create an instance of TexNode', function () {
        assert.ok(new TexArray() instanceof TexNode)
    });
    it('Should concatenate its input', function () {
        const array = new TexArray(new Literal('a'), new Literal('b'));
        assert.strictEqual('ab', array.render())
    });
    it('Should create exactly one pair of curlies', function () {
        const n = new TexNode(new TexArray(new Literal('a')) );
        assert.strictEqual('{a}',n.inCurlies());
    });
    it('Should extract identifiers', function () {
        const n = new TexArray(new Literal('d'));
        assert.deepEqual(['d'], n.extractIdentifiers());
    });
    it('Should extract identifiers from the argument.', function () {
        const n = new TexArray();
        assert.deepEqual(['d'], n.extractIdentifiers([new Literal('d')]));
    });
    it('Should extract split identifiers', function () {
        const n = new TexArray(new Literal('a'), new Literal('\''));
        assert.deepEqual(['a\''], n.extractIdentifiers());
    });
    it('Should not confuse integrals and identifiers', function () {
        const n = new TexArray(new Literal('d'), new Literal('\\int'));
        assert.deepEqual(['d'], n.extractIdentifiers());
    });
    it('Should not confuse integral d with d identifier', function () {
        const n = new TexArray( new Literal('\\int'), new Literal('d'));
        assert.deepEqual([], n.extractIdentifiers());
    });
    it('Should not confuse upright integral d with d identifier', function () {
        const n = new TexArray( new Literal('\\int'), new Literal('\\mathrm{d}'));
        assert.deepEqual([], n.extractIdentifiers());
    });
    it('Should extract identifier modifications', function () {
        const n = new TexArray( new TexNode('') );
        assert.deepEqual([],n.getModIdent());
    });
    it('Should extract subscripts', function () {
        const n = new TexArray(new TexNode(''));
        assert.deepEqual([],n.extractSubscripts());
    });
});
