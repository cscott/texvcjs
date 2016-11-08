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
    // hack up the source to make it pass jshint
    parserSource = parserSource
        .replace(/^\(function\(\) \{\n  "use strict";\n/m,
                 'module.exports = (function() {\n')
        .replace(/peg\$(subclass|SyntaxError)\([^)]*\) {/g, function(m) {
            return m + "\n    /*jshint validthis:true */";
        }).replace(/\n(\s+)([?:+]) (expectedDescs|peg\$|classEscape|", or "|descriptions)/g, ' $2\n$1$3')
        .replace(/^(\s+location = location.*[^;\n])$/mg, '$1;');
    parserSource =
        '/* jshint latedef: false, newcap: false */\n' +
        '"use strict";\n' +
        parserSource + ';';

    fs.writeFileSync(outFile, parserSource, 'utf8');
};

buildParser(INPUT_FILE, OUTPUT_FILE);
