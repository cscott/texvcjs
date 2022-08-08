'use strict';
const TexNode = require('./texnode');
const assert = require('assert');

class Fq extends TexNode {
    constructor(base, down, up) {
        assert.strictEqual(
            arguments.length,
            3,
            'Incorrect number or arguments');
        assert.ok(
            base instanceof TexNode &&
            down instanceof TexNode &&
            up instanceof TexNode,
            'Incorrect argument type');
        super(base, down, up);
        this.base = base;
        this.down = down;
        this.up = up;
    }

    render() {
        return this.base.render() +
            '_' + this.down.inCurlies() +
            '^' + this.up.inCurlies();
    }

    /* istanbul ignore next */
    get name() {
        return 'FQ';
    }
}

module.exports = Fq;
