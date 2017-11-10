// Useful AST methods.
// "contains_func": returns true iff the given AST contains a reference to
//                  the specified function(s).
"use strict";

var ast = require("./ast");

// like Array#some, but returns the non-falsy value, rather than the
// boolean constant `true`.
var some = function(array, testfunc) {
    var i, b;
    for (i=0; i<array.length; i++) {
        b = testfunc(array[i], i, array);
        if (b) { return b; } // return the non-falsy value
    }
    return false;
};

// Matches a string against an string, array, or set target.
// Returns the matching value, or `false`.
var match = function(target, str) {
    if (Array.isArray(target)) {
        return some(target, function(t) { return match(t, str); });
    }
    if (typeof(target)==='string') {
        return target === str ? str : false;
    }
    return target[str] ? str : false;
};

// Check if any of the array of AST nodes contains `target`.
var arr_contains_func = function(array, target) {
    return some(array, function(t) { return t.contains_func(target); });
};

/**
 * RenderT nodes can contain function references only in a few specific
 * forms, which we test for here.
 */
ast.RenderT.prototype.tex_contains_func = function(target) {
    var t = this.tex_part(), m;
    // may have trailing '(', '[', '\\{' or " "
    t = t.replace(/(\(|\[|\\{| )$/, '');
    // special case #1: \\operatorname {someword}
    m = /^\\operatorname \{([^\\]*)\}$/.exec(t);
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
    m = /^(\\math..) \{[^\\]*\}$/.exec(t);
    if (m) {
        return match(target, m[1]);
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
ast.Tex.defineVisitor("contains_func", {
    FQ: function(target, base, down, up) {
        // base_down^up
        return base.contains_func(target) ||
            down.contains_func(target) || up.contains_func(target);
    },
    DQ: function(target, base, down) {
        // base_down
        return base.contains_func(target) || down.contains_func(target);
    },
    UQ: function(target, base, up) {
        // base^up
        return base.contains_func(target) || up.contains_func(target);
    },
    FQN: function(target, down, up) {
        // _down^up (no base)
        return down.contains_func(target) || up.contains_func(target);
    },
    DQN: function(target, down) {
        // _down (no base)
        return down.contains_func(target);
    },
    UQN: function(target, up) {
        // ^up (no base)
        return up.contains_func(target);
    },
    LITERAL: function(target, r) {
        // a TeX literal.  It may contain function invocations in
        // certain specific forms; see the tex_contains method above.
        return r.tex_contains_func(target);
    },
    FUN1: function(target, f, a) {
        // {\f{a}}  (function of one argument)
        return match(target, f) || a.contains_func(target);
    },
    MHCHEM: function(target, f, a) {
        // {\f{a}}  (function of one argument)
        return match(target, f) || a.contains_func(target);
    },
    CHEM_BOND: function(target, f, a) {
        // {\f{a}}  (function of one argument)
        return match(target, f) || a.contains_func(target);
    },
    CHEM_WORD: function(target, r, s) {
        // chem word
        return match(target, r + s);
    },
    CHEM_FUN1: function(target, f, a) {
        // {\f{a}}  (function of one argument)
        return match(target, f) || a.contains_func(target);
    },
    CHEM_FUN2: function(target, f, a, b) {
        // {\f{a}{b}}  (function of one argument)
        return match(target, f) ||
            a.contains_func(target) || b.contains_func(target);
    },
    CHEM_FUN2u: function(target, f, a, b) {
        // {\underbrace{a}}  (function of two argument)
        return match(target, f) ||
            a.contains_func(target) || b.contains_func(target);
    },
    CHEM_FUN2c: function(target, a, b) {
        // {\color []{a}{b}}
        return a.contains_func(target) || b.contains_func(target);
    },
    FUN1nb: function(target, f, a) {
        // \f{a}  (function of one argument, "no braces" around outside)
        return match(target, f) || a.contains_func(target);
    },
    DECLh: function(target, f, _, a) {
        // {\rm a1 a2 a3 a4 ...}  where f is \rm, \it, \cal, or \bf
        return match(target, f) || arr_contains_func(a, target);
    },
    FUN2: function(target, f, a, b) {
        // {\f{a}{b}}  (function of two arguments)
        return match(target, f) ||
            a.contains_func(target) || b.contains_func(target);
    },
    FUN2nb: function(target, f, a, b) {
        // \f{a}{b}  (function of two arguments, "no braces" around outside)
        return match(target, f) ||
            a.contains_func(target) || b.contains_func(target);
    },
    FUN2sq: function(target, f, a, b) {
        // {\f[a]{b}}  (function of two arguments, first is optional)
        return match(target, f) ||
            a.contains_func(target) || b.contains_func(target);
    },
    CURLY: function(target, tl) {
        // { tl1 tl2 tl3 ... }
        return arr_contains_func(tl, target);
    },
    DOLLAR: function(target, tl) {
        // { tl1 tl2 tl3 ... }
        return arr_contains_func(tl, target);
    },
    INFIX: function(target, s, ll, rl) {
        // { ll1 ll2 ... \s rl1 rl2 ... } (infix function)
        return match(target, s) ||
            arr_contains_func(ll, target) || arr_contains_func(rl, target);
    },
    BOX: function(target, box, s) {
        // \box{s} where box is \text, \mbox, \hbox, or \vbox
        //         and s is a string not containing special characters
        return match(target, box);
    },
    BIG: function(target, big, d) {
        // \big\d where big is \big, \Big, \bigg, \Bigg, \biggl, etc
        return match(target, big) || d.tex_contains_func(target);
    },
    MATRIX: function(target, t, m) {
        // \begin{env} .. & .. \\ .. & .. \\ .. & .. \end{env}
        // t is the environment name.
        // m is a doubly-nested array
        var expr_has = function(e) { return arr_contains_func(e, target); };
        var line_has = function(l) { return some(l, expr_has); };
        var matrix_has = function(m) { return some(m, line_has); };
        return match(target, '\\begin{'+t+'}') ||
            match(target, '\\end{'+t+'}') ||
            matrix_has(m);
    },
    LR: function(target, l, r, tl) {
        // \left\l tl1 tl2 tl3 ... \right\r  (a balanced pair of delimiters)
        return match(target, '\\left') || match(target, '\\right') ||
            l.tex_contains_func(target) || r.tex_contains_func(target) ||
            arr_contains_func(tl, target);
    }
}, 1);

// allow user to pass an unparsed TeX string, or a parsed AST (which will
// usually be an array of `ast.Tex`), or a low-level `ast.Tex` node.
module.exports.contains_func = function(t, target) {
    if (typeof(t) === 'string') {
        t = require('parser').parse(t);
    }
    if (Array.isArray(t)) {
        return arr_contains_func(t, target);
    }
    return t.contains_func(target);
};
