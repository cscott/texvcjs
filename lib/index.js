'use strict';
const json = require('../package.json');
const feedback = require('./feedback');

module.exports = {
    name: json.name, // package name
    version: json.version, // version # for this package
    feedback: feedback
};

const Parser = require('./parser');
module.exports.render = require('./render');

module.exports.parse = Parser.parse.bind(Parser);
module.exports.SyntaxError = Parser.SyntaxError;

const checks = require('./check');
module.exports.check = checks.check;

const texvcinfo = require('./texvcinfo');
module.exports.texvcinfo = texvcinfo.texvcinfo;
