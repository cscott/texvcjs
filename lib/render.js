// Render an AST.
'use strict';

const ast = require('./ast');

ast.RenderT.defineVisitor('tex_part', {
    TEX_ONLY: function (t) { return t; }
});

const render = module.exports = function render(e) {
    if (Array.isArray(e)) {
        return e.map(render).join('');
    }
    return e.render_tex();
};

const curlies = function (t) {
    switch (t.constructor) {
        // constructs which are surrounded by curlies
        case ast.Tex.ARRAY:
        case ast.Tex.FUN1:
        case ast.Tex.FUN1hl:
        case ast.Tex.FUN1hf:
        case ast.Tex.DECLh:
        case ast.Tex.FUN2:
        case ast.Tex.FUN2h:
        case ast.Tex.FUN2sq:
        case ast.Tex.CURLY:
        case ast.Tex.INFIX:
        case ast.Tex.INFIXh:
        case ast.Tex.BOX:
        case ast.Tex.BIG:
        case ast.Tex.MATRIX:
            return t.render_tex();
        case String:
            break;
        default:
            t = t.render_tex();
    }
    return '{' + t + '}';
};

const renderCurlies = function (a) {
    if (a.length === 1) {
        return curlies(a[0]);
    }
    return curlies(render(a));
};

const dollar = function (t) {
    switch (t.constructor) {
        case String:
            break;
        default:
            t = t.render_tex();
    }
    return '$' + t + '$';
};

const renderDollar = function (a) {
    if (a.length === 1) {
        return dollar(a[0]);
    }
    return dollar(render(a));
};

ast.Tex.defineVisitor('render_tex', {
    ARRAY: function () {
        return Object.values(arguments).map(render).join('');
    },
    FQ: function (base, down, up) {
        return base.render_tex() + '_' + curlies(down) + '^' + curlies(up);
    },
    DQ: function (base, down) {
        return base.render_tex() + '_' + curlies(down);
    },
    UQ: function (base, up) {
        return base.render_tex() + '^' + curlies(up);
    },
    FQN: function (down, up) {
        return '_' + curlies(down) + '^' + curlies(up);
    },
    DQN: function (down) {
        return '_' + curlies(down);
    },
    UQN: function (up) {
        return '^' + curlies(up);
    },
    LITERAL: function (r) {
        return r.tex_part();
    },
    FUN1: function (f, a) {
        return curlies(f + ' ' + curlies(a));
    },
    MHCHEM: function (f, a) {
        return curlies(f + ' ' + curlies(a));
    },
    CHEM_WORD: function (l, w) {
        return l.render_tex() + w.render_tex();
    },
    CHEM_FUN2u: function (f, a, b) {
        return f + curlies(a) + '_' + curlies(b);
    },
    FUN1nb: function (f, a) {
        return f + ' ' + curlies(a) + ' ';
    },
    DECLh: function (f, _, a) {
        return curlies(f + ' ' + renderCurlies(a));
    },
    FUN2: function (f, a, b) {
        return curlies(f + ' ' + curlies(a) + curlies(b));
    },
    FUN2nb: function (f, a, b) {
        return f + ' ' + curlies(a) + curlies(b);
    },
    FUN2sq: function (f, a, b) {
        return curlies(f + '[' + a.render_tex() + ']' + curlies(b));
    },
    CURLY: function (tl) {
        return renderCurlies(tl);
    },
    DOLLAR: function (tl) {
        return renderDollar(tl);
    },
    INFIX: function (s, ll, rl) {
        return curlies(render(ll) + ' ' + s + ' ' + render(rl));
    },
    BOX: function (bt, s) {
        return curlies(bt + curlies(s));
    },
    BIG: function (bt, d) {
        return curlies(bt + ' ' + d.tex_part());
    },
    MATRIX: function (t, m) {
        const renderLine = function (l) {
            return l.map(render).join('&');
        };
        const renderMatrix = function (matrix) {
            return matrix.map(renderLine).join('\\\\');
        };
        return curlies('\\begin{' + t + '}' + renderMatrix(m) + '\\end{' + t + '}');
    },
    LR: function (l, r, tl) {
        return '\\left' + l.tex_part() + render(tl) + '\\right' + r.tex_part();
    }
});
