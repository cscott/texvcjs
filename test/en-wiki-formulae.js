"use strict";
var assert = require('assert');
var texvcjs = require('../');

var fs = require('fs');
var path = require('path');

// set this variable to the path to your texvccheck binary for additional
// sanity-checking against the ocaml texvccheck.
var TEXVCBINARY=0; // "../../Math/texvccheck/texvccheck";

var tryocaml = function(input, output, done, fixDoubleSpacing) {
    if (!TEXVCBINARY) { return done(); }
    var cp = require('child_process');
    cp.execFile(TEXVCBINARY, [input], { encoding: 'utf8' }, function(err,stdout,stderr) {
        if (err) { return done(err); }
        if (stderr) { return done(stderr); }
        if (fixDoubleSpacing) { stdout = stdout.replace(/  /g, ' '); }
        assert.equal(stdout, '+' + output);
        done();
    });
};

var known_bad = Object.create(null);
[
    // Illegal TeX function: \fint
    "\\fint",

    // Illegal TeX function: \for
    "\\for every",

    // wikitext!
    "</nowiki> tag exists if that was the only help page you read. If you looked at [[Help:Math]] (also known as [[Help:Displaying a formula]], [[Help:Formula]] and a bunch of other names), the first thing it says is \"MediaWiki uses a subset of TeX markup\"; a bit later, under \"[[Help:Math#Syntax|Syntax]]\", it says \"Math markup goes inside <nowiki><math> ... ",

     // colors should be 0-1, not 0-255
    "\\definecolor{gray}{RGB}{249,249,249}\\pagecolor{gray} g \\mapsto g\\circ h",

    // unicode literal: ≠
    "\\frac{a}{b}, a, b \\in \\mathbb{Z}, b ≠ 0",

    // "Command \^ invalid in math mode"
    "\\gamma\\,\\pi\\,\\sec\\^2(\\pi\\,(p-\\tfrac{1}{2}))\\!",

    // html entity
    "\\mathbb{Q} \\big( \\sqrt{1 &ndash; p^2} \\big)",

    // unicode literal: ∈
    "p_k ∈ J",

    // unicode literal: −
    "(r−k)!",

    // colors are 0-1
    "\\definecolor{red}{RGB}{255,0,0}\\pagecolor{red}e^{i \\pi} + 1 = 0\\,\\!",

    // anomalous @ (but this is valid in math mode)
    "ckl@ckl",

    // unicode literal: ×
    "u×v",

    // bad {} nesting
    "V_{\\text{in}(t)",

    // Illegal TeX function: \cdotP
    "\\left[\\begin{array}{c} L_R \\\\ L_G \\\\ L_B \\end{array}\\right]=\\mathbf{P^{-1}A^{-1}}\\left[\\begin{array}{ccc}R_w/R'_w & 0 & 0 \\\\ 0 & G_w/G'_w & 0 \\\\ 0 & 0 & B_w/B'_w\\end{array}\\right]\\mathbf{A\\cdotP}\\left[\\begin{array}{c}L_{R'} \\\\ L_{G'} \\\\ L_{B'} \\end{array}\\right]",

    // Illegal TeX function: \colour
    "\\colour{red}test",

    // unicode literal: ½
    "½",

    // unicode literal: …
    "…",

    // Illegal TeX function: \y
    " \\y (s)  ",

     // colors should be 0-1, not 0-255
    "\\definecolor{orange}{RGB}{255,165,0}\\pagecolor{orange}z=re^{i\\phi}=x+iy \\,\\!",

    // should be \left\{ not \left{
    "\\delta M_i^{-1} = - \\propto \\sum_{n=1}^N D_i \\left[ n \\right] \\left[ \\sum_{j \\in C \\left{i\\right} } F_{j i} \\left[ n - 1 \\right] + Fext_i \\left[ n^-1 \\right] \\right]",

    // Illegal TeX function: \sout
    "\\sout{4\\pi x}",

    // unicode literal: −
    "~\\sin^{−1} \\alpha",

    // wikitext
    "\"</nowiki> and <nowiki>\"",

    // unicode literal (?): \201 / \x81
    "\\ x\x81'=ax+by+k_1",

    // wikitext
    "</nowiki></code> tag does not consistently italicize text which it encloses.  For example, compare \"<math>Q = d",

    // unicode literal: ²
    "x²",

    // Illegal TeX function: \grdot
    "\\grdot",

    // Illegal TeX function: \setin (also missing "}")
    "\\mathbb{\\hat{C}}\\setminus \\overline{\\mathbb{D}} = { w\\setin",

    // unicode literal: −
    "x−y",

    // Illegal TeX function: \spacingcommand
    "\\scriptstyle\\spacingcommand ",

    // unicode literal: π
    "e^{iπ} = \\cos(π) + i\\sin(π) \\!",

    // unicode literal: α
    "sin 2α",

     // colors should be 0-1, not 0-255
    "\\definecolor{orange}{RGB}{255,165,0}\\pagecolor{orange}e^{i \\pi} + 1 = 0\\,\\!",

    // unicode literal: ∈
    "\\sum_{v=∈V}^{dv} i",

    // missing \right)
    "Q(x + \\alpha,y + \\beta) = \\sum_{i,j} a_{i,j} \\left( \\sum_u \\begin{pmatrix}i\\\\u\\end{pmatrix} x^u \\alpha^{i-u} \\right) \\left( \\sum_v",

    // missing \left)
    "\\begin{pmatrix}i\\\\v\\end{pmatrix} y^v \\beta^{j-v} \\right)",

    // unicode literal: ₃
    "i₃",

    // unicode literal: ≠
    "x ≠ 0",

    // unicode literals: α, →, β
    "((α → β) → α) → α",

    // unicode literal: −
    "(\\sin(\\alpha))^{−1}\\,",

    // wikitext
    "</nowiki>&hellip;<nowiki>",

    // not enough arguments to \frac
    "K_i = \\gamma^{L} _{i} * P_{i,Sat} \\frac{{P}}",

     // colors should be 0-1, not 0-255
    "\\definecolor{gray}{RGB}{249,249,249}\\pagecolor{gray} g \\mapsto f\\circ g",

    // wikitext
    " it has broken spacing -->&nbsp;meters. LIGO should be able to detect gravitational waves as small as <math>h \\approx 5\\times 10^{-22}",

    // not enough arguments
    "\\binom",

    // unicode literal: −
    "\\text {E}=\\text {mgh}=0.1\\times980\\times10^{−2}=0.98\\text {erg}",

    // unicode literals: ⊈, Ō
    "⊈Ō",
].forEach(function(s) { known_bad[s] = true; });

// mocha is too slow if we run these as 287,201 individual test cases.
// run them in chunks in order to speed up reporting.
var CHUNKSIZE = 1000;

describe('All formulae from en-wiki:', function() {
    // read test cases
    var formulae =
        fs.readFileSync(path.join(__dirname, 'en-wiki-formulae.txt'), 'utf8').
        split(/\n+/g);

    // group them into chunks
    var grouped = (function(arr, n) {
        var result = [], group = [];
        var seen = Object.create(null);
        arr.forEach(function(elem) {
            if (seen[elem]) { return; } else { seen[elem] = true; }
            group.push(elem);
            if (group.length >= n) {
                result.push(group);
                group = [];
            }
        });
        result.push(group);
        return result;
    })(formulae, CHUNKSIZE);

    // create a mocha test case for each chunk
    grouped.forEach(function(group) {
        it(group[0] + ' ... ' + group[group.length-1], function() {
            group.forEach(function(f) {
                var result = texvcjs.check(f);
                var good = (result.status === '+');
                if (known_bad[f]) {
                    assert.ok(!good, f);
                } else {
                    assert.ok(good, f);
                    assert.equal(texvcjs.check(result.output).status, '+',
                                 f+' -> '+result.output);
                }
            });
        });
    });
});
