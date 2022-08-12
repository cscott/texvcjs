'use strict';
const TexNode = require('./texnode');
const TexArray = require('./texArray');
const assert = require('assert');

class Dollar extends TexNode {
    constructor(value) {
        assert.strictEqual(
            arguments.length,
            1,
            'Incorrect number or arguments');
        assert.ok(
            value instanceof TexArray,
            'Incorrect argument type');
        super(value);
        this.value = value;
    }

    render() {
        return '$' + super.render() + '$';
    }

    extractIdentifiers() {
        return [];
    }
}

module.exports = Dollar;
