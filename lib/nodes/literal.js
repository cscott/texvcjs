'use strict';
const TexNode = require('./texnode');
const assert = require('assert');
const literals = require('../literals.json');
const extendedLiterals = literals.slice(0);
extendedLiterals.push('\\infty', '\\emptyset');

class Literal extends TexNode {
    constructor(arg) {
        assert.strictEqual(
            arguments.length,
            1,
            'Incorrect number or arguments');
        assert.ok(
            arg instanceof String || typeof arg === 'string',
            'Incorrect argument type');
        super(arg);
        this.arg = arg;
    }
    _getLiteral(lit, regexp) {
        const s = this.arg.trim();
        if (regexp.test(s)) {
            return [s];
        } else if (lit.includes(s)) {
            return [s];
        } else {
            return [];
        }
    }
    extractIdentifiers() {
        return this._getLiteral(literals, /^([a-zA-Z']|\\int)$/);
    }
    extractSubscripts() {
        return this._getLiteral(extendedLiterals, /^([0-9a-zA-Z+',-])$/);
    }
    getModIdent() {
        if (this.arg === '\\ ') {
            return ['\\ '];
        }
        return this._getLiteral(literals, /^([0-9a-zA-Z'])$/);
    }

}

module.exports = Literal;
