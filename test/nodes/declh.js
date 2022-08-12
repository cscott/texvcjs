const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Declh = require('../../lib/nodes/declh');
const TexArray = require('../../lib/nodes/texArray');
const TexNode = require("../../lib/nodes/texnode");

describe('Declh Node test', function () {

    it('Should not create an empty Declh', function () {
        assert.throws(()=> new Declh())
    });

    it('Should not create a Declh with one argument', function () {
        assert.throws(()=> new Declh('\\f'));
    });

    it('Should not create a Declh with incorrect type', function () {
        assert.throws(()=> new Declh('\\f','x'))
    });

    it('Should create a basic function', function () {
        const f =  new Declh('\\rm',
            new TexArray(new Literal('a')));
        assert.strictEqual('{\\rm {a}}',
            f.render())
    });

    it('Should create a function with two arguments', function () {
        const f =  new Declh('\\rm',
            new TexArray(new Literal('a'), new Literal('b')));
        assert.strictEqual('{\\rm {ab}}',
            f.render())
    });

    it('Should create exactly one set of curlies', function () {
        const f =  new Declh('\\f',
            new TexArray(new Literal('a')));
        assert.strictEqual('{\\f {a}}',
            f.inCurlies())
    });

    it('Should extract identifiers', function () {
        const n = new Declh('\\rm',
            new TexArray(new Literal('a')));
        assert.deepEqual(['a'],n.extractIdentifiers());
    });
});
