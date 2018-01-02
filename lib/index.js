"use strict";

var json = require('../package.json');

module.exports = {
    name: json.name, // package name
    version: json.version // version # for this package
};

var Parser = require('./parser');
var render = module.exports.render = require('./render');
var tu = require('./texutil');

module.exports.ast = require('./ast');
module.exports.parse = Parser.parse.bind(Parser);
module.exports.SyntaxError = Parser.SyntaxError;

var astutil = require('./astutil');
module.exports.contains_func = astutil.contains_func;

function handleTexError(e, options) {
   if (options && options.debug) {
        throw e;
    }
    /* istanbul ignore else */
    if (e instanceof Parser.SyntaxError) {
        if (e.message === 'Illegal TeX function') {
            return {
                status: 'F', details: e.found,
                offset: e.offset, line: e.line, column: e.column,
                warnings: []
            };
        }
        return {
            status: 'S', details: e.toString(),
            offset: e.offset, line: e.line, column: e.column,
            warnings: []
        };
    } else { // this else statement is superfluous and was inserted for the coverage reporter
        return { status: '-', details: e.toString(), warnings: [] };
    }
}

var check = module.exports.check = function(input, options, warnings) {
    /* status is one character:
     *  + : success! result is in 'output'
     *  E : Lexer exception raised
     *  F : TeX function not recognized
     *  S : Parsing error
     *  - : Generic/Default failure code. Might be an invalid argument,
     *      output file already exist, a problem with an external
     *      command ...
     */
    if (typeof options === "undefined") {
        options = {};
        options.usemathrm = false;
        options.usemhchem = false;
    }
    if (typeof warnings === "undefined") {
      warnings = [];
    }
    try {
        // allow user to pass a parsed AST as input, as well as a string
        if (typeof(input)==='string') {
            input = Parser.parse(input, options);
        }
        var output = render(input);
        var result = { status: '+', output: output, warnings: warnings };
        ['ams', 'cancel', 'color', 'euro', 'teubner', 'mhchem', 'mathoid'].forEach(function(pkg) {
            pkg = pkg + '_required';
            result[pkg] = astutil.contains_func(input, tu[pkg]);
        });
        if (!options.usemhchem) {
            if (result.mhchem_required) {
                return {
                    status: 'C', details: "mhchem package required."
                };
            }
        }
        return result;
    } catch (e) {
        if(e instanceof Parser.SyntaxError && options.usemhchem && !options.oldmhchem ){
            warnings.push( {type: 'mhchem-deprecation', details:handleTexError(e,options)});
            options.oldmhchem = true;
            return check(input, options, warnings);
        }
        return handleTexError(e, options);
    }
};
