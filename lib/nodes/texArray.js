'use strict';
const TexNode = require('./texnode');

class TexArray extends TexNode {

    constructor(...args) {
        super(...args);
    }

    inCurlies() {
        return this.render();
    }

    map(f) {
        return this.args.map(f);
    }

    renderCurlies() {
        if (this.length === 1) {
            return this.args[0].inCurlies();
        } else {
            return '{' + this.render() + '}';
        }
    }

    reduce(a, b) {
        return this.args.reduce(a, b);
    }
}
module.exports = TexArray;
