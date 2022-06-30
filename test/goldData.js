/**
 * This data was obtained by running the identifier extraction against the wikipedia pages specified in the NTCIR-11
 * Math Wikipedia Task [1] and comparing it with the gold standard obtained from mlp.formulasearchengine.com.
 * It should be seen as a self test and test failures can be a good thing, if the fp or fn are reduced.
 *
 * [1] M. Schubotz, A. Youssef, V. Markl, and H. S. Cohl.
 * Challenges of Mathematical Information Retrievalin the NTCIR-11 Math Wikipedia Task. In SIGIR, 2015.)
 */
module.exports = {
    goldData: [
        {
            "fn": [],
            "fp": [],
            "identifier": ["W", "k", "\\varepsilon"],
            "math_inputtex": "W(2, k) > 2^k/k^\\varepsilon",
            "qID": "1"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["X", "\\Sigma"],
            "math_inputtex": "(X,\\Sigma)",
            "qID": "2"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["p", "n"],
            "math_inputtex": "(p-1)!^n",
            "qID": "3"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["f_{c}", "z", "c", "c"],
            "math_inputtex": "f_c(z) = z^2 + c",
            "qID": "4"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["x", "x", "y", "y", "P"],
            "math_inputtex": "\\forall x \\, \\forall y \\, P(x,y) \\Leftrightarrow \\forall y \\, \\forall x \\, P(x,y)",
            "qID": "5"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\alpha", "x"],
            "math_inputtex": "\\alpha(x)",
            "qID": "6"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\alpha", "\\alpha", "x"],
            "math_inputtex": "\\alpha(x)",
            "qID": "7"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\alpha", "\\alpha", "x"],
            "math_inputtex": "\\alpha(x)",
            "qID": "8"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\Psi", "i_{1}", "i_{2}", "\\alpha_{1}", "\\alpha_{2}", "\\Gamma", "\\lambda", "\\Phi", "N", "N"],
            "math_inputtex": "|{\\Psi}\\rangle=\\sum_{i_1,i_2,\\alpha_1,\\alpha_2}\\Gamma^{[1]i_1}_{\\alpha_1}\\lambda^{[1]}_{\\alpha_1}\\Gamma^{[2]i_2}_{\\alpha_1\\alpha_2}\\lambda^{[2]}_{{\\alpha}_2}|{i_1i_2}\\rangle|{\\Phi^{[3..N]}_{\\alpha_2}}\\rangle",
            "qID": "9"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["z", "x", "y"],
            "math_inputtex": "z*x\\le y",
            "qID": "10"
        }, {
            "fn": [],
            "fp": ["d"],
            "identifier": ["x", "c"],
            "math_inputtex": " \\frac{d}{dx}\\left( \\log_c x\\right) = {1 \\over x \\ln c} , \\qquad c > 0, c \\ne 1",
            "qID": "11"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\theta", "n"],
            "math_inputtex": "\\theta = n \\times 137.508^\\circ,",
            "qID": "12"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["s_{V}", "\\mathcal{R}"],
            "math_inputtex": "s_V(\\mathcal{R})",
            "qID": "13"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\ell", "m"],
            "math_inputtex": "\\ell(m)",
            "qID": "14"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["b", "x"],
            "math_inputtex": "bx-x^2",
            "qID": "15"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\omega_{k}"],
            "math_inputtex": "\\omega_{k}",
            "qID": "16"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\mathbf{m}_{1}", "\\mathbf{m}_{1}"],
            "math_inputtex": "\\mathbf{m}_1",
            "qID": "17"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["r_{ij}"],
            "math_inputtex": "r_{ij}",
            "qID": "18"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["Z", "Z", "j", "g_{j}", "\\mathrm{e}", "\\beta", "\\beta", "E_{j}"],
            "math_inputtex": " Z = \\sum_{j} g_j \\cdot \\mathrm{e}^{- \\beta E_j}",
            "qID": "19"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["S'"],
            "math_inputtex": "S'",
            "qID": "20"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["S'", "S'", "S'", "S'", "S'"],
            "math_inputtex": "S'",
            "qID": "21"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["k", "l", "i", "j"],
            "math_inputtex": "\\text{Ker} (k_* - l_*) \\cong \\text{Im} (i_*, j_*).",
            "qID": "22"
        }, {
            "fn": [],
            "fp": ["F_{i}"],
            "identifier": ["D", "G", "G", "G", "G", "H", "H", "H", "H", "i", "i"],
            "math_inputtex": "D(G,H) = \\sum_{i=1}^{29} | F_i(G) - F_i(H) |",
            "qID": "23"
        }, {
            "fn": ["E_{\\mathrm{k}}", "E_{\\mathrm{r}}", "E_{\\mathrm{t}}"],
            "fp": ["E_{t}", "E"],
            "identifier": ["E_{\\mathrm{k}}", "E_{\\mathrm{k}}", "E_{\\mathrm{r}}", "E_{\\mathrm{r}}", "E_{\\mathrm{r}}", "E_{\\mathrm{t}}"],
            "math_inputtex": " E_\\text{k} = E_t + E_\\text{r} \\, ",
            "qID": "24"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\lambda", "\\lambda", "L", "L", "B", "d", "d"],
            "math_inputtex": "\\lambda(L(B)) \\leq d",
            "qID": "25"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["L", "C", "T"],
            "math_inputtex": "L\\left(C\\right) \\leq L\\left(T\\right)",
            "qID": "26"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["v", "c", "n"],
            "math_inputtex": "v = \\frac{c}{n}",
            "qID": "27"
        }, {
            "fn": ["\\sigma_{y}"],
            "fp": ["y", "\\sigma"],
            "identifier": ["\\sigma_{y}", "\\sigma_{y}", "\\tau", "\\pi", "h_{-2}"],
            "math_inputtex": "\\sigma_y^2(\\tau) = \\frac{2\\pi^2\\tau}{3}h_{-2}",
            "qID": "28"
        }, {
            "fn": ["R_{\\text{s normal}}"],
            "fp": ["a", "R", "r", "s", "l", "m", "n", "o"],
            "identifier": ["R_{\\text{s normal}}", "\\omega", "\\mu_{0}", "\\sigma"],
            "math_inputtex": " R_{s\\ normal} = \\sqrt{ \\frac{\\omega \\mu_0} {2 \\sigma} }",
            "qID": "29"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\phi_{1}"],
            "math_inputtex": " \\phi_1 = -30^\\circ...+30^\\circ",
            "qID": "30"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["T_{c}"],
            "math_inputtex": "T_c",
            "qID": "31"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["T_{c}", "T_{c}"],
            "math_inputtex": "T_c",
            "qID": "32"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["T_{c}", "T_{c}"],
            "math_inputtex": "T_c",
            "qID": "33"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["P_{1}", "X", "P", "\\alpha_{1}"],
            "math_inputtex": "P_1(X)=P(X)/(X-\\alpha_1)",
            "qID": "34"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["k", "n"],
            "math_inputtex": "= \\frac{k}{n}.",
            "qID": "35"
        }, {
            "fn": ["p_{i}"],
            "fp": ["p"],
            "identifier": ["n", "i", "r", "p_{i}", "a_{i}"],
            "math_inputtex": "n = \\prod_{i=1}^r p_i^{a_i}",
            "qID": "36"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["H", "H", "H", "j", "\\omega", "\\mathcal{F}", "h", "t"],
            "math_inputtex": "H(j \\omega) = \\mathcal{F}\\{h(t)\\}",
            "qID": "37"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\pi"],
            "math_inputtex": "\\pi/4",
            "qID": "38"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["x", "y", "n", "k"],
            "math_inputtex": "(x+y)^n = \\sum_{k=0}^n {n \\choose k}x^{n-k}y^k = \\sum_{k=0}^n {n \\choose k}x^{k}y^{n-k}.\n",
            "qID": "39"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["A", "t", "k"],
            "math_inputtex": "\\ [A]_t = -kt + [A]_0",
            "qID": "40"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["q"],
            "math_inputtex": "q^{42}",
            "qID": "41"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\alpha", "d", "\\varepsilon"],
            "math_inputtex": "\\alpha(d) \\le \\left(\\sqrt{3/2} + \\varepsilon\\right)^d",
            "qID": "42"
        }, {
            "fn": ["f^{\\mu}", "\\delta _{\\nu}^{\\mu}", "u^{\\mu}", "u^{\\alpha}", "x^{\\nu}", "u^{\\beta}"],
            "fp": ["\\nu", "\\mu", "\\alpha", "f", "\\delta", "\\beta", "\\pi", "u", "x"],
            "identifier": ["f^{\\mu}", "G", "c", "A", "T_{\\alpha\\beta}", "B", "T", "\\eta_{\\alpha\\beta}", "\\eta_{\\alpha\\beta}", "\\delta _{\\nu}^{\\mu}", "\\delta _{\\nu}^{\\mu}", "u^{\\mu}", "u_{\\nu}", "u^{\\alpha}", "x^{\\nu}", "u^{\\beta}"],
            "math_inputtex": "   f^{\\mu} = - 8\\pi  { G \\over { 3 c^4   }   } \\left (  {A \\over 2} T_{\\alpha \\beta}  + {B \\over 2} T \\eta_{\\alpha \\beta} \\right ) \\left ( \\delta^{\\mu}_{\\nu} + u^{\\mu} u_{\\nu} \\right )  u^{\\alpha} x^{\\nu} u^{\\beta} ",
            "qID": "43"
        }, {
            "fn": [],
            "fp": ["D", "D_{g}"],
            "identifier": ["u_{g}", "t", "f_{0}", "v_{a}", "\\beta", "y", "v_{g}", "v_{g}"],
            "math_inputtex": " \\frac{D_g u_g}{Dt} - f_{0}v_a - \\beta y v_g = 0 ",
            "qID": "44"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["I_{c}"],
            "math_inputtex": "I_c",
            "qID": "45"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["A", "M", "M", "\\alpha"],
            "math_inputtex": "\\, A \\mapsto M\\alpha(A)M^{-1} ,",
            "qID": "46"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\Gamma_{\\infty}", "\\Gamma_{\\infty}"],
            "math_inputtex": "\\Gamma_{\\infty}",
            "qID": "47"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["Y", "\\beta", "T_{8}", "I", "X"],
            "math_inputtex": "Y = \\beta T_8 + I X",
            "qID": "48"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\mu", "A"],
            "math_inputtex": " \\mu (A)= \\begin{cases} 1 & \\mbox{ if } 0 \\in A \\\\ \n                               0 & \\mbox{ if } 0 \\notin A.\n\\end{cases}",
            "qID": "49"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\lambda_{in}"],
            "math_inputtex": "\\lambda_{in}",
            "qID": "50"
        }, {
            "fn": ["\\mathrm{rpm}_{\\text{motor}}"],
            "fp": ["p", "r", "m_{motor}"],
            "identifier": ["\\mathrm{rpm}_{\\text{motor}}"],
            "math_inputtex": "rpm_{motor}",
            "qID": "51"
        }, {
            "fn": [],
            "fp": ["d"],
            "identifier": ["u_{1}", "\\mathbf{x}", "z_{1}", "v_{1}", "\\dot{u}_{x}", "V_{x}", "g_{x}", "k_{1}", "u_{x}", "e_{1}", "f_{x}", "\\dot{\\mathbf{x}}", "t"],
            "math_inputtex": "\\underbrace{u_1(\\mathbf{x},z_1)=v_1+\\dot{u}_x}_{\\text{By definition of }v_1}=\\overbrace{-\\frac{\\partial V_x}{\\partial \\mathbf{x}}g_x(\\mathbf{x})-k_1(\\underbrace{z_1-u_x(\\mathbf{x})}_{e_1})}^{v_1} \\, + \\, \\overbrace{\\frac{\\partial u_x}{\\partial \\mathbf{x}}(\\underbrace{f_x(\\mathbf{x})+g_x(\\mathbf{x})z_1}_{\\dot{\\mathbf{x}} \\text{ (i.e., } \\frac{\\operatorname{d}\\mathbf{x}}{\\operatorname{d}t} \\text{)}})}^{\\dot{u}_x \\text{ (i.e., } \\frac{ \\operatorname{d}u_x }{\\operatorname{d}t} \\text{)}}",
            "qID": "52"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["E", "\\hat{\\sigma}", "n", "\\sigma"],
            "math_inputtex": "E \\left[ \\hat{\\sigma}^2\\right]= \\frac{n-1}{n} \\sigma^2",
            "qID": "53"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\mathsf{fv}"],
            "math_inputtex": "\\mathsf{fv}",
            "qID": "54"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["x", "y", "I"],
            "math_inputtex": "\\sum_x \\sum_y I(x,y) \\,\\!",
            "qID": "55"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\boldsymbol{F}_{r}"],
            "math_inputtex": "\\boldsymbol{F}_r",
            "qID": "56"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["B", "B", "A", "A"],
            "math_inputtex": "0\\rightarrow B\\rightarrow A\\oplus B\\rightarrow A\\rightarrow0.",
            "qID": "57"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["Y", "T", "\\alpha_{1}", "\\alpha_{2}", "X_{1}", "X_{2}"],
            "math_inputtex": "(\\nabla_Y T)(\\alpha_1, \\alpha_2, \\ldots, X_1, X_2, \\ldots) =Y(T(\\alpha_1,\\alpha_2,\\ldots,X_1,X_2,\\ldots))",
            "qID": "58"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["n", "\\mathbb{Z}", "d", "\\psi", "\\psi", "t", "C"],
            "math_inputtex": " \\sum_{n \\in \\mathbb{Z}^d} |\\psi(t,n)|^2 |n| \\leq C ",
            "qID": "59"
        }, {
            "fn": [],
            "fp": ["p"],
            "identifier": ["x", "x", "g", "v", "y", "y", "y"],
            "math_inputtex": " p = {\\frac{-x\\pm\\sqrt{x^2-4(\\frac{-gx^2}{2v^2})(\\frac{-gx^2}{2v^2}-y)}}{2(\\frac{-gx^2}{2v^2}) }}",
            "qID": "60"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["z", "H"],
            "math_inputtex": "\\left\\{ z \\in H: \\left| z \\right| > 1,\\, \\left| \\,\\mbox{Re}(z) \\,\\right| < \\frac{1}{2} \\right\\}",
            "qID": "61"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["T", "\\lambda", "I", "I"],
            "math_inputtex": "T-\\lambda I",
            "qID": "62"
        }, {
            "fn": [],
            "fp": ["sgn"],
            "identifier": ["y", "x", "\\rho", "\\sigma_{y}", "\\sigma_{x}", "\\mu_{x}", "\\mu_{y}"],
            "math_inputtex": "\n    y\\left( x \\right) = {\\mathop{\\rm sgn}} \\left( {{\\rho }} \\right)\\frac{{{\\sigma _y}}}{{{\\sigma _x}}}\\left( {x - {\\mu _x}} \\right) + {\\mu _y}.\n  ",
            "qID": "63"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["x", "b"],
            "math_inputtex": "x=b \\ ",
            "qID": "64"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["H", "K"],
            "math_inputtex": "H^1(K)=\\sqrt{2}",
            "qID": "65"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["P_{i}", "E_{K}", "S_{i-1}", "x", "C_{i}"],
            "math_inputtex": "P_i = \\mbox{head}(E_K (S_{i-1}), x) \\oplus C_i",
            "qID": "66"
        }, {
            "fn": [],
            "fp": ["f_{x}"],
            "identifier": ["f", "x"],
            "math_inputtex": "\\frac{ \\partial f}{ \\partial x} = f_x = \\partial_x f.",
            "qID": "67"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["P_{x}", "P", "a", "x", "x"],
            "math_inputtex": " P_x = P - \\{ a\\mid a \\geq x\\} ",
            "qID": "68"
        }, {
            "fn": ["Q_{1}", "Q_{2}"],
            "fp": ["a", "b", "d", "e", "h", "k", "n", "o", "Q", "r", "s", "t", "w"],
            "identifier": ["\\eta", "Q_{1}", "Q_{2}"],
            "math_inputtex": "\\eta = \\frac{ work\\ done } {heat\\ absorbed}  = \\frac{ Q1-Q2 }{ Q1}",
            "qID": "69"
        }, {
            "fn": [],
            "fp": ["d"],
            "identifier": ["f", "x", "y", "p", "v"],
            "math_inputtex": "df = {\\partial f \\over \\partial x}dx + {\\partial f \\over \\partial y}dy = pdx + vdy",
            "qID": "70"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["h_{r,s}"],
            "math_inputtex": "h_{r,s}",
            "qID": "71"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["K", "M", "k", "T", "a"],
            "math_inputtex": " K^M_*(k) := T^*(k^\\times)/(a\\otimes (1-a)) ",
            "qID": "72"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["C", "K_{X}", "K_{X}"],
            "math_inputtex": "\\{C : K_X \\cdot C = 0\\}",
            "qID": "73"
        }, {
            "fn": [],
            "fp": ["d"],
            "identifier": ["\\Theta", "n"],
            "math_inputtex": "\\Theta \\wedge\n(d\\Theta)^n \\neq 0",
            "qID": "74"
        }, {
            "fn": [],
            "fp": ["D"],
            "identifier": ["\\rho", "u_{i}", "t"],
            "math_inputtex": "D\\left(\\rho u_i\\right)/Dt\\approx0",
            "qID": "75"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["z_{t}", "\\lambda_{1}", "z_{t-1}", "\\varepsilon_{t}"],
            "math_inputtex": " z_{t} = \\lambda_{1}z_{t-1} + \\varepsilon_{t} ",
            "qID": "76"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["b_{3}"],
            "math_inputtex": "b_3",
            "qID": "77"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["b_{3}"],
            "math_inputtex": "b_3",
            "qID": "78"
        }, {
            "fn": [],
            "fp": ["\\Delta"],
            "identifier": ["W", "V_{1}", "V_{2}", "p", "V"],
            "math_inputtex": " \\Delta W = \\int_{V_1}^{V_2} p \\mathrm{d}V \\,\\!",
            "qID": "79"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["f", "Z", "n"],
            "math_inputtex": "\\dim f(Z) > n",
            "qID": "80"
        }, {
            "fn": [],
            "fp": ["d"],
            "identifier": ["t", "e"],
            "math_inputtex": "\\frac{d}{dt} \\log_e t = \\frac{1}{t}.",
            "qID": "81"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["h_{i}", "X"],
            "math_inputtex": "h_i : X \\to \\{-1,+1\\}",
            "qID": "82"
        }, {
            "fn": ["\\mathrm{seqs}"],
            "fp": ["q", "s", "e"],
            "identifier": ["\\mathrm{seqs}", "\\mathrm{seqs}"],
            "math_inputtex": "2\\le seqs \\le6",
            "qID": "83"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["F", "x", "y", "\\mathcal{R}", "b", "n"],
            "math_inputtex": " F = \\{ (x,y) : x \\in \\mathcal{R}^b,\\, y \\in \\mathcal{R}^n,\\; x=y \\}.",
            "qID": "84"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["X_{i}", "\\omega", "\\omega_{i}"],
            "math_inputtex": "X_i(\\omega)=\\omega_i",
            "qID": "85"
        }, {
            "fn": [],
            "fp": ["\\mathrm{d}"],
            "identifier": ["L", "L", "q_{i}", "t", "\\dot{q_{i}}", "\\dot{q_{i}}"],
            "math_inputtex": "\n{\\partial{L}\\over \\partial q_i} = {\\mathrm{d} \\over \\mathrm{d}t}{\\partial{L}\\over \\partial{\\dot{q_i}}}.\n",
            "qID": "86"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["x_{7}"],
            "math_inputtex": "x_7",
            "qID": "87"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\Pi_{n}"],
            "math_inputtex": "\\Pi_n",
            "qID": "88"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\sigma", "X", "T", "V"],
            "math_inputtex": "\\sigma^2 = X^TVX,",
            "qID": "89"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\mathbb{R}", "n", "f", "x", "B", "x_{0}", "r", "S"],
            "math_inputtex": "\\int_{\\mathbb{R}^n}f\\,dx = \\int_0^\\infty\\left\\{\\int_{\\partial B(x_0;r)} f\\,dS\\right\\}\\,dr.",
            "qID": "90"
        }, {
            "fn": [],
            "fp": ["B", "D"],
            "identifier": ["x", "p_{x}", "y", "p_{y}"],
            "math_inputtex": "\n\\{x, p_x\\}_{DB} = \\{y, p_y\\}_{DB} = \\frac{1}{2}\n",
            "qID": "91"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["G_{k,\\sigma}", "y", "k", "\\sigma"],
            "math_inputtex": "G_{k, \\sigma} (y)= 1-(1+ky/\\sigma)^{-1/k} ",
            "qID": "92"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["L", "H_{B}", "H_{B}", "C", "X"],
            "math_inputtex": "L(H_B) \\otimes C(X)",
            "qID": "93"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\pi_{i}", "N", "i"],
            "math_inputtex": "\\pi_i = 2^{-N} \\tbinom Ni",
            "qID": "94"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["p_{1}", "p_{n}"],
            "math_inputtex": "(\\sqrt{p_1}, \\cdots ,\\sqrt{p_n})",
            "qID": "95"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\boldsymbol{s}"],
            "math_inputtex": "\\boldsymbol{s}",
            "qID": "96"
        }, {
            "fn": [],
            "fp": ["\\Delta"],
            "identifier": ["J", "T", "W", "y"],
            "math_inputtex": "\\mathbf{J^TW\\  \\Delta y}",
            "qID": "97"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["\\bar{V}"],
            "math_inputtex": "\\bar V^*",
            "qID": "98"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["n", "\\delta"],
            "math_inputtex": "\\;\\frac{(n+\\delta-1)(n+\\delta-2)\\cdots n}{(\\delta-1)!}\\;",
            "qID": "99"
        }, {
            "fn": [],
            "fp": [],
            "identifier": ["y_{k}", "n"],
            "math_inputtex": "y_k[n]",
            "qID": "100"
        }]
};
