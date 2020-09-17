// Helper module to re/build the PEGJS parser.
'use strict';

const INPUT_FILE = __dirname + '/parser.pegjs';
const OUTPUT_FILE = __dirname + '/parser.js';

const buildParser = module.exports = function (inFile, outFile) {
    const PEG = require('pegjs');
    const fs = require('fs');

    let parserSource = PEG.generate(fs.readFileSync(inFile, 'utf8'), {
        /* PEGJS options */
        output: 'source',
        cache: true, // makes repeated calls to generic_func production efficient
        allowedStartTules: [ 'start' ]
    });
    parserSource = 'module.exports = ' + parserSource + ';';

    fs.writeFileSync(outFile, parserSource, 'utf8');
};

buildParser(INPUT_FILE, OUTPUT_FILE);
