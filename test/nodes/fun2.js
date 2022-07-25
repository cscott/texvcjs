const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Fun2 = require('../../lib/nodes/fun2');

describe('Fun2 Node test', function () {

    it('Should not create an empty Fun2', function () {
        assert.throws(()=> new Fun2())
    });

    it('Should not create a Fun2 with one argument', function () {
        assert.throws(()=> new Fun2('\\f'));
    });

    it('Should not create a Fun2 with incorrect type', function () {
        assert.throws(()=> new Fun2('\\f','x','y'))
    });

    it('Should create an basic function', function () {
        const f =  new Fun2( '\\f', new Literal('a'), new Literal('b') );
        assert.strictEqual('{\\f {a}{b}}',
            f.render())
    });

    it('Should create exactly on set of curlies', function () {
        const f =  new Fun2( '\\f', new Literal('a'), new Literal('b') );
        assert.strictEqual('{\\f {a}{b}}',
            f.inCurlies())
    });
});
