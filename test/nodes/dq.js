const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Dq = require('../../lib/nodes/dq');

const TexNode = require('../../lib/nodes/texnode');
const TexArray = require("../../lib/nodes/texArray");

describe('DQ Node test', function () {
    it('Should not create an empty Dq', function () {
        assert.throws(()=> new Dq())
    });
    it('Should not create a Dq with one argument', function () {
        assert.throws(()=> new Dq('a'))
    });
    it('Should not create a Dq with incorrect type', function () {
        assert.throws(()=> new Dq('a','b'))
    });
    it('Should create an basic Dq', function () {
        const dq =  new Dq(new Literal('a'), new Literal('b'));
        assert.strictEqual('a_{b}', dq.render())
    });
    it('Should create an empty base Dq', function () {
        const dq =  new Dq(new TexNode(), new Literal('b'));
        assert.strictEqual('_{b}', dq.render())
    });
    it('Should extract identifiers', function () {
        const n = new Dq(new Literal('a'), new Literal('b'));
        assert.deepEqual(['a_{b}'],n.extractIdentifiers());
    });
    it('Should extract identifiers for uncertain base', function () {
        const n = new Dq(
            new TexArray(new Literal('a'), new Literal('b')),
            new Literal('c'));
        assert.deepEqual(['a', 'b', 'c'],n.extractIdentifiers());
    });
    it('Should extract identifiers of derivatives', function () {
        const n = new Dq(new Literal('\''), new Literal('b'));
        assert.deepEqual(['\'','b'],n.extractIdentifiers());
    });
    it('Should extract identifiers with empty base', function () {
        const n = new Dq(new Literal(''), new Literal('b'));
        assert.deepEqual(['b'],n.extractIdentifiers());
    });
    it('Should extract identifiers in integral', function () {
        const n = new Dq(new Literal('\\int'), new Literal('t'));
        assert.deepEqual(['\\int','t'],n.extractIdentifiers());
    });
    it('Should extract subscripts', function () {
        const n = new Dq(new Literal('a'), new Literal('b'));
        assert.deepEqual(['a_{b}'],n.extractSubscripts());
    });
    it('Should not extract subscripts for unknown constructs', function () {
        const n = new Dq(new Literal('a'), new Literal('\\unknown'));
        assert.deepEqual([],n.extractSubscripts());
    });
});
