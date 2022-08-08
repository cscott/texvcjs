'use strict';
const TexNode = require('./texnode');
const assert = require('assert');

class Uq extends TexNode {
    constructor(base, up) {
        assert.strictEqual(
            arguments.length,
            2,
            'Incorrect number or arguments');
        assert.ok(
            base instanceof TexNode && up instanceof TexNode,
            'Incorrect argument type');
        super(base, up);
        this.base = base;
        this.down = up;
    }

    render() {
        return this.base.render() + '^' + this.down.inCurlies();
    }

    get name() {
        return 'UQ';
    }
}

module.exports = Uq;
