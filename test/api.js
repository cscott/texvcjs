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

    var testcases = [
        // From MathInputCheckTexvcTest:
        // testGetValidTex()
        { in: '\\newcommand{\\text{do evil things}}',
          status: 'F', details: '\\newcommand' },
        { in: '\\sin\\left(\\frac12x\\right)',
          output: '\\sin \\left({\\frac  12}x\\right)' },
        // testGetValidTexCornerCases()
        { in: '\\reals',
          output: '\\mathbb{R}' },
        { in: '\\lbrack',
          output: '\\lbrack ' },
        // testConvertTexvcError
        { in: '\\figureEightIntegral',
          status: 'F', details: '\\figureEightIntegral' },
        // My own test cases:
        { in: '\\diamondsuit' },
        { in: '\\sinh x' },
        { in: '\\begin{foo}\\end{foo}',
          status: 'F', details: '\\begin{foo}' },
        { in: '\\hasOwnProperty',
          status: 'F', details: '\\hasOwnProperty' },
	// \hline only in array
	{ in: '\\hline', status: 'S' },
	{ in: '\\begin{array}\\hline a \\\\ \\hline\\hline b \\end{array}' }
    ];
    testcases.forEach(function(t) {
        it('should check '+JSON.stringify(t.in), function() {
            var result = texvcjs.check(t.in);
            assert.equal(result.status, t.status || '+');
            if (t.status === '+') {
                assert.equal(result.output, t.output || t.in);
            }
            if (t.status === 'F') {
                assert.equal(result.details, t.details);
            }
        });
    });
});
