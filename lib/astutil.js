// Useful AST methods.
// "contains_func": returns true iff the given AST contains a reference to
//                  the specified function(s).
'use strict';

const assert = require('assert');

// like Array#some, but returns the non-falsy value, rather than the
// boolean constant `true`.
const some = module.exports.some = function (array, testfunc) {
    let i, b;
    for (i = 0; i < array.length; i++) {
        b = testfunc(array[i], i, array);
        if (b) {
            return b;
        } // return the non-falsy value
    }
    return false;
};

// Matches a string against an string, array, or set target.
// Returns the matching value, or `false`.
const match = module.exports.match = function (target, str) {
    if (Array.isArray(target)) {
        return some(target, function (t) {
            return match(t, str);
        });
    }
    if (typeof (target) === 'string') {
        return target === str ? str : false;
    }
    return target[str] ? str : false;
};

/**
 * strings can contain function references only in a few specific
 * forms, which we test for here.
 *
 * @param {Object} target any
 * @param {string} t Tex to be checked
 * @return {string} rendered LaTeX string
 */
module.exports.texContainsFunc = function (target, t) {
    // may have trailing '(', '[', '\\{' or " "
    t = t.replace(/(\(|\[|\\{| )$/, '');
    // special case #1: \\operatorname {someword}
    let m = /^\\operatorname \{([^\\]*)\}$/.exec(t);
    if (m) {
        return match(target, '\\operatorname');
    }
    // special case #2: \\mbox{\\somefunc}
    m = /^\\mbox\{(\\.*)\}$/.exec(t);
    if (m) {
        return match(target, '\\mbox') || match(target, m[1]);
    }
    // special case #3: \\color, \\pagecolor, \\definecolor
    m = /^(\\(color|pagecolor|definecolor)) /.exec(t);
    if (m) {
        return match(target, m[1]);
    }
    // special case #4: \\mathbb, \\mathrm
    m = /^(\\math..) \{(\\.*)\}$/.exec(t);
    if (m) {
        return match(target, m[1]) || match(target, m[2]);
    }
    // protect against using random strings as keys in target
    return t.charAt(0) === '\\' && match(target, t);
};

// allow user to pass an unparsed TeX string, or a parsed AST (which will
// usually be an array of `ast.Tex`), or a low-level `ast.Tex` node.
module.exports.contains_func = function (t, target) {
    if (typeof (t) === 'string') {
        t = require('./parser').parse(t);
    }
    assert.ok(!Array.isArray(t), 'Old array type found.');
    return t.contains_func(target);
};
