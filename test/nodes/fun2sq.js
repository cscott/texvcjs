const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Fun2sq = require('../../lib/nodes/fun2sq');

describe('Fun2sq Node test', function () {

    it('Should not create an empty Fun2sq', function () {
        assert.throws(()=> new Fun2sq())
    });

    it('Should not create a Fun2sq with one argument', function () {
        assert.throws(()=> new Fun2sq('\\f'));
    });

    it('Should not create a Fun2sq with incorrect type', function () {
        assert.throws(()=> new Fun2sq('\\f','x','y'))
    });

    it('Should create an basic function', function () {
        const f =  new Fun2sq( '\\f', new Literal('a'), new Literal('b') );
        assert.strictEqual('{\\f[a]{b}}',
            f.render())
    });

    it('Should create exactly on set of curlies', function () {
        const f =  new Fun2sq( '\\f', new Literal('a'), new Literal('b') );
        assert.strictEqual('{\\f[a]{b}}',
            f.inCurlies())
    });
});
