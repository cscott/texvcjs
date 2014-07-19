"use strict";

var PEG = require('pegjs');
var fs = require('fs');

var filename = __dirname + '/parse.pegjs';
var parser = PEG.buildParser(fs.readFileSync(filename, 'utf8'), {
    /* PEGJS options */
});

module.exports.parse = parser.parse.bind(parser);
