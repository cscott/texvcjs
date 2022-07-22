const assert = require('assert');

const Literal = require('../../lib/nodes/literal');
const Node = require('../../lib/nodes/texnode');

describe('Baseclass Node test', function () {
    it('Should not create an empty literal', function () {
        assert.throws(()=> new Literal())
    });
    it('Should not create a literal with more than one argument', function () {
        assert.throws(()=> new Literal('a','b'))
    });
    it('Should not create a literal with incorrect type', function () {
        assert.throws(()=> new Literal(new Node()))
    });
    it('Should create an literal with only one argument', function () {
        const l =  new Literal('hello world');
        assert.strictEqual('hello world', l.render())
    });
    it('Should render within node base class', function () {
        const l = new Literal('hello world');
        const n = new Node(l);
        assert.strictEqual('hello world', n.render())
    });
});
