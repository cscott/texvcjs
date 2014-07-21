"use strict";
var assert = require('assert');

var texvcjs = require('../');

describe('API', function() {
    it('should return success', function() {
	var result = texvcjs.check('\\sin(x)+{}{}\\cos(x)^2 newcommand');
	assert.equal(result.status, '+');
	assert.equal(result.output, '\\sin(x)+{}{}\\cos(x)^{2}newcommand');
    });
    it('should report undefined functions', function() {
	var result = texvcjs.check('\\foo');
	assert.equal(result.status, 'F');
	assert.equal(result.details, '\\foo');
    });
    it('should report undefined parser errors', function() {
	var result = texvcjs.check('^');
	assert.equal(result.status, 'S');
    });
});
