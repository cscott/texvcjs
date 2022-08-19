"use strict";
var assert = require('assert');
var ast = require('../').ast;
var texvc = require('../');
var lister = require('../lib/identifier').render;
var testcases = [
    {in: '', out: []},
    {in: '.', out: []},
    {in: 'a'},
    {in: 'a.', out: ['a']},
    {in: 'a_\\text{x}', out: ['a']},
    {in: 'a_{bc}'},
    {in: 'a_{b,c}'},
    {in: 'a_{+}'},
    {in: 'a_{\\emptyset}'},
    {in: 'a_{-\\infty}'},
    {in: 'a_b^c', out: ['a', 'b', 'c']},
    {in: '\\int_0^\\infty', out: []},
    {in: 'a_{b\\pm c}', out: ['a', 'b', 'c']},
    {in: "\\mathrm{def}"},
    {in: 'k_{\\mathbf{B}}', out: ['k_{\\mathbf{B}}']},
    {in: "\\boldsymbol{\\sigma}"},
    {in: "\\mathbf{\\hat{n}}"},
    {in: 'a^2', out: ['a']},
    {in: 'a^2+b^2', out: ['a', 'b']},
    {in: 'a^{2}+b^{2}', out: ['a', 'b']},
    {in: '\\frac2b', out: ['b']},
    {in: 't_a', out: ['t_{a}']},
    {in: '\\mathrm{kg}', out: ['\\mathrm{kg}']},
    {in: '\\sqrt[3]{81}', out: []},
    {in: "a'_{k}", out: ['a\'', 'k']},
    {in: "x_n*x_{n-1}", out: ['x_{n}', 'x_{n-1}']},
    {in: 'a_{i_{j}}'},
    {in: '\\operatorname{arg min}', out: []},
    {in: "\\underbrace{x+y}_2", out: ['x', 'y']},
    {
        in: "\\hat{U}(t,t_0)=\\exp{\\left(-\\frac{i}\\hbar \\int_{t_0}^t \\hat{H}(t')dt'\\right)}",
        out: ['\\hat{U}', 't', 't_{0}', 'i', 't_{0}', 't', '\\hat{H}', 't\'', 't\'']
    },
    {
        in: "\\begin{align}\n  &[\\mathrm j_k, \\mathrm j_l]\n" +
        "    \\equiv \\mathrm j_k \\mathrm j_l - \\mathrm j_l \\mathrm j_k\n" +
        "    = i \\hbar \\sum_m \\varepsilon_{k, l, m} \\mathrm j_m\n" +
        "    & k, l, m &\\in \\{\\mathrm x, \\mathrm y, \\mathrm z\\}\n" +
        "\\end{align}",
        out: ["\\mathrm{j}_{k}", "\\mathrm{j}_{l}", "\\mathrm{j}_{k}", "\\mathrm{j}_{l}", "\\mathrm{j}_{l}", "\\mathrm{j}_{k}",
            "i", "m", "\\varepsilon_{k,l,m}", "\\mathrm{j}_{m}", "k", "l", "m", "\\mathrm{x}", "\\mathrm{y}", "\\mathrm{z}"]
    },
    {
        in: "x = \\int_1^y {\\mathrm{d}t \\over t}",
        out: ["x", "y", "t", "t"]
    },
    {
        in: "f'(x) = \\lim_{h \\to 0}{f(x+h) - f(x)\\over{h}}",
        out: ["f'", "x", "h", "f", "x", "h", "f", "x", "h"]
    },
    {
        in: "\\dot m = C_d A \\sqrt{k \\rho_0 P_0 \\left(\\frac{2}{k + 1}\\right)^{\\frac{k + 1}{k - 1}}}",
        out: ["\\dot{m}", "C_{d}", "A", "k", "\\rho_{0}", "P_{0}", "k", "k", "k"]
    },
    {
        in: "\\forall x \\Big(\\forall y (y \\in x \\rightarrow P[y]) \\rightarrow P[x]\\Big) \\rightarrow \\forall x \\, P[x]",
        out: ["x", "y", "y", "x", "P", "y", "P", "x", "x", "P", "x"]
    },
    {
        in: "\\text{Magnetic Reynolds number  }",
        out: []
    },
    {
        in: "\\int_{R_n} \\cdots \\int_{R_2} \\int_{R_1} f(x_1, x_2, \\ldots, x_n)" +
        " \\, dx_1 dx_2\\cdots dx_n \\equiv \\int_R f(\\boldsymbol{x}) \\, d^n\\boldsymbol{x}",
        out: ['R_{n}', 'R_{2}', 'R_{1}', 'f', 'x_{1}', 'x_{2}', 'x_{n}',
            'x_{1}', 'x_{2}', 'x_{n}', 'R', 'f', '\\boldsymbol{x}', 'n', '\\boldsymbol{x}']
    },
    {in: "\\mathbf{M}_{\\rm orb}", out: ['\\mathbf{M}_{\\mathrm{orb}}']},
    {in: "F=\\overline{(A \\wedge B) \\vee (C \\wedge D)}", out: ['F', 'A', 'B', 'C', 'D']},
    {
        in: "\\mathrm{2\\ Squares\\ of\\ Land}"
    },
    {
        in: "\\mathrm{d_k,d^k,d_{klo},\\left(d_{\\begin{matrix}a\\end{matrix}}\\right),\\frac12}",
        out: ['d_{k}', 'd', 'k', 'd_{klo}', 'd', 'a']
    },
    {
        in: "\\mathrm{\\begin{matrix}a\\end{matrix},\\big(,\\mbox{A},{\\rm b},1_2_3,1^2,1^2^3,1_2^3,_1^2}",
        out: ['a', 'b']
    },
    {
        in: "\\mathrm{a \\choose b, \\sqrt{4}}",
        out: ['a', 'b']
    },
    {
        in: "\\sideset{c}{d}e+\\sideset{_\\dagger^*}{_\\dagger^*}\\prod",
        out: ['c', 'd', 'e']
    }, {
        in: "\\mathrm{_a^b}", //FQN
        out: ['a', 'b']
    }, {
        in: "\\mathrm{\\sqrt[3]{81}}", //FUN2sq
        out: []
    }, {
        in: "\\mathrm{\\sideset{c}{d}e}", //FUN2nb
        out: ['c', 'd', 'e']
    }, {
        in: "\\mathrm{{}_c}",
        out: ['c']
    }    , {
        in: "\\mathrm{'_c}",
        out: ['c']
    },
    {
        in: "0_{d_k,d^k,d_{klo},\\left(d_{\\begin{matrix}a\\end{matrix}}\\right),\\frac12}",
        out: ['d_{k}', 'd', 'k', 'd_{klo}', 'd', 'a']
    },
    {
        in: "0_{\\begin{matrix}a\\end{matrix},\\big(,\\mbox{A},{\\rm b},1_2_3,1^2,1^2^3,1_2^3,_1^2}",
        out: ['a', 'b']
    },
    {
        in: "0_{a \\choose b, \\sqrt{4}}",
        out: ['a', 'b']
    },{
        in: "0_{_a^b}", //FQN
        out: ['a', 'b']
    }, {
        in: "0_{\\sqrt[3]{81}}", //FUN2sq
        out: []
    }, {
        in: "0_{\\sideset{c}{d}e}", //FUN2nb
        out: ['c', 'd', 'e']
    },  {
        in: "0_{{}_c}",
        out: ['c']
    }, {
        in:"0_{\\it a}",
        out: ['a']
    }, {
        in:"0_{\\cal a}",
        out: ['a']
    }, {
        in:"0_{\\bf a}",
        out: ['a']
    }, {
        in:"0_{\\bf }",
        out: []
    }, {
        in:"{\\frac {\\operatorname {d} u_{x}}{\\operatorname {d} t}}",
        out: ["u_{x}","t"]
    }, {
        in:"\\ce{H2O}", out:[]
    }, {
        in:"a_{\\ce{H2O}}", out:[ 'a' ]
    }, {
        in:"\\mathbb{\\ce{H2O}}", out:[]
    }, {
        in:"\\ce{\\underbrace{a}_{b}}",out:[]
    },
    {in: "\\phantom{a}", out:[]},
    {in: "\\hphantom{a}", out:[]},
    {in: "\\vphantom{a}", out:[]},
    {in: "{{ab}}", out:['a','b']},
    {in: "{{ab}}", out:['a','b']},
    {in: "\\rm sgn", out:['sgn']},
    {in: "\\dot{q_{i}}"}



    //{in: "\\reals", out:["\\reals"]},
    //{in: "\\mathrm {MTF}_{display}(\\xi,\\eta)", out: ["\\mathrm{MTF}_{display}", "\\xi", "\\eta"]}
];

describe('Identifiers', function () {
    testcases.forEach(function (tc) {
        var input = tc.in;
        var output = tc.out || [tc.in];
        it('should be discovered ' + JSON.stringify(input), function () {
            assert.deepEqual(lister(texvc.parse(input)), output);
        });
    });
    it('should ignore unknown objects', function () {
        assert.deepStrictEqual(lister({}),[])
    });
    it('extract_identifiers visitor should handle ARRAY ignore unknown objects', function () {
        const expr = new ast.Tex.ARRAY([ new ast.Tex.LITERAL('a')])
        assert.deepStrictEqual(expr.extractIdentifiers(),['a'])
    });
});
