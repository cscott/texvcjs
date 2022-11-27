#!/usr/bin/env node
'use strict';
const fs = require('fs');
const tu = require('../lib/texutil');
const letterMods = Object.keys(tu.is_letter_mod);
const literals = Object.keys(tu.is_literal);

const sets = [
    'big_literals',
    'box_functions',
    'color_function',
    'declh_function',
    'definecolor_function',
    'fun_ar1',
    'fun_ar1nb',
    'fun_ar1opt',
    'fun_ar2',
    'fun_ar2nb',
    'fun_infix',
    'fun_mhchem',
    'hline_function',
    'latex_function_names',
    'left_function',
    'mediawiki_function_names',
    'mhchem_bond',
    'mhchem_macro_1p',
    'mhchem_macro_2p',
    'mhchem_macro_2pc',
    'mhchem_macro_2pu',
    'mhchem_single_macro',
    'nullary_macro',
    'nullary_macro_in_mbox',
    'other_delimiters1',
    'other_delimiters2',
    'right_function'
];

const argCounts = {
    big_literals: 1,
    box_functions: 1,
    color_function: 1,
    definecolor_function: 1,
    fun_ar1: 1,
    fun_ar1nb: 1,
    fun_ar1opt: 1,
    fun_ar2: 2,
    fun_infix: 1,
    fun_ar2nb: 5,
    fun_mhchem: 1,
    left_function: 1,
    right_function: 1,
    mhchem_bond: 1,
    mhchem_macro_1p: 1,
    mhchem_macro_2p: 2,
    mhchem_macro_2pu: 1
};

const sampleArgs = {
    big_literals: '(',
    color_function: '{red}{red}',
    mhchem_macro_2pc: '{red}{red}',
    definecolor_function: '{mycolor}{cmyk}{.4,1,1,0}',
    fun_ar2nb: '{_1^2}{_3^4}\\sum',
    left_function: '( \\right.',
    right_function: ')',
    mhchem_bond: '{-}'
};

const printSample = (set, elem) => {
    const count = argCounts[set] === undefined ? 0 : argCounts[set];
    const textString = elem.replace('\\', '\\textbackslash ');
    if (set === 'fun_infix') {
        return `\\texttt{${textString}} applied on $ x, y$ is rendered as $x${elem} y$`;
    }
    if (set === 'hline_function') {
        return `\\texttt{${textString}} applied in a table is rendered as $\\begin{matrix}
x_{11} & x_{12} \\\\
\\hline
\\end{matrix}$`;
    }
    if (set === 'mediawiki_function_names') {
        return `\\texttt{${textString}} is rendered as $\\operatorname{${elem.slice(1)}} y$`;
    }
    if (set === 'right_function') {
        return `\\texttt{${textString}} is rendered as $\\left. \\right)$`;
    }
    if (elem === '\\limits' || elem === '\\nolimits') {
        return `\\texttt{${textString}} is rendered for example as $\\mathop\\cap${elem}_a^b$`;
    }
    if (elem === '\\strokeint') { // cf. https://phabricator.wikimedia.org/T137787
        return '\\texttt{\\textbackslash stroked?int} currently not supported cf. \\newline' +
            ' \\url{https://phabricator.wikimedia.org/T137787}';
    }
    if (elem === '\\pagecolor') {
        return '\\texttt{\\textbackslash pagecolor} is not rendered.';
    }
    if (elem === '\\ca') {
        return '\\texttt{\\textbackslash ca} was never used. \\newline ' +
            ' \\url{https://phabricator.wikimedia.org/T323878}';
    }
    let args = '';
    if (sampleArgs[set] === undefined) {
        for (let i = 0; i < count; i++) {
            args += '{' + String.fromCharCode(97 + i) + '}';
        }
    } else {
        args = sampleArgs[set];
    }
    const argDesc = count > 1 ? `applied on $${args}$ ` : '';
    const rendering = set.startsWith('mhchem') ?
        `\\ce{${elem}${args}}` :
        elem + args;
    return `\\texttt{${textString}} ${argDesc}is rendered as $${rendering}$`;

};

const printMod = function (x) {
    const textString = x.replace('\\', '\\textbackslash ');
    return '\\texttt{' + textString + '} applied on $x,X$ is rendered as $' + x + '{x},' + x + '{X}$\n\n';
};

const printLiteral = function (x) {
    const textString = x.replace('\\', '\\textbackslash ');
    return '\\texttt{' + textString + '} is rendered as $' + x + '$\n\n';
};
const write = function (fn, content) {
    fs.writeFile('./../doc/' + fn + '.tex', content, function (err) {
        if (err) {
            console.log('error saving document', err);
        } else {
            console.log('The file "' + fn + '" was saved!');
        }
    });
};
write('commands', letterMods.map(printMod).join('\n'));
write('literals', literals.map(printLiteral).join('\n'));
write('groups', sets.map((set) =>
    '\\section{ Group \\texttt{' + set.replace(/_/g, '\\textunderscore ') + '}}\n\n' +
        Object.entries(tu[set]).map((elem) =>
            printSample(set, elem[0])
        ).join('\n\n')
).join('\n\n')
);
