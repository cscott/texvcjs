'use strict';
const Node = require('./texnode');
const assert = require('assert');

class Literal extends Node {
    constructor(value) {
        assert.strictEqual(
            arguments.length,
            1,
            'Incorrect number or arguments');
        assert.ok(
            value instanceof String || typeof value === 'string',
            'Incorrect argument type');
        super(value);
    }
}

module.exports = Literal;
