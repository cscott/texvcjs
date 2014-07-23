// Render an AST.
"use strict";

var ast = require('./ast');

ast.RenderT.defineVisitor("tex_part", {
    HTMLABLE: function(_,t,_2) { return t; },
    HTMLABLEM: function(_,t,_2) { return t; },
    HTMLABLEC: function(_,t,_2) { return t; },
    MHTMLABLEC: function(_,t,_2,_3,_4) { return t; },
    HTMLABLE_BIG: function(t,_) { return t; },
    TEX_ONLY: function(t) { return t; }
});


var render = module.exports = function render(e) {
    if (Array.isArray(e)) {
        return e.map(render).join('');
    }
    return e.render_tex();
};

var curlies = function(t, force) {
    switch (t.constructor) {
    case ast.Tex.CURLY:
        return t.render_tex();
    case String:
        break;
    default:
        t = t.render_tex();
    }
    if ((!force) && t.length >= 2 &&
        t.charAt(0) === '{' && t.charAt(t.length-1) === '}') {
        return t;
    }
    return "{" + t + "}";
};

ast.Tex.defineVisitor("render_tex", {
    FQ: function(base, down, up) {
        return base.render_tex() + "_" + curlies(down) + "^" + curlies(up);
    },
    DQ: function(base, down) {
        return base.render_tex() + "_" + curlies(down);
    },
    UQ: function(base, up) {
        return base.render_tex() + "^" + curlies(up);
    },
    FQN: function(down, up) {
        return "_" + curlies(down) + "^" + curlies(up);
    },
    DQN: function(down) {
        return "_" + curlies(down);
    },
    UQN: function(up) {
        return "^" + curlies(up);
    },
    LITERAL: function(r) {
        return r.tex_part();
    },
    FUN1: function(f, a) {
        return curlies(f + " " + a.render_tex(), true);
    },
    FUN1nb: function(f, a) {
        return f + " " + a.render_tex() + " ";
    },
    FUN1hl: function(f, _, a) {
        return curlies(f + " " + a.render_tex(), true);
    },
    FUN1hf: function(f, _, a) {
        return curlies(f + " " + a.render_tex(), true);
    },
    DECLh: function(f, _, a) {
        return curlies(f + " " + curlies(render(a), a.length!==1), true);
    },
    FUN2: function(f, a, b) {
        return curlies(f + " " + a.render_tex() + b.render_tex(), true);
    },
    FUN2h: function(f, _, a, b) {
        return curlies(f + " " + a.render_tex() + b.render_tex(), true);
    },
    FUN2nb: function(f, a, b) {
        return f + " " + a.render_tex() + b.render_tex();
    },
    FUN2sq: function(f, a, b) {
        return curlies(f + "[" + a.render_tex() + "]" + b.render_tex(), true);
    },
    CURLY: function(tl) {
        return curlies(render(tl), tl.length!==1);
    },
    INFIX: function(s, ll, rl) {
        return curlies(render(ll) + " " + s + " " + render(rl), true);
    },
    INFIXh: function(s, _, ll, rl) {
        return curlies(render(ll) + " " + s + " " + render(rl), true);
    },
    BOX: function(bt, s) {
        return curlies(bt + curlies(s, true), true);
    },
    BIG: function(bt, d) {
        return curlies(bt + " " + d.tex_part(), true);
    },
    MATRIX: function(t, m) {
        var render_line = function(l) { return l.map(render).join('&'); };
        var render_matrix = function(m) { return m.map(render_line).join('\\\\'); };
        return "{\\begin{"+t+"}" + render_matrix(m) + "\\end{"+t+"}}";
    },
    LR: function(l, r, tl) {
        return "\\left" + l.tex_part() + render(tl) + "\\right" + r.tex_part();
    }
});
