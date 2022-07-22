'use strict';
const TexNode = require('./texnode');

class TexArray extends TexNode {

    constructor(...args) {
        super(...args);
    }

    inCurlies() {
        return this.render();
    }
}
module.exports = TexArray;
