'use strict';
const TexNode = require('./texnode');
const TexArray = require('./texArray');
const assert = require('assert');

class Curly extends TexNode {
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
        if (this.value.length === 1) {
            return '{' + this.value.inCurlies() + '}';
        }
        return '{' + this.value.render() + '}';
    }
}

module.exports = Curly;
