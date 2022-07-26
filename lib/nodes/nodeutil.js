'use strict';

const ast = require('../ast');
const assert = require('assert');
const TexArray = require('./texArray');
const Fq = require('./fq');
const Dq = require('./dq');
const Uq = require('./uq');
const Literal = require('./literal');
const Fun1 = require('./fun1');
const Mhchem = require('./mhchem');
const ChemWord = require('./chemWord');
const ChemFun2u = require('./chemFun2u');
const Fun1nb = require('./fun1nb');
const Declh = require('./declh');
const Fun2 = require('./fun2');
const Fun2nb = require('./fun2nb');
const Fun2sq = require('./fun2sq');
const Curly = require('./curly');
const Dollar = require('./dollar');
const Infix = require('./infix');
const Box = require('./box');
const Big = require('./big');
const Matrix = require('./matrix');
const Lr = require('./lr');

ast.Tex.defineVisitor('toNode', {

    ARRAY: function (...args) {
        args = args.map((x) => x.toNode());
        return new TexArray(...args);
    },

    FQ: function (base, down, up) {
        // base_down^up
        return new Fq(base.toNode(), down.toNode(), up.toNode());
    },

    DQ: function (base, down) {
        // base_down
        return new Dq(base.toNode(), down.toNode());
    },

    UQ: function (base, up) {
        // base^up
        return new Uq(base.toNode(), up.toNode());
    },

    LITERAL: function (r) {
        // a TeX literal.  It may contain function invocations in
        // certain specific forms; see the tex_contains method above.
        return new Literal(r);
    },

    FUN1: function (f, a) {
        // {\f{a}}  (function of one argument)
        return new Fun1(f, a.toNode());
    },

    MHCHEM: function (f, a) {
        // {\f{a}}  (function of one argument)
        return new Mhchem(f, a.toNode());
    },

    CHEM_WORD: function (r, s) {
        // chem word
        return new ChemWord(r.toNode(), s.toNode());
    },

    CHEM_FUN2u: function (f, a, b) {
        // {\underbrace{a}_{b}}
        return new ChemFun2u(f, a.toNode(), b.toNode());
    },

    FUN1nb: function (f, a) {
        // \f{a}  (function of one argument, "no braces" around outside)
        return new Fun1nb(f, a.toNode());
    },

    DECLh: function (f, a) {
        // {\rm a1 a2 a3 a4 ...}  where f is \rm, \it, \cal, or \bf
        return new Declh(f, a.toNode());
    },

    FUN2: function (f, a, b) {
        // {\f{a}{b}}  (function of two arguments)
        return new Fun2(f, a.toNode(), b.toNode());
    },

    FUN2nb: function (f, a, b) {
        // \f{a}{b}  (function of two arguments, "no braces" around outside)
        return new Fun2nb(f, a.toNode(), b.toNode());

    },

    FUN2sq: function (f, a, b) {
        // {\f[a]{b}}  (function of two arguments, first is optional)
        return new Fun2sq(f, a.toNode(), b.toNode());

    },

    CURLY: function (tl) {
        // { tl1 tl2 tl3 ... }
        return new Curly(tl.toNode());
    },

    DOLLAR: function (tl) {
        // $ tl1 tl2 tl3 ... $
        return new Dollar(tl.toNode());
    },

    INFIX: function (s, ll, rl) {
        // { ll1 ll2 ... \s rl1 rl2 ... } (infix function)
        return new Infix(s, ll.toNode(), rl.toNode());
    },

    BOX: function (box, s) {
        // \box{s} where box is \text, \mbox, \hbox, or \vbox
        //         and s is a string not containing special characters
        return new Box(box, s);
    },

    BIG: function (big, d) {
        // \big\d where big is \big, \Big, \bigg, \Bigg, \biggl, etc
        return new Big(big, d);
    },

    MATRIX: function (t, m) {
        // \begin{env} .. & .. \\ .. & .. \\ .. & .. \end{env}
        // t is the environment name.
        // m is a doubly-nested array
        return new Matrix(t, m.toNode());
    },

    LR: function (l, r, tl) {
        // \left\l tl1 tl2 tl3 ... \right\r  (a balanced pair of delimiters)
        return new Lr(l, r, tl.toNode());
    }
}, 0);

// allow user to pass an unparsed TeX string, or a parsed AST (which will
// usually be an array of `ast.Tex`), or a low-level `ast.Tex` node.
module.exports.toNode = function (t) {
    if (typeof (t) === 'string') {
        t = require('../parser').parse(t);
    }
    assert.ok(!Array.isArray(t), 'Old array type found.');
    return t.toNode();
};
