'use strict';
const TexNode = require('./texnode');

class TexArray extends TexNode {

    constructor(...args) {
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
}
module.exports = TexArray;
