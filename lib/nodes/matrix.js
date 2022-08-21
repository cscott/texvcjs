'use strict';
const TexNode = require('./texnode');
const TexArray = require('./texArray');
const assert = require('assert');

class Matrix extends TexNode {

    constructor(top, mainarg) {
        assert.strictEqual(
            arguments.length,
            2,
            'Incorrect number or arguments');
        assert.ok(
            top instanceof String || typeof top === 'string',
            'First argument must be string');
        assert.ok(
            mainarg instanceof TexArray &&
            mainarg.reduce((o, n) => o && n instanceof TexArray, true),
            'Second argument must be an array of arrays');
        super(top, mainarg);
        this.top = top;
        this.mainarg = mainarg;
    }

    contains_func(target, args = [
        '\\begin{' + this.top + '}',
        '\\end{' + this.top + '}',
        this.mainarg
    ]) {
        return super.contains_func(target, args);
    }

    inCurlies() {
        return this.render();
    }

    render() {
        const renderLine = function (l) {
            assert.ok(l instanceof TexArray);
            return l.map((x) => x.render()).join('&');
        };
        const renderMatrix = function (matrix) {
            assert.ok(matrix instanceof TexArray);
            return matrix.map(renderLine).join('\\\\');
        };
        return '{\\begin{' + this.top + '}' + renderMatrix(this.mainarg) + '\\end{' + this.top + '}}';
    }

    extractIdentifiers(args = [this.mainarg]) {
        // polyfill for .flat(Infinity);
        // cf. https://github.com/es-shims/Array.prototype.flat
        function flatDeep(a) {
            if (!Array.isArray(a)) {
                return a;
            }
            return a.reduce(
                (acc, val) => acc.concat(flatDeep(val)), []);
        }

        return flatDeep(args.map(
            (a) => a.map(super.extractIdentifiers)
        ));
    }
    /* istanbul ignore next */
    get name() {
        return 'MATRIX';
    }
}
module.exports = Matrix;
