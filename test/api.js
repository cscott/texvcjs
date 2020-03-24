'use strict';
var assert = require('assert');

var texvcjs = require('../');

describe('API', function () {
    it('should return success (1)', function () {
        var result = texvcjs.check('\\sin(x)+{}{}\\cos(x)^2 newcommand');
        assert.equal(result.status, '+');
        assert.equal(result.output, '\\sin(x)+{}{}\\cos(x)^{2}newcommand');
    });
    it('should return success (2)', function () {
        var result = texvcjs.check('y=x+2');
        assert.equal(result.status, '+');
        assert.equal(result.output, 'y=x+2');
    });
    it('should report undefined functions (1)', function () {
        var result = texvcjs.check('\\foo');
        assert.equal(result.status, 'F');
        assert.equal(result.details, '\\foo');
    });
    it('should report undefined functions (2)', function () {
        var result = texvcjs.check('\\write18');
        assert.equal(result.status, 'F');
        assert.equal(result.details, '\\write');
    });
    it('should report undefined parser errors', function () {
        var result = texvcjs.check('^');
        assert.equal(result.status, 'S');
    });

    it('should throw an exception in debug mode', function () {
        assert.throws(function () {
            texvcjs.check('^', { debug: true });
        }, /SyntaxError/
        );
    });

    it('should accept parsed input', function () {
        var parsed = texvcjs.parse('y=x+2');
        var result = texvcjs.check(parsed);
        assert.equal(result.status, '+');
        assert.equal(result.output, 'y=x+2');
    });

    var testcases = [
        // From MathInputCheckTexvcTest:
        // testGetValidTex()
        { in: '\\newcommand{\\text{do evil things}}',
            status: 'F', details: '\\newcommand' },
        { in: '\\sin\\left(\\frac12x\\right)',
            output: '\\sin \\left({\\frac {1}{2}}x\\right)' },
        // testGetValidTexCornerCases()
        { in: '\\reals',
            output: '\\mathbb {R} ',
            ams_required: true },
        { in: '\\lbrack',
            output: '\\lbrack ' },
        // testConvertTexvcError
        { in: '\\figureEightIntegral',
            status: 'F', details: '\\figureEightIntegral' },
        // My own test cases:
        { in: '\\diamondsuit ' },
        { in: '\\sinh x' },
        { in: '\\begin{foo}\\end{foo}',
            status: 'F', details: '\\begin{foo}' },
        { in: '\\hasOwnProperty',
            status: 'F', details: '\\hasOwnProperty' },
        // \hline only in array
        { in: '\\hline', status: 'S' },
        { in: '\\begin{array}{c}\\hline a \\\\ \\hline\\hline b \\end{array}',
            output: '{\\begin{array}{c}\\hline a\\\\\\hline \\hline b\\end{array}}' },
        // required packages
        { in: '\\Diamond ',
            ams_required: true },
        { in: '{\\begin{matrix}a\\ b\\end{matrix}}',
            ams_required: true },
        { in: '{\\cancel {x}}',
            cancel_required: true },
        { in: '\\color {red}',
            color_required: true },
        { in: '\\euro',
            output: '\\mbox{\\euro} ',
            euro_required: true },
        { in: '\\coppa',
            output: '\\mbox{\\coppa} ',
            teubner_required: true },
        { in: '\\mathbb {R}',
            output: '\\mathbb {R} ',
            ams_required: true },
        { in: '\\reals',
            output: '\\mathbb {R} ',
            ams_required: true },
        // color parsing
        { in: '{\\color [rgb]{1,0,0}{\\mbox{This text is red.}}}',
            color_required: true },
        { in: '{\\color[rgb]{1.5,0,0}{\\mbox{This text is bright red.}}}',
            status: 'S' },
        { in: '{\\color [RGB]{51,0,0}{\\mbox{This text is dim red.}}}',
            output: '{\\color [rgb]{0.2,0,0}{\\mbox{This text is dim red.}}}',
            color_required: true },
        { in: '{\\color[RGB]{256,0,0}{\\mbox{This text is bright red.}}}',
            status: 'S' },
        { in: '\\ce{ H2O }',
            output: '{\\ce {H2O}}',
            mhchem_required: true,
            status: 'C' },
        { in: '\\ce{[Zn(OH)4]^2-}',
            output: '{\\ce {[Zn(OH)4]^{2}-}}',
            mhchem_required: true,
            status: 'C' }
    ];
    testcases.forEach(function (t) {
        it('should check ' + JSON.stringify(t.in), function () {
            var result = texvcjs.check(t.in);
            assert.equal(result.status, t.status || '+');
            if (result.status === '+') {
                assert.equal(result.output, t.output || t.in);
                Object.keys(result).forEach(function (f) {
                    if (/_required$/.test(f)) {
                        assert.equal(!!result[f], !!t[f], f);
                    }
                    assert.equal(result.warnings.length, 0, 'No warnings expected here.');
                });
            }
            if (result.status === 'F') {
                assert.equal(result.details, t.details);
                assert.equal(result.warnings.length, 0, 'No warnings expected here.');
            }
        });
    });

    it('should retry parsing if oldmhchem is not set', function () {
        var result = texvcjs.check('\\ce {A\\;+\\;B\\;->\\;C}', { usemhchem: true });
        assert.equal(result.status, '+');
        assert.equal(result.warnings[0].type, 'mhchem-deprecation');
        assert.equal(result.warnings[0].details.status, 'S');
    });

    it('should not retry parsing if oldmhchem is set', function () {
        var result = texvcjs.check('\\ce {A\\;+\\;B\\;->\\notvalidcommand}', { usemhchem: true, oldmhchem: true });
        assert.equal(result.status, 'F');
    });
});
