const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Fun1nb = require('../../lib/nodes/fun1nb');

describe('Fun1nb Node test', function () {

    it('Should not create an empty Fun1nb', function () {
        assert.throws(()=> new Fun1nb())
    });

    it('Should not create a Fun1nb with one argument', function () {
        assert.throws(()=> new Fun1nb('\\f'));
    });

    it('Should not create a Fun1nb with incorrect type', function () {
        assert.throws(()=> new Fun1nb('\\f','x'))
    });

    it('Should create a basic function', function () {
        const f =  new Fun1nb( '\\f', new Literal('a') );
        assert.strictEqual('\\f {a} ',
            f.render())
    });

    it('Should create exactly one set of curlies', function () {
        const f =  new Fun1nb( '\\f', new Literal('a') );
        assert.strictEqual('{\\f {a} }',
            f.inCurlies())
    });
});
