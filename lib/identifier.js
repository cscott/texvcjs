'use strict';

const ast = require('./extractors/mods').ast;
const getLiteral = require('./extractors/subscripts').getLiteral;
const letterMods = require('./letterMods.json');
const literals = require('./literals.json');
const tu = require('./texutil');

/**
 * This function
 *  - removes the identifier $d$ from integrals. For example
 *    $\int f(x)\, dx$ has only two identifiers $f$ and $x$.
 *  - associates the suffix $'$ with the predeceasing identifier.
 *    For example $x'$ would be recognized as one identifier, rather
 *    than $x$ and $'$
 *
 * @param list Array this is the input.
 * @return Array which can be <T>|ArrayBuffer|Array|string|Blob|Buffer|*
 */

function fixIntegralAndSuffix(list) {
    let outpos, offset = 0;
    let int = 0;
    for (let inpos = 0; inpos < list.length; inpos++) {
        outpos = inpos - offset;
        switch (list[inpos]) {
            case "'":
                list[outpos - 1] = list[outpos - 1] + "'";
                offset++;
                break;
            case '\\int':
                int++;
                offset++;
                break;
            case '\\mathrm{d}':
            case 'd':
                if (int) {
                    int--;
                    offset++;
                    break;
                }
            /* falls through */
            default:
                list[outpos] = list[inpos];
        }
    }
    return list.slice(0, list.length - offset);
}

const render = module.exports.render = function render(e) {
    if (Array.isArray(e) || e.name === 'ARRAY') {
        return fixIntegralAndSuffix([].concat.apply([], e.map(render)));
    }
    if (typeof e === 'string' || e instanceof String) {
        return e;
    }
    if (typeof e.extractIdentifiers === 'function') {
        return e.extractIdentifiers();
    } else {
        return [];
    }
};

const renderArgs = function () {
    const args = Array.prototype.slice.call(arguments);
    return [].concat.apply([], args.map(render));
};

const fun1 = function (f, a) {
    if (letterMods.includes(f)) {
        const ident = a.getModIdent();
        if (ident.length === 0) {
            return renderArgs(a);
        }
        return [f + '{' + ident + '}'];
    } else if (Object.keys(tu.ignore_identifier).includes(f)) {
        return [];
    }
    return renderArgs(a);
};

ast.Tex.defineVisitor('extractIdentifiers', {
    ARRAY: function (...args) {
        return renderArgs(...args);
    },
    FQ: function (base, down, up) {
        return renderArgs(base, down, up);
    },
    DQ: function (base, down) {
        const d = down.extractSubscipts(),
            b = render(base);
        if (b instanceof Array && b.length > 1) {
            return renderArgs(base, down);
        }
        if (b.length && b[0] === "'") {
            return b.concat(d);
        }
        if (d.length && b.length) {
            if (b[0] === '\\int') {
                return b.concat(d);
            }
            return [b + '_{' + d + '}'];
        }
        return renderArgs(base, down);
    },
    UQ: function (base, up) {
        return renderArgs(base, up);
    },
    LITERAL: getLiteral(literals, /^([a-zA-Z']|\\int)$/),
    FUN1: fun1,
    FUN1nb: fun1,
    DECLh: function (f, a) {
        const ars = renderArgs(a);
        if (ars.length) {
            return renderArgs(a).join('');
        } else {
            return [];
        }
    },
    FUN2: function (f, a, b) {
        return renderArgs(a, b);
    },
    FUN2nb: function (f, a, b) {
        return renderArgs(a, b);
    },
    FUN2sq: function (f, a, b) {
        return renderArgs(a, b);
    },
    CURLY: function (tl) {
        return render(tl);
    },
    INFIX: function (s, ll, rl) {
        return renderArgs(ll, rl);
    },
    BOX: function () {
        return [];
    },
    BIG: function () {
        return [];
    },
    MATRIX: function (t, m) {
        const renderLine = function (l) {
            return l.map(render);
        };
        const renderMatrix = function (a) {
            return a.map(renderLine);
        };
        return render(renderMatrix(m));
    },
    LR: function (l, r, tl) {
        return render(tl);
    },
    // There are no maths identifiers in chemistry
    CHEM_WORD: function () {
        /* istanbul ignore next */
        return [];
    },
    CHEM_FUN2u: function () {
        /* istanbul ignore next */
        return [];
    },
    MHCHEM: function () {
        return [];
    },
    DOLLAR: function () {
        /* istanbul ignore next */
        return [];
    }
});
