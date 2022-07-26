'use strict';
const assert = require('assert');
const Parser = require('../lib/parser');

describe('Parse', function () {
    [ '', 'a', 'a^2', 'a^2+b^{2}', 'l_a^2+l_b^2=l_c^2' ].forEach(function (e) {
        it('should parse: ' + JSON.stringify(e), function () {
            Parser.parse(e);
        });
    });
    it('should parse texvc example', function () {
        const e = '\\sin(x)+{}{}\\cos(x)^2 newcommand';
        Parser.parse(e);
    });
    it('should parse texvc specific functions', function () {
        const r = '\\reals', s = '\\mathbb{R}';
        const p = Parser.parse(r), q = Parser.parse(s);
        assert.strictEqual(p.toString(), q.toString());
    });
});
