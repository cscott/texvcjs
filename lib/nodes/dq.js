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

    extractIdentifiers() {
        const d = this.down.extractSubscripts();
        const b = this.base.extractIdentifiers();
        if (b instanceof Array && b.length > 1) {
            return super.extractIdentifiers();
        }
        if (b.length && b[0] === "'") {
            return b.concat(d);
        }
        if (d.length && b.length) {
            if (b[0] === '\\int') {
                return b.concat(d);
            }
            return [b + '_{' + d + '}'];
        }
        return super.extractIdentifiers();
    }

    extractSubscripts() {
        const d = [].concat(this.down.extractSubscripts());
        const b = this.base.extractSubscripts();
        if (b.length === 1 && d.length > 0) {
            return [b + '_{' + d.join('') + '}'];
        }
        return super.extractSubscripts();
    }

    getModIdent() {
        const d = this.down.extractSubscripts();
        const b = this.base.getModIdent();
        if (b.length && b[0] === "'") {
            return [];
        }
        if (d.length && b.length) {
            return [b + '_{' + d + '}'];
        }
        return super.getModIdent();
    }
}

module.exports = Dq;
