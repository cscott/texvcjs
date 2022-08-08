'use strict';
const assert = require('assert');

const { texContainsFunc, some } = require('../astutil');
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

    // The `target` provided can be a string, array, or object (which is used
    // as a hash table).  It returns true if any of the array elements or
    // object keys names a function referenced in the AST.
    contains_func(target) {
        return some(this.args, (arg) => arg instanceof TexNode ?
            arg.contains_func(target) :
            texContainsFunc(target, arg)
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
