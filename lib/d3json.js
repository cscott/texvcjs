'use strict';
const assert = require('assert');
module.exports = function (e, flat) {
    const tokenTree = function (t) {
        assert.ok(!Array.isArray(t), 'Old array type found.');
        if (typeof t === 'string' || t instanceof String) {
            return { name: t };
        }
        let result = [];
        if (flat && t.length === 1) {
            result = tokenTree(t.args[0]);
            if (!result.children) {
                result.name = t.name + '->' + result.name;
                return result;
            }
        } else {
            for (let i = 0; i < t.length; i++) {
                result.push(tokenTree(t.args[i]));
            }
        }
        return { name: t.name, children: result };
    };
    return tokenTree(e);
};
