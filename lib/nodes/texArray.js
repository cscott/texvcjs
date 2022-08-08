'use strict';
const TexNode = require('./texnode');
const assert = require('assert');

class TexArray extends TexNode {

    constructor(...args) {
        args = args.filter((arg) => arg !== null);
        args.forEach((arg) => assert.ok(arg instanceof TexNode,
            'Error parsing:' + typeof arg));
        super(...args);
    }

    inCurlies() {
        if (this.length === 1) {
            return this.args[0].inCurlies();
        } else {
            return '{' + this.render() + '}';
        }
    }

    map(f) {
        return this.args.map(f);
    }

    reduce(a, b) {
        return this.args.reduce(a, b);
    }

    extractSubscripts() {
        let y = [];
        this.args.forEach(
            (x) => {
                y = y.concat(x.extractSubscripts());
            });

        if (this.args.length > 0 &&
            this.args.length === y.length) {
            return y.join('');
        }
        return [];
    }
    extractIdentifiers(args = this.args) {
        const list = super.extractIdentifiers(args);
        let outpos, offset = 0;
        let int = 0;
        for (let inpos = 0; inpos < list.length; inpos++) {
            outpos = inpos - offset;
            switch (list[inpos]) {
                case "'":
                    list[outpos - 1] = list[outpos - 1] + "'";
                    offset++;
                    break;
                case '\\int':
                    int++;
                    offset++;
                    break;
                case '\\mathrm{d}':
                case 'd':
                    if (int) {
                        int--;
                        offset++;
                        break;
                    }
                /* falls through */
                default:
                    list[outpos] = list[inpos];
            }
        }
        return list.slice(0, list.length - offset);
    }

    getModIdent() {
        let y = [];
        this.args.forEach(
            (x) => {
                y = y.concat(x.getModIdent());
            });

        if (this.args.length > 0 &&
            this.args.length === y.length) {
            return y.join('');
        }
        return [];
    }

    push(...elements) {
        elements.forEach((arg) => assert.ok(arg instanceof TexNode));
        this.args.push(...elements);
        this.length = this.args.length;
    }

    first() {
        return this.args[0];
    }

    second() {
        return this.args[1];
    }

    unshift(...elements) {
        this.args.unshift(...elements);
        this.length = this.args.length;
    }

    get name() {
        return 'ARRAY';
    }
}
module.exports = TexArray;
