#!/usr/bin/env node
'use strict';
const fs = require('fs');
const tu = require('../lib/texutil');
const letterMods = Object.keys(tu.is_letter_mod);
const literals = Object.keys(tu.is_literal);

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
