'use strict';
const TexNode = require('./texnode');
const assert = require('assert');

class ChemFun2u extends TexNode {
    constructor(fname, left, right) {
        assert.strictEqual(
            arguments.length,
            3,
            'Incorrect number or arguments');
        assert.ok(
            (fname instanceof String || typeof fname === 'string') &&
            left instanceof TexNode &&
            right instanceof TexNode,
            'Incorrect argument type');
        super(fname, left, right);
        this.fname = fname;
        this.left = left;
        this.right = right;
    }

    render() {
        return this.fname +
            this.left.inCurlies() + '_' +
            this.right.inCurlies();
    }

    extractIdentifiers() {
        return [];
    }
}

module.exports = ChemFun2u;
