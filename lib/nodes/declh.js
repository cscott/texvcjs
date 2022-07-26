'use strict';
const TexNode = require('./texnode');
const TexArray = require('./texArray');
const assert = require('assert');

class Declh extends TexNode {
    constructor(fname, arg) {
        assert.strictEqual(
            arguments.length,
            2,
            'Incorrect number or arguments');
        assert.ok(
            (fname instanceof String || typeof fname === 'string') &&
            arg instanceof TexArray,
            'Incorrect argument type');
        super(fname, arg);
        this.fname = fname;
        this.arg = arg;
    }

    inCurlies() {
        return this.render();
    }

    render() {
        return '{' + this.arg.renderCurlies() + '}}';
    }
}

module.exports = Declh;
