// Helper module to re/build the PEGJS parser.
'use strict';

const { basename } = require('path');
const INPUT_FILE = __dirname + '/parser.pegjs';
const OUTPUT_FILE = __dirname + '/parser.js';

const buildParser = module.exports = function (inFile, outFile, mapFile) {
    const peggy = require('peggy');
    const fs = require('fs');

    const parserSource = peggy.generate(fs.readFileSync(inFile, 'utf8'), {
        /* peggy options */
        output: 'source-and-map',
        format: 'commonjs',
        grammarSource: basename(inFile),
        cache: true, // makes repeated calls to generic_func production efficient
        allowedStartRules: [ 'start' ]
    });
    fs.writeFileSync(outFile, parserSource + `\
//\x23 sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(
        JSON.stringify(
            parserSource.toStringWithSourceMap().map.toJSON())
    ).toString('base64')}
`, 'utf8');
};

buildParser(INPUT_FILE, OUTPUT_FILE);
