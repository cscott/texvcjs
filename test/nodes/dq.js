const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Dq = require('../../lib/nodes/dq');

const TexNode = require('../../lib/nodes/texnode');

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
});
