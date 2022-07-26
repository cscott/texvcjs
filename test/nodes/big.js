const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Big = require('../../lib/nodes/big');

describe('Big Node test', function () {

    it('Should not create an empty Big', function () {
        assert.throws(()=> new Big())
    });

    it('Should not create a Big with one argument', function () {
        assert.throws(()=> new Big('\\big'));
    });

    it('Should not create a Big with incorrect type', function () {
        assert.throws(()=> new Big('\\big', new Literal('a')))
    });

    it('Should create an basic function', function () {
        const f =  new Big( '\\big', 'a' );
        assert.strictEqual('{\\big a}',
            f.render())
    });

    it('Should create exactly on set of curlies', function () {
        const f =  new Big( '\\big', 'a' );
        assert.strictEqual('{\\big a}',
            f.inCurlies())
    });
});
