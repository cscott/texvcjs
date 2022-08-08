'use strict';
const TexNode = require('./texnode');
const TexArray = require('./texArray');
const { match } = require('../astutil');
const assert = require('assert');

class Lr extends TexNode {
    constructor(left, right, arg) {
        assert.strictEqual(
            arguments.length,
            3,
            'Incorrect number or arguments');
        assert.ok(
            (left instanceof String || typeof left === 'string') &&
            (right instanceof String || typeof right === 'string') &&
            arg instanceof TexArray,
            'Incorrect argument type');
        super(left, right, arg);
        this.left = left;
        this.right = right;
        this.arg = arg;
    }

    inCurlies() {
        return '{' + this.render() + '}';
    }

    render() {
        return '\\left' + this.left +
            this.arg.render() + '\\right' + this.right;
    }

    contains_func(target) {
        return match(target, '\\left') ||
            match(target, '\\right') ||
            super.contains_func(target);
    }

    extractIdentifiers(args = [this.arg]) {
        return super.extractIdentifiers(args);
    }

    get name() {
        return 'LR';
    }
}

module.exports = Lr;
