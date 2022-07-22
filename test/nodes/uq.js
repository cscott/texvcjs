const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Uq = require('../../lib/nodes/uq');

const TexNode = require('../../lib/nodes/texnode');

describe('Uq Node test', function () {
    it('Should not create an empty Uq', function () {
        assert.throws(()=> new Uq())
    });

    it('Should not create a Uq with one argument', function () {
        assert.throws(()=> new Uq(new Literal('a')))
    });

    it('Should not create a Uq with incorrect type', function () {
        assert.throws(()=> new Uq('a','b'))
    });

    it('Should create an basic Uq', function () {
        const uq =  new Uq(new Literal('a'), new Literal('b'));
        assert.strictEqual('a^{b}', uq.render())
    });

    it('Should create an empty base Uq', function () {
        const uq =  new Uq(new TexNode(), new Literal('b'));
        assert.strictEqual('^{b}', uq.render())
    });
});
