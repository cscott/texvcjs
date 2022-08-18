const assert = require('assert');
const Matrix = require('../../lib/nodes/matrix');

const TexNode = require('../../lib/nodes/texnode');
const TexArray = require('../../lib/nodes/texArray');
const Literal = require("../../lib/nodes/literal");

describe('Matrix Node test', function () {
    const sampleMatrix = new Matrix(
        'align',
        new TexArray(
            new TexArray(new Literal('a'))));

    it('Should require two arguments', function () {
        assert.throws(()=> new Matrix())
    });

    it('Should require check second argument for nested arrays', function () {
        assert.throws(()=> new Matrix(
            'align',
            new TexArray(
                new Literal('a'))))
    });

    it('Should create an instance of TexNode', function () {
        assert.ok(sampleMatrix instanceof TexNode)
    });

    it('Should render', function () {
        assert.strictEqual(
            '{\\begin{align}a\\end{align}}',
            sampleMatrix.render())
    });

    it('Should not create extra curlies', function () {
        assert.strictEqual(
            '{\\begin{align}a\\end{align}}',
            sampleMatrix.inCurlies());
    });

    it('Should extract identifiers', function () {
        assert.deepEqual(['a'],sampleMatrix.extractIdentifiers());
    });
});
