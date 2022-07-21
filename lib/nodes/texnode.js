'use strict';
const assert = require('assert');
class TexNode {

    constructor(...args) {
        this.args = args;
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
        if (child instanceof String || typeof child === 'string') {
            return child;
        }
        assert.fail('Unexpected type for child');
    }
}

module.exports = TexNode;
