'use strict';
const TexNode = require('./texnode');
const assert = require('assert');
const TexArray = require('./texArray');

class Infix extends TexNode {
    constructor(op, arg1, arg2) {
        assert.strictEqual(
            arguments.length,
            3,
            'Incorrect number or arguments');
        assert.ok(
            (op instanceof String || typeof op === 'string') &&
            arg1 instanceof TexArray,
            arg2 instanceof TexArray,
            'Incorrect argument type');
        super(op, arg1, arg2);
        this.op = op;
        this.arg1 = arg1;
        this.arg2 = arg2;
    }

    inCurlies() {
        return this.render();
    }

    render() {
        return '{' + this.arg1.render() +
            ' ' + this.op + ' ' +
            this.arg2.render() + '}';
    }

    extractIdentifiers(args = [this.arg1, this.arg2]) {
        return super.extractIdentifiers(args);
    }
    /* istanbul ignore next */
    get name() {
        return 'INFIX';
    }
}

module.exports = Infix;
