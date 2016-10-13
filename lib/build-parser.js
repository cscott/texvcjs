// Helper module to re/build the PEGJS parser.
"use strict";

var INPUT_FILE = __dirname + '/parser.pegjs';
var OUTPUT_FILE = __dirname + '/parser.js';

var buildParser = module.exports = function(inFile, outFile) {
    var PEG = require('pegjs');
    var fs = require('fs');

    var parserSource = PEG.generate(fs.readFileSync(inFile, 'utf8'), {
        /* PEGJS options */
        output: "source",
        cache: true,// makes repeated calls to generic_func production efficient
        allowedStartTules: [ "start" ]
    });
    parserSource = 'module.exports = ' + parserSource + ';';

    fs.writeFileSync(outFile, parserSource, 'utf8');
};

buildParser(INPUT_FILE, OUTPUT_FILE);
