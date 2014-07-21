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

var curlies = function(t) {
    if (t.constructor === ast.Tex.CURLY) {
	return t.render_tex();
    }
    return "{" + t.render_tex() + "}";
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
	return "{" + f + " " + a.render_tex() + "}";
    },
    FUN1nb: function(f, a) {
	return f + " " + a.render_tex();
    },
    FUN1hl: function(f, _, a) {
	return "{" + f + " " + a.render_tex() + "}";
    },
    FUN1hf: function(f, _, a) {
	return "{" + f + " " + a.render_tex() + "}";
    },
    DECLh: function(f, _, a) {
	return "{" + f + "{" + render(a) + "}}";
    },
    FUN2: function(f, a, b) {
	return "{" + f + " " + a.render_tex() + b.render_tex() + "}";
    },
    FUN2h: function(f, _, a, b) {
	return "{" + f + " " + a.render_tex() + b.render_tex() + "}";
    },
    FUN2nb: function(f, a, b) {
	return f + a.render_tex() + b.render_tex();
    },
    FUN2sq: function(f, a, b) {
	return "{" + f + "[ " + a.render_tex() + "]" + b.render_tex() + "}";
    },
    CURLY: function(tl) {
	return "{" + render(tl) + "}";
    },
    INFIX: function(s, ll, rl) {
	return "{" + render(ll) + " " + s + "" + render(rl) + "}";
    },
    INFIXh: function(s, _, ll, rl) {
	return "{" + render(ll) + " " + s + "" + render(rl) + "}";
    },
    BOX: function(bt, s) {
	return "{" + bt + "{" + s + "}}";
    },
    BIG: function(bt, d) {
	return "{" + bt + d.tex_part() + "}";
    },
    MATRIX: function(t, m) {
	var render_tex = function(t) { return t.render_tex(); };
	var render_line = function(l) { return l.map(render_tex).join('&'); };
	var render_matrix = function(m) { return m.map(render_line).join('\\\\'); };
	return "{\\begin{"+t+"}" + render_matrix(m) + "\\end{"+t+"}}";
    },
    LR: function(l, r, tl) {
	return "\\left" + l.tex_part() + render(tl) + "\\right" + r.tex_part();
    }
});
