// Render an AST.
'use strict';

const assert = require('assert');

module.exports = function render(e) {
    assert.ok(!Array.isArray(e), 'Old array type found.');
    return e.render();
};
