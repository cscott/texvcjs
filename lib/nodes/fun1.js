'use strict';
const TexNode = require('./texnode');
const assert = require('assert');
const letterMods = require('../letterMods.json');
const tu = require('../texutil');

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

    extractIdentifiers(args = [this.arg]) {
        if (letterMods.includes(this.fname)) {
            const ident = this.arg.getModIdent();
            if (ident.length === 0) {
                return super.extractIdentifiers(args);
            }
            return [this.fname + '{' + ident + '}'];
        } else if (Object.keys(tu.ignore_identifier).includes(this.fname)) {
            return [];
        }
        return super.extractIdentifiers(args);
    }

    extractSubscripts() {
        return this._getSubs(this.arg.extractSubscripts());
    }

    getModIdent() {
        return this._getSubs(this.arg.getModIdent());
    }

    _getSubs(subs) {
        if (subs.length && letterMods.includes(this.fname)) {
            return [this.fname + '{' + subs + '}'];
        }
        return [];
    }

    get name() {
        return 'FUN1';
    }
}

module.exports = Fun1;
