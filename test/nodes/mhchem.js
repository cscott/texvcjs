const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const Mhchem = require('../../lib/nodes/mhchem');
const Dollar = require("../../lib/nodes/dollar");
const TexArray = require("../../lib/nodes/texArray");

describe('Mhchem Node test', function () {

    it('Should not create an empty Mhchem', function () {
        assert.throws(()=> new Mhchem())
    });

    it('Should not create a Mhchem with one argument', function () {
        assert.throws(()=> new Mhchem('\\f'));
    });

    it('Should not create a Mhchem with incorrect type', function () {
        assert.throws(()=> new Mhchem('\\f','x'))
    });

    it('Should create a basic function', function () {
        const f =  new Mhchem( '\\f', new Literal('a') );
        assert.strictEqual('{\\f {a}}',
            f.render())
    });

    it('Should create curlies', function () {
        const f =  new Mhchem( '\\f', new Literal('a') );
        assert.strictEqual('{{\\f {a}}}',
            f.inCurlies())
    });

    it('Should extract identifiers', function () {
        const n = new Mhchem( '\\f', new Literal('a') );
        assert.deepEqual([],n.extractIdentifiers());
    });
});
