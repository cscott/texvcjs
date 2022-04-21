// Information about TeX functions.
// In its own module so that the sets aren't recreated from scratch
// every time that parse() is called.
'use strict';

(function () {
    // track all known function names, so we can give good errors for unknown
    // functions.
    const allFunctions = module.exports.all_functions = Object.create(null);
    allFunctions['\\begin'] = allFunctions['\\end'] = true;
    const functions = require('./texutil.json');
    for (const functionsKey in functions) {
        for (const k in functions[functionsKey]) {
            if (module.exports[k] === undefined) {
                module.exports[k] = Object.create(null);
            }
            module.exports[k][functionsKey] = functions[functionsKey][k];
            allFunctions[functionsKey] = true;
        }
    }

}());
