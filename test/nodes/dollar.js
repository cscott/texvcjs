const assert = require('assert');

const Dollar = require('../../lib/nodes/dollar');
const Node = require('../../lib/nodes/texnode');
const Literal = require('../../lib/nodes/literal');
const TexArray = require('../../lib/nodes/texArray');
const TexNode = require("../../lib/nodes/texnode");


describe('Dollar node test', function () {
    it('Should not create an empty dollar', function () {
        assert.throws(()=> new Dollar())
    });

    it('Should not create a dollar with more than one argument', function () {
        assert.throws(()=> new Dollar('a','b'))
    });

    it('Should not create a dollar with incorrect type', function () {
        assert.throws(()=> new Dollar(new Node()))
    });

    it('Should render a dollar with empty tex array', function () {
        const l =  new Dollar( new TexArray());
        assert.strictEqual('$$', l.render())
    });

    it('Should render a list', function () {
        const l = new Dollar( new TexArray(
            new Literal('hello'),
            new Literal(' '),
            new Literal( 'world')));
        assert.strictEqual('$hello world$', l.render())
    });
});
