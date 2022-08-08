'use strict';
const tokenTypes = require('./tokenTypes');
const assert = require('assert');
module.exports = function (e, c) {
    const tokenTree = function (t) {
        assert.ok(!Array.isArray(t), 'Old array type found.');
        if (t.name === 'ARRAY') {
            return t.map(tokenTree);
        }
        if (typeof t === 'string' || t instanceof String) {
            return [t];
        }
        const result = [tokenTypes.format(t.name, c)];
        for (let i = 0; i < t.length; i++) {
            result.push(tokenTree(t.args[i]));
        }
        return result;
    };
    return tokenTree(e);
};
