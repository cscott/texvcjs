'use strict';

// var ast = module.exports.ast = require('../').ast;
const ast = module.exports.ast = require('../ast');
const letterMods = require('../letterMods.json');
const extendedLiterals = require('../literals.json').slice(0);
extendedLiterals.push('\\infty', '\\emptyset');

ast.RenderT.defineVisitor('id_part', {
    TEX_ONLY: function (t) {
        return t;
    }
});

const getLiteral = module.exports.getLiteral = function (lit, regexp) {
    return function (r) {
        const s = r.id_part().trim();
        if (regexp.test(s)) {
            return [s];
        } else if (lit.includes(s)) {
            return [s];
        } else {
            return [];
        }
    };
};

const applyOnArray = module.exports.applyOnArray = function (arr, fName) {
    let y = [];
    arr.forEach(function (e) {
        const fun = Object.getPrototypeOf(e)[fName];
        y = y.concat(fun.call(e));
    });
    if (arr.length > 0 && arr.length === y.length) {
        return y.join('');
    } else {
        return [];
    }
};

const getSub = function (x) {
    if (x instanceof Array) {
        return applyOnArray(x, 'extractSubscipts');
    }
    if (typeof x === 'string' || x instanceof String) {
        return x;
    }
    return x.extractSubscipts();
};

const fun1Arr = module.exports.fun1Arr = function (f, s) {
    if (s.length && letterMods.includes(f)) {
        return [f + '{' + s + '}'];
    }
    return [];
};

const fun1Sub = function (f, a) {
    return fun1Arr(f, getSub(a));
};

ast.Tex.defineVisitor('extractSubscipts', {
    ARRAY: function (...args) {
        return applyOnArray(args, 'extractSubscipts');
    },
    LITERAL: getLiteral(extendedLiterals, /^([0-9a-zA-Z+',-])$/),
    BIG: function () {
        return [];
    },
    BOX: function () {
        return [];
    },
    CURLY: getSub,
    DECLh: function (f, a, x) {
        // @see http://tex.stackexchange.com/questions/98406/which-command-should-i-use-for-textual-subscripts-in-math-mode
        // cf https://phabricator.wikimedia.org/T56818 a is always RM
        // for f there are only four cases
        switch (f) {
            case '\\rm':
                f = '\\mathrm';
                break;
            case '\\it':
                f = '\\mathit';
                break;
            case '\\cal':
                f = '\\mathcal';
                break;
            case '\\bf':
                f = '\\mathbf';
        }
        x = getSub(x);
        if (x.length > 0) {
            return [f + '{' + x + '}'];
        } else {
            return [];
        }
    },
    DQ: function (base, down) {
        const d = [].concat(down.extractSubscipts()),
            b = base.extractSubscipts();
        if (b.length === 1 && d.length > 0) {
            return [b + '_{' + d.join('') + '}'];
        }
        return [];
    },
    DQN: function () {
        return [];
    },
    FQ: function () {
        return [];
    },
    FQN: function () {
        return [];
    },
    FUN1: fun1Sub,
    FUN1nb: fun1Sub,
    FUN2: function () {
        return [];
    },
    FUN2nb: function () {
        return [];
    },
    FUN2sq: function () {
        return [];
    },
    INFIX: function () {
        return [];
    },
    LR: function () {
        return [];
    },
    MATRIX: function () {
        return [];
    },
    UQ: function () {
        return [];
    },
    UQN: function () {
        return [];
    },
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
