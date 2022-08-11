'use strict';
const TexNode = require('./texnode');
const assert = require('assert');

class TexArray extends TexNode {

    constructor(...args) {
        args.forEach((arg) => assert.ok(arg instanceof TexNode));
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
        return [].concat.apply([],
            this.args.map((arg) => arg.extractSubscripts()
            ));
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
        return [].concat.apply([],
            this.args.map((arg) => arg.getModIdent()
            ));
    }
}
module.exports = TexArray;
