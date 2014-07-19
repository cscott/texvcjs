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
	    console.assert(arguments.length === args.length);
	    for (var i=0; i<args.length; i++) {
		console.assert(typecheck(arguments[i], args[i], self));
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

var T = module.exports.T = new Enum( 'T', {
    TEX_LITERAL: { args: [ RenderT ] },
    TEX_CURLY:   { args: [ ['self'] ] },
    TEX_FQ:      { args: [ 'self', 'self', 'self' ] },
    TEX_DQ:      { args: [ 'self', 'self' ] },
    TEX_UQ:      { args: [ 'self', 'self' ] },
    TEX_FQN:     { args: [ 'self', 'self' ] },
    TEX_DQN:     { args: [ 'self' ] },
    TEX_UQN:     { args: [ 'self' ] },
    TEX_LR:      { args: [ RenderT, RenderT, [ 'self' ] ] },
    TEX_BOX:     { args: [ 'string', 'string' ] },
    TEX_BIG:     { args: [ 'string', RenderT ] },
    TEX_FUN1:    { args: [ 'string', 'self' ] },
    TEX_FUN1nb:  { args: [ 'string', 'self' ] },
    TEX_FUN2:    { args: [ 'string', 'self', 'self' ] },
    TEX_FUN2nb:  { args: [ 'string', 'self', 'self' ] },
    TEX_INFIX:   { args: [ 'string', ['self'], ['self'] ] },
    TEX_FUN2sq:  { args: [ 'string', 'self', 'self' ] },
    TEX_FUN1hl:  { args: [ 'string', 'string', 'string', 'self' ] },
    TEX_FUN1hf:  { args: [ 'string', FontForce, 'self' ] },
    TEX_FUN2h:   { args: [ 'string', 'any', 'self', 'self' ] },
    TEX_INFIXh:  { args: [ 'string', 'any', [ 'self' ], [ 'self' ] ] },
    TEX_MATRIX:  { args: [ 'string', [ [ [ 'self' ] ] ] ] },
    TEX_DECLh:   { args: [ 'string', FontForce, [ 'self' ] ] }
});
