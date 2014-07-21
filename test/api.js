"use strict";
var assert = require('assert');

var texvcjs = require('../');

describe('API', function() {
    it('should return success (1)', function() {
	var result = texvcjs.check('\\sin(x)+{}{}\\cos(x)^2 newcommand');
	assert.equal(result.status, '+');
	assert.equal(result.output, '\\sin(x)+{}{}\\cos(x)^{2}newcommand');
    });
    it('should return success (2)', function() {
	var result = texvcjs.check('y=x+2');
	assert.equal(result.status, '+');
	assert.equal(result.output, 'y=x+2');
    });
    it('should report undefined functions (1)', function() {
	var result = texvcjs.check('\\foo');
	assert.equal(result.status, 'F');
	assert.equal(result.details, '\\foo');
    });
    it('should report undefined functions (2)', function() {
	var result = texvcjs.check('\\write18');
	assert.equal(result.status, 'F');
	assert.equal(result.details, '\\write');
    });
    it('should report undefined parser errors', function() {
	var result = texvcjs.check('^');
	assert.equal(result.status, 'S');
    });
});
