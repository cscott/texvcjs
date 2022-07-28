const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Fq = require('../../lib/nodes/fq');

describe('Fq Node test', function () {
    it('Should not create an empty Fq', function () {
        assert.throws(()=> new Fq())
    });
    it('Should not create a Fq with one argument', function () {
        assert.throws(()=> new Fq(new Literal('a')))
    });
    it('Should not create a Fq with incorrect type', function () {
        assert.throws(()=> new Fq('a','b','c'))
    });
    it('Should create an basic Fq', function () {
        const fq =  new Fq(
            new Literal('a'),
            new Literal('b'),
            new Literal('c'));
        assert.strictEqual('a_{b}^{c}',
            fq.render())
    });
    it('Should apply contains_func on children', function () {
        const fq =  new Fq(
            new Literal('a'),
            new Literal('\\foo'),
            new Literal('c'));
        assert.ok(fq.contains_func('\\foo'))
    });
});
