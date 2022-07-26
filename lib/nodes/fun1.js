'use strict';
const TexNode = require('./texnode');
const assert = require('assert');

class Fun1 extends TexNode {
    constructor(fname, arg) {
        assert.strictEqual(
            arguments.length,
            2,
            'Incorrect number or arguments');
        assert.ok(
            (fname instanceof String || typeof fname === 'string') &&
            arg instanceof TexNode,
            'Incorrect argument type');
        super(fname, arg);
        this.fname = fname;
        this.arg = arg;
    }

    inCurlies() {
        return this.render();
    }

    render() {
        return '{' + this.fname +
            ' ' + this.arg.inCurlies() + '}';
    }
}

module.exports = Fun1;
