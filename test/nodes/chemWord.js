const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const ChemWord = require('../../lib/nodes/chemWord');

const TexNode = require('../../lib/nodes/texnode');
const ChemFun2u = require("../../lib/nodes/chemFun2u");

describe('ChemWord Node test', function () {
    it('Should not create an empty ChemWord', function () {
        assert.throws(()=> new ChemWord())
    });

    it('Should not create a ChemWord with one argument', function () {
        assert.throws(()=> new ChemWord(new Literal('a')))
    });

    it('Should not create a ChemWord with incorrect type', function () {
        assert.throws(()=> new ChemWord('a','b'))
    });

    it('Should create an basic ChemWord', function () {
        const chemWord =  new ChemWord(new Literal('a'), new Literal('b'));
        assert.strictEqual('ab', chemWord.render())
    });

    it('Should extract identifiers', function () {
        const n = new ChemWord(new Literal('a'), new Literal('b'));
        assert.deepEqual([],n.extractIdentifiers());
    });
});
