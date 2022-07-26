const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Fun1 = require('../../lib/nodes/fun1');

describe('Fun1 Node test', function () {

    it('Should not create an empty Fun1', function () {
        assert.throws(()=> new Fun1())
    });

    it('Should not create a Fun1 with one argument', function () {
        assert.throws(()=> new Fun1('\\f'));
    });

    it('Should not create a Fun1 with incorrect type', function () {
        assert.throws(()=> new Fun1('\\f','x'))
    });

    it('Should create an basic function', function () {
        const f =  new Fun1( '\\f', new Literal('a') );
        assert.strictEqual('{\\f {a}}',
            f.render())
    });

    it('Should create exactly on set of curlies', function () {
        const f =  new Fun1( '\\f', new Literal('a') );
        assert.strictEqual('{\\f {a}}',
            f.inCurlies())
    });
});
