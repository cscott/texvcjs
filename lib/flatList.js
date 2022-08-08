'use strict';
const tokenTypes = require('./tokenTypes');
const TexArray = require('./nodes/texArray');
const Lr = require('./nodes/lr');
module.exports = function (e, c) {
    const tokenLister = function (t) {
        if (t instanceof  TexArray) {
            return [].concat.apply([], t.map(tokenLister));
        }
        let result = [];
        const name = tokenTypes.format(t.name, c);
        // previously it was checked if t[0] was type of string,
        // which did work (accidentally) when t was string of length >0.
        if (typeof t === 'string' || t instanceof String) {
            result.push([name, t[0]]);
            return result;
        }
        if (typeof t.args[0] === 'string' || t.args[0] instanceof String) {
            result.push([name, t.args[0]]);
        } else {
            result.push([name, '']);
        }
        // output brackets content from left to right, i.e. '(', content, ')'
        if (t instanceof Lr) {
            result = result.concat(
                tokenLister(t.args[0]),
                tokenLister(t.args[2]),
                tokenLister(t.args[1]));
        } else {
            for (let i = 0; i < t.length; i++) {
                if (!(typeof t.args[i] === 'string' || t.args[i] instanceof String)) {
                    result = result.concat(tokenLister(t.args[i]));
                }
            }
        }
        return result;
    };
    return tokenLister(e);
};
