'use strict';
const assert = require('assert');
class TexNode {

    constructor(...args) {
        args.forEach((arg) => {
            assert.ok(arg instanceof TexNode || (
                arg instanceof String || typeof arg === 'string'),
            'Unexpected argument type');
        });
        this.args = args;
        this.length = args.length;
    }

    render() {
        return this.args.reduce(
            (out, child) => out + this.renderChild(child),
            '');
    }

    renderChild(child) {
        if (child instanceof TexNode) {
            return child.render();
        }
        // assert.ok(child instanceof String || typeof child === 'string'),;
        return child;
    }

    inCurlies() {
        return '{' +  this.render() + '}';
    }

    /**
     *
     * The `functions` provided can be a string, array, or object (which is used
     * as a hash table).  It returns true if any of the array elements or
     * object keys names a function referenced in the AST
     *
     * @param {Object} functions any String, Array or Object.
     * @param {(string|TexNode)[]} args Argument overwrite
     *
     * @return {(string|boolean)}
     */
    contains_func(functions, args = this.args) {
        const some =  function (array, testfunc) {
            let i, b;
            for (i = 0; i < array.length; i++) {
                b = testfunc(array[i], i, array);
                if (b) {
                    // return the non-falsy value
                    return b;
                }
            }
            return false;
        };
        // Matches a string against a string, array, or set target.
        // Returns the matching value, or `false`.
        const match = function (target, str) {
            if (Array.isArray(target)) {
                return some(target, function (t) {
                    return match(t, str);
                });
            }
            if (typeof (target) === 'string') {
                return target === str ? str : false;
            }
            return target[str] ? str : false;
        };
        /**
         * strings can contain function references only in a few specific
         * forms, which we test for here.
         *
         * @param {Object} target any
         * @param {string} t Tex to be checked
         * @return {string} rendered LaTeX string
         */
        const texContainsFunc = function (target, t) {
            // may have trailing '(', '[', '\\{' or " "
            t = t.replace(/(\(|\[|\\{| )$/, '');
            // special case #1: \\operatorname {someword}
            let m = /^\\operatorname \{([^\\]*)\}$/.exec(t);
            if (m) {
                return match(target, '\\operatorname');
            }
            // special case #2: \\mbox{\\somefunc}
            m = /^\\mbox\{(\\.*)\}$/.exec(t);
            if (m) {
                return match(target, '\\mbox') || match(target, m[1]);
            }
            // special case #3: \\color, \\pagecolor, \\definecolor
            m = /^(\\(color|pagecolor|definecolor)) /.exec(t);
            if (m) {
                return match(target, m[1]);
            }
            // special case #4: \\mathbb, \\mathrm
            m = /^(\\math..) \{(\\.*)\}$/.exec(t);
            if (m) {
                return match(target, m[1]) || match(target, m[2]);
            }
            // protect against using random strings as keys in target
            return t.charAt(0) === '\\' && match(target, t);
        };

        return some(args, (arg) => arg instanceof TexNode ?
            arg.contains_func(functions) :
            texContainsFunc(functions, arg)
        );
    }

    extractIdentifiers(args = this.args) {
        return [].concat.apply([], args.map((arg) => {
            if (typeof arg === 'string' || arg instanceof String) {
                return arg;
            }
            return arg.extractIdentifiers();
        }));
    }
    extractSubscripts() {
        return [];
    }
    getModIdent() {
        return [];
    }
}

module.exports = TexNode;
