// AST type declarations
"use strict";

var typecheck = function(val, type, self) {
    switch (type) {
    case 'any':
	return true;
    case 'string':
	return typeof(val) === type;
    case 'self':
	return self.contains(val);
    }
    if (Array.isArray(type)) {
	return Array.isArray(val) && val.every(function(elem) {
	    return typecheck(elem, type[0], self);
	});
    }
    return type.contains(val);
};
var type2str = function(type) {
    if (typeof(type) === 'string') {
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
var Enum = function(name, fields) {
    this.name = name;
    Object.keys(fields).forEach(function(fname) {
	var args = fields[fname].args || [];
	var self = this;
	this[fname] = function EnumField() {
	    if (!(this instanceof EnumField)) {
		var o = Object.create(EnumField.prototype);
		o.constructor = EnumField;
		EnumField.apply(o, arguments);
		return o;
	    }
	    this.name = fname;
	    console.assert(arguments.length === args.length,
			   "Wrong # of args for " + name + "." + fname);
	    for (var i=0; i<args.length; i++) {
		console.assert(typecheck(arguments[i], args[i], self),
			      "Argument " + i + " of " + name + "." + fname +
			       " should be " + type2str(args[i]));
		this[i] = arguments[i];
	    }
	};
	this[fname].prototype.toString = function() {
	    var stringify = function(type, val) {
		if (type==='string') {
		    return JSON.stringify(val);
		} else if (Array.isArray(type)) {
		    return '[' + val.map(function(v) {
			return stringify(type[0], v);
		    }).join(',') + ']';
		}
		return val.toString();
	    };
	    return fname + '(' + args.map(function(type, i) {
		return stringify(type, this[i]);
	    }.bind(this)).join(',') + ')';
	};
    }.bind(this));
};
Enum.prototype.contains = function(sym) {
    return sym.name && this.hasOwnProperty(sym.name) &&
	sym instanceof this[sym.name];
};

// Actual AST starts here.

var FontForce = module.exports.FontForce = new Enum( 'FontForce', {
    IT: {},
    RM: {}
});

var FontClass = module.exports.FontClass = new Enum( 'FontClass', {
    IT:  {}, /* IT default, may be forced to be RM */
    RM:  {}, /* RM default, may be forced to be IT */
    UF:  {}, /* not affected by IT/RM setting */
    RTI: {}, /* RM - any, IT - not available in HTML */
    UFH: {} /* in TeX UF, in HTML RM */
});

var MathClass = module.exports.MathClass = new Enum( 'MathClass', {
    MN: {},
    MI: {},
    MO: {}
});

var RenderT = module.exports.RenderT = new Enum( 'RenderT', {
    HTMLABLEC:    { args: [ FontClass, 'string', 'string' ] },
    HTMLABLEM:    { args: [ FontClass, 'string', 'string' ] },
    HTMLABLE:     { args: [ FontClass, 'string', 'string' ] },
    MHTMLABLEC:   { args: [ FontClass, 'string', 'string', MathClass, 'string' ] },
    HTMLABLE_BIG: { args: [ 'string', 'string' ] },
    TEX_ONLY:     { args: ['string'] }
});

var Tex = module.exports.Tex = new Enum( 'Tex', {
    LITERAL: { args: [ RenderT ] },
    CURLY:   { args: [ ['self'] ] },
    FQ:      { args: [ 'self', 'self', 'self' ] },
    DQ:      { args: [ 'self', 'self' ] },
    UQ:      { args: [ 'self', 'self' ] },
    FQN:     { args: [ 'self', 'self' ] },
    DQN:     { args: [ 'self' ] },
    UQN:     { args: [ 'self' ] },
    LR:      { args: [ RenderT, RenderT, [ 'self' ] ] },
    BOX:     { args: [ 'string', 'string' ] },
    BIG:     { args: [ 'string', RenderT ] },
    FUN1:    { args: [ 'string', 'self' ] },
    FUN1nb:  { args: [ 'string', 'self' ] },
    FUN2:    { args: [ 'string', 'self', 'self' ] },
    FUN2nb:  { args: [ 'string', 'self', 'self' ] },
    INFIX:   { args: [ 'string', ['self'], ['self'] ] },
    FUN2sq:  { args: [ 'string', 'self', 'self' ] },
    FUN1hl:  { args: [ 'string', 'string', 'string', 'self' ] },
    FUN1hf:  { args: [ 'string', FontForce, 'self' ] },
    FUN2h:   { args: [ 'string', 'any', 'self', 'self' ] },
    INFIXh:  { args: [ 'string', 'any', [ 'self' ], [ 'self' ] ] },
    MATRIX:  { args: [ 'string', [ [ [ 'self' ] ] ] ] },
    DECLh:   { args: [ 'string', FontForce, [ 'self' ] ] }
});
