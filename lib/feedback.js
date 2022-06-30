'use strict';
const texvcjs = require('./check');
const indentifierExtractor = module.exports.treeFromAst = require('./identifier').render;
const packageList = ['ams', 'cancel', 'color', 'euro', 'teubner', 'mhchem'];
const tokList = require('./flatList.js');
module.exports = function (input, options) {
    const out = {
        success: true
    };
    options = options || {};
    const texvcres = texvcjs.check(input, Object.assign(options, { usemathrm: true }));
    // TODO: Backwards compatibility consider to remove in the next update
    if (texvcres.status === 'C') {
        out.success = false;
        out.error = {
            status: texvcres.status,
            message: 'Attempting to use the $\\ce$ command outside of a chemistry environment.',
            detail: texvcres.details,
            found: '\\ce', // ce is the only command that can trigger this problem
            name: 'SyntaxError'
        };
        return out;
    }
    if (texvcres.status !== '+') {
        return texvcres;
    }
    input = texvcres.input;
    out.checked = texvcres.output;
    out.requiredPackages = [];
    packageList.forEach(function (pkg) {
        if (texvcres[pkg + '_required']) {
            out.requiredPackages.push(pkg);
        }
    });
    out.identifiers = indentifierExtractor(input);
    out.endsWithDot = false;
    const tokens = tokList(input, true);
    if (tokens.length && tokens[tokens.length - 1][0] === 0 && tokens[tokens.length - 1][1] === '.') {
        out.endsWithDot = true;
    }
    if (texvcres.warnings && texvcres.warnings.length) {
        out.warnings = texvcres.warnings;
    }
    return out;
};
