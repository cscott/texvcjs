'use strict';
const tokenTypes = require('./tokenTypes');
module.exports = function (e, c) {
    const tokenTree = function (t) {
        if (Array.isArray(t) || t.name === 'ARRAY') {
            return t.map(tokenTree);
        }
        if (typeof t === 'string' || t instanceof String) {
            return [t];
        }
        const result = [tokenTypes.format(t.name, c)];
        for (let i = 0; i < t.length; i++) {
            result.push(tokenTree(t[i]));
        }
        return result;
    };
    return tokenTree(e);
};
