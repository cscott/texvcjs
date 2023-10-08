'use strict';

const Parser = require('./parser');
const render = module.exports.render = require('./render');
const tu = require('./texutil');

module.exports.parse = Parser.parse.bind(Parser);
module.exports.SyntaxError = Parser.SyntaxError;

/*
  Gets the location information of an error object, or returns default error
   location if no location information was specified.
 */
function getLocationInfo(e) {
    try {
        return {
            offset: e.location.start.offset,
            line: e.location.start.line,
            column: e.location.start.column
        };
    } catch (err) {
        /* istanbul ignore next */
        return { offset: 0, line: 0, column: 0 };
    }
}

function handleTexError(e, options) {
    if (options && options.debug) {
        throw e;
    }
    let report = { success: false, warnings: [] };
    /* istanbul ignore else */
    if (e instanceof Parser.SyntaxError) {
        if (e.message === 'Illegal TeX function') {
            report = Object.assign(report, { status: 'F', details: e.found }, getLocationInfo(e));
        } else {
            report = Object.assign(report, { status: 'S', details: e.toString() }, getLocationInfo(e));
        }
        report.error = {
            message: e.message,
            expected: e.expected,
            found: e.found,
            location: {
                end: e.location.end,
                start: e.location.start
            },
            name: e.name
        };
    } else { // this else statement is superfluous and was inserted for the coverage reporter
        report = Object.assign(report, { status: '-', details: e.toString() });
        report.error = e;
    }
    return report;
}

const check = module.exports.check = function (input, options, warnings) {
    /* status is one character:
     *  + : success! result is in 'output'
     *  E : Lexer exception raised
     *  F : TeX function not recognized
     *  S : Parsing error
     *  - : Generic/Default failure code. Might be an invalid argument,
     *      output file already exist, a problem with an external
     *      command ...
     */
    if (typeof options === 'undefined') {
        options = {};
        options.usemathrm = false;
        options.usemhchem = false;
    }
    if (typeof warnings === 'undefined') {
        warnings = [];
    }
    try {
        // allow user to pass a parsed AST as input, as well as a string
        if (typeof (input) === 'string') {
            input = Parser.parse(input, options);
        }
        const output = render(input);
        const result = { status: '+', output: output, warnings: warnings, input: input };
        ['ams', 'cancel', 'color', 'euro', 'teubner', 'mhchem', 'stix'].forEach(function (pkg) {
            pkg = pkg + '_required';
            result[pkg] = input.contains_func(tu[pkg]);
        });
        if (!options.usemhchem) {
            if (result.mhchem_required) {
                return {
                    status: 'C', details: 'mhchem package required.'
                };
            }
        }
        return result;
    } catch (e) {
        if (e instanceof Parser.SyntaxError && !options.oldtexvc && e.message.startsWith('Deprecation')) {
            warnings.push({ type: 'texvc-deprecation', details: handleTexError(e, options) });
            options.oldtexvc = true;
            return check(input, options, warnings);
        }
        if (e instanceof Parser.SyntaxError && options.usemhchem && !options.oldmhchem) {
            warnings.push({ type: 'mhchem-deprecation', details: handleTexError(e, options) });
            options.oldmhchem = true;
            return check(input, options, warnings);
        }
        return handleTexError(e, options);
    }
};
