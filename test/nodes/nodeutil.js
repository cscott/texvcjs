'use strict';
const assert = require('assert');
const Nodeutil = require('../../lib/nodes/nodeutil');
const goldData = require('../goldData');
require("../../lib");
const Parser = require('../../lib/parser');


describe('Parse and render with new classes', function () {
    [
        '',
        'a',
        'a^2',
        'a^2+b^{2}',
        'l_a^2+l_b^2=l_c^2',
        '\\text{x}',
        '\\Big(',
        '\\begin{alignedat} { 3 } a & b & c \\end{alignedat}',
        '\\cal x',
        '\\binom{A}{B}',
        '\\sideset{_\\dagger^*}{_\\dagger^*}',
        '\\sqrt[3]{2}'
    ].forEach(function (e) {
        it('should parse: ' + JSON.stringify(e), function () {
            const node = Nodeutil.toNode(e);
            assert.strictEqual('TexArray',
                node.__proto__.constructor.name);
            node.render();
        });
    });
    goldData.goldData.forEach(function (tc) {
        const input = tc.math_inputtex;
        it('in qID' + tc.qID + ' should be discovered ' + JSON.stringify(input), function () {
            const ast = Parser.parse(input);
            const node = Nodeutil.toNode(ast);
            assert.strictEqual(node.render(), ast.render_tex());
        });
    });
});
