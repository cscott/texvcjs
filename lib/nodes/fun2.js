'use strict';
const TexNode = require('./texnode');
const assert = require('assert');

class Fun2 extends TexNode {
    constructor(fname, arg1, arg2) {
        assert.strictEqual(
            arguments.length,
            3,
            'Incorrect number or arguments');
        assert.ok(
            (fname instanceof String || typeof fname === 'string') &&
            arg1 instanceof TexNode,
            arg2 instanceof TexNode,
            'Incorrect argument type');
        super(fname, arg1, arg2);
        this.fname = fname;
        this.arg1 = arg1;
        this.arg2 = arg2;
    }

    inCurlies() {
        return this.render();
    }

    render() {
        return '{' + this.fname +
            ' ' + this.arg1.inCurlies() +
            this.arg2.inCurlies() + '}';
    }

    extractIdentifiers(args = [this.arg1, this.arg2]) {
        return super.extractIdentifiers(args);
    }
    get name() {
        return 'FUN2';
    }
}

module.exports = Fun2;
