// AST type declarations
'use strict';

const assert = require('assert');
const typecheck = module.exports.typecheck = function (val, type, self) {
    switch (type) {
        case 'string':
            return typeof (val) === type;
        case 'self':
            return self && self.contains(val);
    }
    if (Array.isArray(type)) {
        return (Array.isArray(val) || val.name === 'ARRAY') &&
            val.every(function (elem) {
                return typecheck(elem, type[0], self);
            });
    }
    return type.contains(val);
};
const type2str = function (type) {
    if (typeof (type) === 'string') {
        return type;
    }
    if (Array.isArray(type)) {
        return '[' + type2str(type[0]) + ']';
    }
    return type.name;
};

// "Enum" helper
// vaguely based on:
// https://github.com/rauschma/enums/blob/master/enums.js
const Enum = function (name, fields, proto) {
    proto = proto || {};
    // Non-enumerable properties 'name' and 'prototype'
    Object.defineProperty(this, 'name', { value: name });
    Object.defineProperty(this, 'prototype', { value: proto });
    Object.keys(fields).forEach(function (fname) {
        const args = fields[fname].args || [];
        const self = this;
        this[fname] = function EnumField() {
            if (!(this instanceof EnumField)) {
                const o = Object.create(EnumField.prototype);
                o.constructor = EnumField;
                EnumField.apply(o, arguments);
                return o;
            }
            this.name = fname;
            if (fname === 'ARRAY') {
                for (let i = 0; i < arguments.length; i++) {
                    const argument = arguments[i];
                    if (argument !== null && argument.length > 0) {
                        this.push(argument);
                    }
                }
            } else {
                assert.ok(arguments.length === args.length,
                    'Wrong # of args for ' + name + '.' + fname);
                for (let i = 0; i < args.length; i++) {
                    assert.ok(typecheck(arguments[i], args[i], self),
                        'Argument ' + i + ' of ' + name + '.' + fname +
                        ' should be ' + type2str(args[i]));
                    this[i] = arguments[i];
                }
                this.length = args.length;
            }
        };
        this[fname].prototype = Object.create(proto);
        this[fname].prototype.toString = function () {
            const stringify = function (type, val) {
                if (type === 'string') {
                    return JSON.stringify(val);
                } else if (Array.isArray(type)) {
                    return '[' + val.map(function (v) {
                        return stringify(type[0], v);
                    }).join(',') + ']';
                }
                return val.toString();
            };
            return fname + '(' + args.map(function (type, i) {
                return stringify(type, this[i]);
            }.bind(this)).join(',') + ')';
        };
    }.bind(this));
};
Enum.prototype.contains = function (sym) {
    // eslint-disable-next-line no-prototype-builtins
    return sym.name && this.hasOwnProperty(sym.name) &&
        sym instanceof this[sym.name];
};
Enum.prototype.defineVisitor = function (visitorName, o, numArgs) {
    const self = this;
    numArgs = numArgs || 0;
    assert.ok(Object.keys(o).length === Object.keys(self).length,
        'Missing cases in ' + self.name + '. Expected:\n' +
        Object.keys(self).sort() + ' but got: \n' +
        Object.keys(o).sort());
    Object.keys(o).forEach(function (fname) {
        self[fname].prototype[visitorName] = function () {
            const args = [];
            for (let i = 0; i < numArgs; i++) {
                args.push(arguments[i]);
            }
            args.push.apply(args, this);
            return o[fname].apply(this, args);
        };
    });
};

// Actual AST starts here.

const FontForce = module.exports.FontForce = new Enum('FontForce', {
    IT: {},
    RM: {}
});

const Tex = module.exports.Tex = new Enum('Tex', {
    BIG: { args: ['string', 'string'] }, // name, contents
    BOX: { args: ['string', 'string'] }, // name, contents
    CHEM_FUN2u: { args: ['string', 'self', 'self'] }, // name, expr
    CHEM_WORD: { args: ['self', 'self'] }, // name, expr
    CURLY: { args: [['self']] }, // expr
    DECLh: { args: ['string', FontForce, ['self']] },
    DOLLAR: { args: [['self']] }, // expr
    DQ: { args: ['self', 'self'] }, // base, down
    DQN: { args: ['self'] }, // down (no base)
    FQ: { args: ['self', 'self', 'self'] }, // base, down, up
    FQN: { args: ['self', 'self'] }, // down, up (no base)
    FUN1: { args: ['string', 'self'] }, // name, expr
    FUN1nb: { args: ['string', 'self'] }, // name, expr
    FUN2: { args: ['string', 'self', 'self'] },
    FUN2nb: { args: ['string', 'self', 'self'] },
    FUN2sq: { args: ['string', 'self', 'self'] },
    INFIX: { args: ['string', ['self'], ['self']] },
    LITERAL: { args: ['string'] }, // contents
    LR: { args: ['string', 'string', ['self']] }, // left, right, expr
    MATRIX: { args: ['string', [[['self']]]] },
    MHCHEM: { args: ['string', 'self'] }, // name, expr
    UQ: { args: ['self', 'self'] }, // base, up
    UQN: { args: ['self'] } // up (no base)
});

Tex.ARRAY = new Enum('Tex', { ARRAY: { } }, Array.prototype).ARRAY;
