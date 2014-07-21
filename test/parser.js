"use strict";
var assert = require('assert');

var Parser = require('../lib/parser');

describe('Parse', function() {
    [ '', 'a', 'a^2', 'a^2+b^{2}', 'l_a^2+l_b^2=l_c^2' ].forEach(function(e) {
	it('should parse: '+JSON.stringify(e), function() {
	    var p = Parser.parse(e);
	});
    });
    it.skip('should parse texvc example', function() {
	var p = Parser.parse('\\sin(x)+{}{}\\cos(x)^2 newcommand');
    });
});
