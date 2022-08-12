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
        return '{' + this.fname + ' ' + this.arg.inCurlies() + '}';
    }

    extractIdentifiers(args = [ this.arg ]) {
        return super.extractIdentifiers(args);
    }

    extractSubscripts() {
        let f = this.fname;
        // @see http://tex.stackexchange.com/questions/98406/which-command-should-i-use-for-textual-subscripts-in-math-mode
        // cf https://phabricator.wikimedia.org/T56818 a is always RM
        // for f there are only four cases
        switch (f) {
            case '\\rm':
                f = '\\mathrm';
                break;
            case '\\it':
                f = '\\mathit';
                break;
            case '\\cal':
                f = '\\mathcal';
                break;
            case '\\bf':
                f = '\\mathbf';
        }
        const x = this.arg.extractSubscripts();
        if (x.length > 0) {
            return [f + '{' + x + '}'];
        }
        return super.extractSubscripts();
    }
}

module.exports = Declh;
