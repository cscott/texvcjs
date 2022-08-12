const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Infix = require('../../lib/nodes/infix');
const TexArray = require('../../lib/nodes/texArray');
const TexNode = require("../../lib/nodes/texnode");


describe('Infix Node test', function () {

    it('Should not create an empty Infix', function () {
        assert.throws(()=> new Infix())
    });

    it('Should not create a Infix with one argument', function () {
        assert.throws(()=> new Infix('\\f'));
    });

    it('Should not create a Infix with incorrect type', function () {
        assert.throws(()=> new Infix('\\atop','x','y'))
    });

    it('Should create an basic function', function () {
        const f =  new Infix(
            '\\atop',
            new TexArray(new Literal('a')),
            new TexArray(new Literal('b')));
        assert.strictEqual('{a \\atop b}',
            f.render())
    });

    it('Should create exactly on set of curlies', function () {
        const f =  new Infix(
            '\\atop',
            new TexArray(new Literal('a')),
            new TexArray(new Literal('b')));
        assert.strictEqual('{a \\atop b}',
            f.inCurlies())
    });

    it('Should extract identifiers', function () {
        const n = new Infix(
            '\\atop',
            new TexArray(new Literal('a')),
            new TexArray(new Literal('b')));
        assert.deepEqual(['a', 'b'],n.extractIdentifiers());
    });
});
