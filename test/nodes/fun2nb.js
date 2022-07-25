const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Fun2nb = require('../../lib/nodes/fun2nb');

describe('Fun2nb Node test', function () {

    it('Should not create an empty Fun2nb', function () {
        assert.throws(()=> new Fun2nb())
    });

    it('Should not create a Fun2nb with one argument', function () {
        assert.throws(()=> new Fun2nb('\\f'));
    });

    it('Should not create a Fun2nb with incorrect type', function () {
        assert.throws(()=> new Fun2nb('\\f','x','y'))
    });

    it('Should create an basic function', function () {
        const f =  new Fun2nb( '\\f', new Literal('a'), new Literal('b') );
        assert.strictEqual('\\f {a}{b}',
            f.render())
    });

    it('Should create exactly on set of curlies', function () {
        const f =  new Fun2nb( '\\f', new Literal('a'), new Literal('b') );
        assert.strictEqual('{\\f {a}{b}}',
            f.inCurlies())
    });
});
