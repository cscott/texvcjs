'use strict';

const ast = module.exports.ast = require('./subscripts').ast;
const applyOnArray = require('./subscripts').applyOnArray;
const fun1Arr = require('./subscripts').fun1Arr;
const literals = require('../literals.json');

const getMod = function (x) {
    if (x instanceof Array) {
        return applyOnArray(x, 'getModIdent');
    }
    return x.getModIdent();
};

const fun1Mod = function (f, a) {
    return fun1Arr(f, getMod(a));
};

ast.Tex.defineVisitor('getModIdent', {
    ARRAY: function (...args) {
        return applyOnArray(args, 'getModIdent');
    },
    LITERAL: function (r) {
        const s = r.trim();
        if (/^([0-9a-zA-Z'])$/.test(s) ||
            literals.includes(s)
        ) {
            return [s];
        } else if (r === '\\ ') {
            return [r];
        }
        return [];
    },
    BIG: function () {
        return [];
    },
    BOX: function () {
        return [];
    },
    CURLY: getMod,
    DECLh: function () {
        return [];
    },
    DQ: function (base, down) {
        const d = down.extractSubscripts(),
            b = base.getModIdent();
        if (b.length && b[0] === "'") {
            return [];
        }
        if (d.length && b.length) {
            return [b + '_{' + d + '}'];
        }
        return [];
    },
    FQ: function () {
        return [];
    },
    FUN1: fun1Mod,
    FUN1nb: fun1Mod,
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
