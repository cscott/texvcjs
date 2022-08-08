'use strict';
const TexNode = require('./texnode');
const TexArray = require('./texArray');
const assert = require('assert');
const { match } = require('../astutil');

class Matrix extends TexNode {

    constructor(top, main) {
        assert.strictEqual(
            arguments.length,
            2,
            'Incorrect number or arguments');
        assert.ok(
            top instanceof String || typeof top === 'string',
            'First argument must be string');
        assert.ok(
            main instanceof TexArray &&
            main.reduce((o, n) => o && n instanceof TexArray, true),
            'Second argument must be an array of arrays');
        super(top, main);
        this.top = top;
        this.main = main;
    }

    contains_func(target) {
        return match(target, '\\begin{' + this.top + '}') ||
            match(target, '\\end{' + this.top + '}')  ||
            super.contains_func(target);
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
        return '{\\begin{' + this.top + '}' + renderMatrix(this.main) + '\\end{' + this.top + '}}';
    }

    extractIdentifiers(args = [this.main]) {
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
