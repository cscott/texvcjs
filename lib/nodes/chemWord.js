'use strict';
const TexNode = require('./texnode');
const assert = require('assert');

class ChemWord extends TexNode {
    constructor(left, right) {
        assert.strictEqual(
            arguments.length,
            2,
            'Incorrect number or arguments');
        assert.ok(
            left instanceof TexNode &&
            right instanceof TexNode,
            'Incorrect argument type');
        super(left, right);
        this.left = left;
        this.right = right;
    }

    render() {
        return this.left.render() + this.right.render();
    }

    extractIdentifiers() {
        return [];
    }
}

module.exports = ChemWord;
