const assert = require('assert');

const TexNode = require('../../lib/nodes/texnode');

describe('Baseclass Node test', function () {
    it('Should create an empty node', function () {
        const n = new TexNode();
        assert.strictEqual('', n.render())
    });
    it('Should create a node with am empty string', function () {
        const n = new TexNode('');
        assert.strictEqual('', n.render())
    });
    it('Should create a hello world node', function () {
        const n = new TexNode('hello', ' ', 'world');
        assert.strictEqual('hello world', n.render())
    });
    it('Should create a nested hello world node', function () {
        const n = new TexNode('hello', new TexNode(' '), new TexNode( new TexNode ('world')));
        assert.strictEqual('hello world', n.render())
    });
    it('Should not accept integers as arguments', function () {
        assert.throws( () => (new TexNode(1)).render())
    });
});
