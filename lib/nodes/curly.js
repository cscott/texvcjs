'use strict';
const TexNode = require('./texnode');
const TexArray = require('./texArray');
const assert = require('assert');

class Curly extends TexNode {
    constructor(arg) {
        assert.strictEqual(
            arguments.length,
            1,
            'Incorrect number or arguments');
        assert.ok(
            arg instanceof TexArray,
            'Incorrect argument type');
        super(arg);
        this.arg = arg;
    }

    render() {
        return this.arg.inCurlies();
    }

    inCurlies() {
        return this.render();
    }

    extractSubscripts() {
        return this.arg.extractSubscripts();
    }
    getModIdent() {
        return this.arg.getModIdent();
    }

    get name() {
        return 'CURLY';
    }
}

module.exports = Curly;
