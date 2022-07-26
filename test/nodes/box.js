const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Box = require('../../lib/nodes/box');

describe('Box Node test', function () {

    it('Should not create an empty Box', function () {
        assert.throws(()=> new Box())
    });

    it('Should not create a Box with one argument', function () {
        assert.throws(()=> new Box('\\hbox'));
    });

    it('Should not create a Box with incorrect type', function () {
        assert.throws(()=> new Box('\\hbox', new Literal('a')))
    });

    it('Should create an basic function', function () {
        const f =  new Box( '\\hbox', 'a' );
        assert.strictEqual('{\\hbox{a}}',
            f.render())
    });

    it('Should create exactly on set of curlies', function () {
        const f =  new Box( '\\hbox', 'a' );
        assert.strictEqual('{\\hbox{a}}',
            f.inCurlies())
    });
});
