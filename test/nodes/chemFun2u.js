const assert = require('assert');
const Literal = require('../../lib/nodes/literal');
const ChemFun2u = require('../../lib/nodes/chemFun2u');

const TexNode = require('../../lib/nodes/texnode');

describe('ChemFun2u Node test', function () {
    it('Should not create an empty ChemFun2u', function () {
        assert.throws(()=> new ChemFun2u())
    });

    it('Should not create a ChemFun2u with one argument', function () {
        assert.throws(()=> new ChemFun2u('a'))
    });

    it('Should not create a ChemFun2u with incorrect type', function () {
        assert.throws(()=> new ChemFun2u('a','b', 'c'))
    });

    it('Should create an basic ChemFun2u', function () {
        const fun2u =  new ChemFun2u('a', new Literal('b'), new Literal('c'));
        assert.strictEqual('a{b}_{c}', fun2u.render())
    });

});
