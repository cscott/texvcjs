const assert = require('assert');

const Curly = require('../../lib/nodes/curly');
const Node = require('../../lib/nodes/texnode');
const Literal = require('../../lib/nodes/literal');
const TexArray = require('../../lib/nodes/texArray');
const Dq = require("../../lib/nodes/dq");


describe('Curly node test', function () {
    it('Should not create an empty curly', function () {
        assert.throws(()=> new Curly())
    });

    it('Should not create a curly with more than one argument', function () {
        assert.throws(()=> new Curly('a','b'))
    });

    it('Should not create a curly with incorrect type', function () {
        assert.throws(()=> new Curly(new Node()))
    });

    it('Should render a curly with empty array', function () {
        const l =  new Curly( new TexArray());
        assert.strictEqual('{}', l.render())
    });

    it('Should render a list', function () {
        const l = new Curly( new TexArray(
            new Literal('hello'),
            new Literal(' '),
            new Literal( 'world')));
        assert.strictEqual('{hello world}', l.render())
    });

    it('Should not create extra curlies', function () {
        const dq =  new Dq(new Literal('a'),
            new Curly( new TexArray( new Literal('b'))));
        assert.strictEqual('a_{b}', dq.render())
    });

    it('Should not create extra curlies', function () {
        const c = new Curly( new TexArray( new Literal('a')));
        assert.strictEqual('{a}', c.inCurlies())
    });

});
