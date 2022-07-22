'use strict';
const TexNode = require('./texnode');
const assert = require('assert');

class Dq extends TexNode {
    constructor(base, down) {
        assert.strictEqual(
            arguments.length,
            2,
            'Incorrect number or arguments');
        assert.ok(
            base instanceof TexNode && down instanceof TexNode,
            'Incorrect argument type');
        super(base, down);
        this.base = base;
        this.down = down;
    }

    render() {
        return this.base.render() + '_' + this.down.inCurlies();
    }
}

module.exports = Dq;
