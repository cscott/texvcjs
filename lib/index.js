"use strict";

var json = require('../package.json');

module.exports = {
    name: json.name, // package name
    version: json.version // version # for this package
};

var check = module.exports.check = function(input) {
    // xxx write me.
    return {
	status: 0,
	output: input
    };
};
