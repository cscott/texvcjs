// Test AST.
"use strict";
var assert = require('assert');

var tex = require('../lib/tex');

describe('AST', function() {
    it('should construct and stringify', function() {
	var x = tex.T.TEX_LITERAL(tex.RenderT.TEX_ONLY('a'));
	var y = tex.T.TEX_UQN(x);
	var z = tex.T.TEX_CURLY([x, y]);

	assert.equal(z.toString(), 'TEX_CURLY([TEX_LITERAL(TEX_ONLY("a")),TEX_UQN(TEX_LITERAL(TEX_ONLY("a")))])');
    });
});
