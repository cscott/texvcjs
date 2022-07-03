'use strict';
const tokenTypes = require('./tokenTypes');
module.exports = function (e, c) {
    const tokenLister = function (t) {
        if (t.name === 'ARRAY') {
            return [].concat.apply([], t.map(tokenLister));
        }
        let result = [];
        const name = tokenTypes.format(t.name, c);
        if (typeof t[0] === 'string' || t[0] instanceof String) {
            result.push([name, t[0]]);
        } else {
            result.push([name, '']);
        }
        // output brackets content from left to right, i.e. '(', content, ')'
        if (t.name === 'LR') {
            result = result.concat(tokenLister(t[0]), tokenLister(t[2]), tokenLister(t[1]));
        } else {
            for (let i = 0; i < t.length; i++) {
                if (!(typeof t[i] === 'string' || t[i] instanceof String)) {
                    result = result.concat(tokenLister(t[i]));
                }
            }
        }
        return result;
    };
    return tokenLister(e);
};
