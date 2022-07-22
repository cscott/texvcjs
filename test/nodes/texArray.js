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
    it('Should not exactly one pair of curlies', function () {
        const n = new TexNode(new TexArray('a') );
        assert.strictEqual('{a}',n.inCurlies());
    });
});
