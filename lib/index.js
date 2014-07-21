"use strict";

var json = require('../package.json');

module.exports = {
    name: json.name, // package name
    version: json.version // version # for this package
};

var Parser = require('./parser');
var render = require('./render');

var check = module.exports.check = function(input) {
    /* status is one character:
     *  + : success! result is in 'output'
     *  E : Lexer exception raised
     *  F : TeX function not recognized
     *  S : Parsing error
     *  - : Generic/Default failure code. Might be an invalid argument,
     *      output file already exist, a problem with an external
     *      command ...
     */
    try {
	var output = render(Parser.parse(input));
	return { status: '+', output: output };
    } catch (e) {
	if (e instanceof Parser.SyntaxError) {
	    if (e.message === 'Illegal TeX function') {
		return {
		    status: 'F', details: e.found,
		    offset: e.offset, line: e.line, column: e.column
		};
	    }
	    return {
		status: 'S', details: e.toString(),
		offset: e.offset, line: e.line, column: e.column
	    };
	}
	return { status: '-', details: e.toString() };
    }
};
