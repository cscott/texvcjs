// Useful AST methods.
// "contains_func": returns true iff the given AST contains a reference to
//                  the specified function(s).
'use strict';

const ast = require('./ast');
const assert = require('assert');

// like Array#some, but returns the non-falsy value, rather than the
// boolean constant `true`.
const some = function (array, testfunc) {
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
const match = function (target, str) {
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

// Check if any of the array of AST nodes contains `target`.
const arrContainsFunc = function (array, target) {
    return some(array, function (t) {
        return t.contains_func(target);
    });
};

/**
 * strings can contain function references only in a few specific
 * forms, which we test for here.
 *
 * @param {Object} target any
 * @param {string} t Tex to be checked
 * @return {string} rendered LaTeX string
 */
const texContainsFunc = function (target, t) {
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

// This defines a function of one argument, which becomes the first argument
// in the visitor functions.  The subsequent arguments in the definition
// are the fields of that particular AST class.
//
// The `target` provided can be a string, array, or object (which is used
// as a hash table).  It returns true if any of the array elements or
// object keys names a function referenced in the AST.
ast.Tex.defineVisitor('contains_func', {
    ARRAY: function (target, ...rest) {
        return arrContainsFunc(rest, target);
    },
    FQ: function (target, base, down, up) {
        // base_down^up
        return base.contains_func(target) ||
            down.contains_func(target) || up.contains_func(target);
    },
    DQ: function (target, base, down) {
        // base_down
        return base.contains_func(target) || down.contains_func(target);
    },
    UQ: function (target, base, up) {
        // base^up
        return base.contains_func(target) || up.contains_func(target);
    },
    FQN: function (target, down, up) {
        // _down^up (no base)
        return down.contains_func(target) || up.contains_func(target);
    },
    DQN: function (target, down) {
        // _down (no base)
        return down.contains_func(target);
    },
    UQN: function (target, up) {
        // ^up (no base)
        return up.contains_func(target);
    },
    LITERAL: function (target, r) {
        // a TeX literal.  It may contain function invocations in
        // certain specific forms; see the tex_contains method above.
        return texContainsFunc(target, r);
    },
    FUN1: function (target, f, a) {
        // {\f{a}}  (function of one argument)
        return match(target, f) || a.contains_func(target);
    },
    MHCHEM: function (target, f, a) {
        // {\f{a}}  (function of one argument)
        return match(target, f) || a.contains_func(target);
    },
    CHEM_WORD: function (target, r, s) {
        // chem word
        return match(target, s) || r.contains_func(target);
    },
    CHEM_FUN2u: function (target, f, a, b) {
        // {\underbrace{a}_{b}}
        return match(target, f) ||
            a.contains_func(target) || b.contains_func(target);
    },
    FUN1nb: function (target, f, a) {
        // \f{a}  (function of one argument, "no braces" around outside)
        return match(target, f) || a.contains_func(target);
    },
    DECLh: function (target, f, a) {
        // {\rm a1 a2 a3 a4 ...}  where f is \rm, \it, \cal, or \bf
        return match(target, f) || arrContainsFunc(a, target);
    },
    FUN2: function (target, f, a, b) {
        // {\f{a}{b}}  (function of two arguments)
        return match(target, f) ||
            a.contains_func(target) || b.contains_func(target);
    },
    FUN2nb: function (target, f, a, b) {
        // \f{a}{b}  (function of two arguments, "no braces" around outside)
        return match(target, f) ||
            a.contains_func(target) || b.contains_func(target);
    },
    FUN2sq: function (target, f, a, b) {
        // {\f[a]{b}}  (function of two arguments, first is optional)
        return match(target, f) ||
            a.contains_func(target) || b.contains_func(target);
    },
    CURLY: function (target, tl) {
        // { tl1 tl2 tl3 ... }
        return arrContainsFunc(tl, target);
    },
    DOLLAR: function (target, tl) {
        // { tl1 tl2 tl3 ... }
        return arrContainsFunc(tl, target);
    },
    INFIX: function (target, s, ll, rl) {
        // { ll1 ll2 ... \s rl1 rl2 ... } (infix function)
        return match(target, s) ||
            arrContainsFunc(ll, target) || arrContainsFunc(rl, target);
    },
    BOX: function (target, box, s) {
        // \box{s} where box is \text, \mbox, \hbox, or \vbox
        //         and s is a string not containing special characters
        return match(target, box);
    },
    BIG: function (target, big, d) {
        // \big\d where big is \big, \Big, \bigg, \Bigg, \biggl, etc
        return match(target, big) || texContainsFunc(target, d);
    },
    MATRIX: function (target, t, m) {
        // \begin{env} .. & .. \\ .. & .. \\ .. & .. \end{env}
        // t is the environment name.
        // m is a doubly-nested array
        const exprHas = function (e) {
            return arrContainsFunc(e, target);
        };
        const lineHas = function (l) {
            return some(l, exprHas);
        };
        const matrixHas = function (matrix) {
            return some(matrix, lineHas);
        };
        return match(target, '\\begin{' + t + '}') ||
            match(target, '\\end{' + t + '}') ||
            matrixHas(m);
    },
    LR: function (target, l, r, tl) {
        // \left\l tl1 tl2 tl3 ... \right\r  (a balanced pair of delimiters)
        return match(target, '\\left') || match(target, '\\right') ||
            texContainsFunc(target, l) || texContainsFunc(target, r) ||
            arrContainsFunc(tl, target);
    }
}, 1);

// allow user to pass an unparsed TeX string, or a parsed AST (which will
// usually be an array of `ast.Tex`), or a low-level `ast.Tex` node.
module.exports.contains_func = function (t, target) {
    if (typeof (t) === 'string') {
        t = require('./parser').parse(t);
    }
    assert.ok(!Array.isArray(t), 'Old array type found.');
    return t.contains_func(target);
};
