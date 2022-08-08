'use strict';

const assert = require('assert');

// allow user to pass an unparsed TeX string, or a parsed AST (which will
// usually be an array of `ast.Tex`), or a low-level `ast.Tex` node.
module.exports.toNode = function (t) {
    if (typeof (t) === 'string') {
        t = require('../parser').parse(t);
    }
    assert.ok(!Array.isArray(t), 'Old array type found.');
    return t;
};
