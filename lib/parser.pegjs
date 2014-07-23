/** PEGjs lexer/parser */
{
  var ast = require('./ast');

  var sq_close_ri = ast.RenderT.HTMLABLEC(ast.FontClass.UFH(), "]", "]");

  var lst2arr = function(l) {
    var arr = [];
    while (l !== null) {
      arr.push(l.head);
      l = l.tail;
    }
    return arr;
  };

  // track all known function names, so we can give good errors for unknown
  // functions.
  var all_functions = Object.create(null);
  all_functions['\\begin'] = all_functions['\\end'] = true;

  var arr2set = function(a) {
    // note that the fact that all keys in the set are prefixed with '\\'
    // helps avoid accidental name conflicts.  But use Object.create(null)
    // to be extra safe.
    var set = Object.create(null);
    a.forEach(function(v) { set[v] = all_functions[v] = true; });
    return set;
  };
  var obj2map = function(o) {
    // this just recreates the argument, but with `null` as prototype.
    var map = Object.create(null);
    Object.keys(o).forEach(function(f) {
      map[f] = o[f]; all_functions[f] = true;
    });
    return map;
  };

  // Sets of function names
  var box_functions = arr2set([
    "\\text", "\\mbox", "\\hbox", "\\vbox"
  ]);

  var latex_function_names = arr2set([
    "\\arccos", "\\arcsin", "\\arctan", "\\arg", "\\cosh", "\\cos",
    "\\cot", "\\coth", "\\csc", "\\deg", "\\det", "\\dim", "\\exp",
    "\\gcd", "\\hom", "\\inf", "\\ker", "\\lg", "\\lim", "\\liminf",
    "\\limsup", "\\ln", "\\log", "\\max", "\\min", "\\Pr", "\\sec",
    "\\sin", "\\sinh", "\\sup", "\\tan", "\\tanh"
  ]);

  var mediawiki_function_names = arr2set([
    "\\arccot", "\\arcsec", "\\arccsc", "\\sgn", "\\sen"
  ]);

  var other_literals1 = arr2set([
    "\\AA",
    "\\aleph",
    "\\alpha",
    "\\amalg",
    "\\And",
    "\\angle",
    "\\approx",
    "\\approxeq",
    "\\ast",
    "\\asymp",
    "\\backepsilon",
    "\\backprime",
    "\\backsim",
    "\\backsimeq",
    "\\barwedge",
    "\\Bbbk",
    "\\because",
    "\\beta",
    "\\beth",
    "\\between",
    "\\bigcap",
    "\\bigcirc",
    "\\bigcup",
    "\\bigodot",
    "\\bigoplus",
    "\\bigotimes",
    "\\bigsqcup",
    "\\bigstar",
    "\\bigtriangledown",
    "\\bigtriangleup",
    "\\biguplus",
    "\\bigvee",
    "\\bigwedge",
    "\\blacklozenge",
    "\\blacksquare",
    "\\blacktriangle",
    "\\blacktriangledown",
    "\\blacktriangleleft",
    "\\blacktriangleright",
    "\\bot",
    "\\bowtie",
    "\\Box",
    "\\boxdot",
    "\\boxminus",
    "\\boxplus",
    "\\boxtimes",
    "\\bullet",
    "\\bumpeq",
    "\\Bumpeq",
    "\\cap",
    "\\Cap",
    "\\cdot",
    "\\cdots",
    "\\centerdot",
    "\\checkmark",
    "\\chi",
    "\\circ",
    "\\circeq",
    "\\circlearrowleft",
    "\\circlearrowright",
    "\\circledast",
    "\\circledcirc",
    "\\circleddash",
    "\\circledS",
    "\\clubsuit",
    "\\colon",
    "\\color",
    "\\complement",
    "\\cong",
    "\\coprod",
    "\\cup",
    "\\Cup",
    "\\curlyeqprec",
    "\\curlyeqsucc",
    "\\curlyvee",
    "\\curlywedge",
    "\\curvearrowleft",
    "\\curvearrowright",
    "\\dagger",
    "\\daleth",
    "\\dashv",
    "\\ddagger",
    "\\ddots",
    "\\definecolor",
    "\\delta",
    "\\Delta",
    "\\diagdown",
    "\\diagup",
    "\\diamond",
    "\\Diamond",
    "\\diamondsuit",
    "\\digamma",
    "\\displaystyle",
    "\\div",
    "\\divideontimes",
    "\\doteq",
    "\\doteqdot",
    "\\dotplus",
    "\\dots",
    "\\dotsb",
    "\\dotsc",
    "\\dotsi",
    "\\dotsm",
    "\\dotso",
    "\\doublebarwedge",
    "\\downdownarrows",
    "\\downharpoonleft",
    "\\downharpoonright",
    "\\ell",
    "\\emptyset",
    "\\epsilon",
    "\\eqcirc",
    "\\eqsim",
    "\\eqslantgtr",
    "\\eqslantless",
    "\\equiv",
    "\\eta",
    "\\eth",
    "\\exists",
    "\\fallingdotseq",
    "\\Finv",
    "\\flat",
    "\\forall",
    "\\frown",
    "\\Game",
    "\\gamma",
    "\\Gamma",
    "\\geq",
    "\\geqq",
    "\\geqslant",
    "\\gets",
    "\\gg",
    "\\ggg",
    "\\gimel",
    "\\gnapprox",
    "\\gneq",
    "\\gneqq",
    "\\gnsim",
    "\\gtrapprox",
    "\\gtrdot",
    "\\gtreqless",
    "\\gtreqqless",
    "\\gtrless",
    "\\gtrsim",
    "\\gvertneqq",
    "\\hbar",
    "\\heartsuit",
    "\\hline",
    "\\hookleftarrow",
    "\\hookrightarrow",
    "\\hslash",
    "\\iff",
    "\\iiiint",
    "\\iiint",
    "\\iint",
    "\\Im",
    "\\imath",
    "\\implies",
    "\\in",
    "\\infty",
    "\\injlim",
    "\\int",
    "\\intercal",
    "\\iota",
    "\\jmath",
    "\\kappa",
    "\\lambda",
    "\\Lambda",
    "\\land",
    "\\ldots",
    "\\leftarrow",
    "\\Leftarrow",
    "\\leftarrowtail",
    "\\leftharpoondown",
    "\\leftharpoonup",
    "\\leftleftarrows",
    "\\leftrightarrow",
    "\\Leftrightarrow",
    "\\leftrightarrows",
    "\\leftrightharpoons",
    "\\leftrightsquigarrow",
    "\\leftthreetimes",
    "\\leq",
    "\\leqq",
    "\\leqslant",
    "\\lessapprox",
    "\\lessdot",
    "\\lesseqgtr",
    "\\lesseqqgtr",
    "\\lessgtr",
    "\\lesssim",
    "\\limits",
    "\\ll",
    "\\Lleftarrow",
    "\\lll",
    "\\lnapprox",
    "\\lneq",
    "\\lneqq",
    "\\lnot",
    "\\lnsim",
    "\\longleftarrow",
    "\\Longleftarrow",
    "\\longleftrightarrow",
    "\\Longleftrightarrow",
    "\\longmapsto",
    "\\longrightarrow",
    "\\Longrightarrow",
    "\\looparrowleft",
    "\\looparrowright",
    "\\lor",
    "\\lozenge",
    "\\Lsh",
    "\\ltimes",
    "\\lVert",
    "\\lvertneqq",
    "\\mapsto",
    "\\measuredangle",
    "\\mho",
    "\\mid",
    "\\mod",
    "\\models",
    "\\mp",
    "\\mu",
    "\\multimap",
    "\\nabla",
    "\\natural",
    "\\ncong",
    "\\nearrow",
    "\\neg",
    "\\neq",
    "\\nexists",
    "\\ngeq",
    "\\ngeqq",
    "\\ngeqslant",
    "\\ngtr",
    "\\ni",
    "\\nleftarrow",
    "\\nLeftarrow",
    "\\nleftrightarrow",
    "\\nLeftrightarrow",
    "\\nleq",
    "\\nleqq",
    "\\nleqslant",
    "\\nless",
    "\\nmid",
    "\\nolimits",
    "\\not",
    "\\notin",
    "\\nparallel",
    "\\nprec",
    "\\npreceq",
    "\\nrightarrow",
    "\\nRightarrow",
    "\\nshortmid",
    "\\nshortparallel",
    "\\nsim",
    "\\nsubseteq",
    "\\nsubseteqq",
    "\\nsucc",
    "\\nsucceq",
    "\\nsupseteq",
    "\\nsupseteqq",
    "\\ntriangleleft",
    "\\ntrianglelefteq",
    "\\ntriangleright",
    "\\ntrianglerighteq",
    "\\nu",
    "\\nvdash",
    "\\nVdash",
    "\\nvDash",
    "\\nVDash",
    "\\nwarrow",
    "\\odot",
    "\\oint",
    "\\omega",
    "\\Omega",
    "\\ominus",
    "\\oplus",
    "\\oslash",
    "\\otimes",
    "\\overbrace",
    "\\overleftarrow",
    "\\overleftrightarrow",
    "\\overline",
    "\\overrightarrow",
    "\\P",
    "\\pagecolor",
    "\\parallel",
    "\\partial",
    "\\perp",
    "\\phi",
    "\\Phi",
    "\\pi",
    "\\Pi",
    "\\pitchfork",
    "\\pm",
    "\\prec",
    "\\precapprox",
    "\\preccurlyeq",
    "\\preceq",
    "\\precnapprox",
    "\\precneqq",
    "\\precnsim",
    "\\precsim",
    "\\prime",
    "\\prod",
    "\\projlim",
    "\\propto",
    "\\psi",
    "\\Psi",
    "\\qquad",
    "\\quad",
    "\\Re",
    "\\rho",
    "\\rightarrow",
    "\\Rightarrow",
    "\\rightarrowtail",
    "\\rightharpoondown",
    "\\rightharpoonup",
    "\\rightleftarrows",
    "\\rightrightarrows",
    "\\rightsquigarrow",
    "\\rightthreetimes",
    "\\risingdotseq",
    "\\Rrightarrow",
    "\\Rsh",
    "\\rtimes",
    "\\rVert",
    "\\S",
    "\\scriptscriptstyle",
    "\\scriptstyle",
    "\\searrow",
    "\\setminus",
    "\\sharp",
    "\\shortmid",
    "\\shortparallel",
    "\\sigma",
    "\\Sigma",
    "\\sim",
    "\\simeq",
    "\\smallfrown",
    "\\smallsetminus",
    "\\smallsmile",
    "\\smile",
    "\\spadesuit",
    "\\sphericalangle",
    "\\sqcap",
    "\\sqcup",
    "\\sqsubset",
    "\\sqsubseteq",
    "\\sqsupset",
    "\\sqsupseteq",
    "\\square",
    "\\star",
    "\\subset",
    "\\Subset",
    "\\subseteq",
    "\\subseteqq",
    "\\subsetneq",
    "\\subsetneqq",
    "\\succ",
    "\\succapprox",
    "\\succcurlyeq",
    "\\succeq",
    "\\succnapprox",
    "\\succneqq",
    "\\succnsim",
    "\\succsim",
    "\\sum",
    "\\supset",
    "\\Supset",
    "\\supseteq",
    "\\supseteqq",
    "\\supsetneq",
    "\\supsetneqq",
    "\\surd",
    "\\swarrow",
    "\\tau",
    "\\textstyle",
    "\\textvisiblespace",
    "\\therefore",
    "\\theta",
    "\\Theta",
    "\\thickapprox",
    "\\thicksim",
    "\\times",
    "\\to",
    "\\top",
    "\\triangle",
    "\\triangledown",
    "\\triangleleft",
    "\\trianglelefteq",
    "\\triangleq",
    "\\triangleright",
    "\\trianglerighteq",
    "\\underbrace",
    "\\underline",
    "\\upharpoonleft",
    "\\upharpoonright",
    "\\uplus",
    "\\upsilon",
    "\\Upsilon",
    "\\upuparrows",
    "\\varepsilon",
    "\\varinjlim",
    "\\varkappa",
    "\\varliminf",
    "\\varlimsup",
    "\\varnothing",
    "\\varphi",
    "\\varpi",
    "\\varprojlim",
    "\\varpropto",
    "\\varrho",
    "\\varsigma",
    "\\varsubsetneq",
    "\\varsubsetneqq",
    "\\varsupsetneq",
    "\\varsupsetneqq",
    "\\vartheta",
    "\\vartriangle",
    "\\vartriangleleft",
    "\\vartriangleright",
    "\\vdash",
    "\\Vdash",
    "\\vDash",
    "\\vdots",
    "\\vee",
    "\\veebar",
    "\\vline",
    "\\Vvdash",
    "\\wedge",
    "\\widehat",
    "\\widetilde",
    "\\wp",
    "\\wr",
    "\\xi",
    "\\Xi",
    "\\zeta"
  ]);

  var other_literals2 = arr2set([
    "\\Coppa",
    "\\coppa",
    "\\Digamma",
    "\\euro",
    "\\geneuro",
    "\\geneuronarrow",
    "\\geneurowide",
    "\\Koppa",
    "\\koppa",
    "\\officialeuro",
    "\\Sampi",
    "\\sampi",
    "\\Stigma",
    "\\stigma",
    "\\varstigma"
  ]);

  var other_literals3 = obj2map({
    "\\C": "\\mathbb {C}",
    "\\H": "\\mathbb {H}",
    "\\N": "\\mathbb {N}",
    "\\Q": "\\mathbb {Q}",
    "\\R": "\\mathbb {R}",
    "\\Z": "\\mathbb {Z}",
    "\\alef": "\\aleph",
    "\\alefsym": "\\aleph",
    "\\Alpha": "\\mathrm {A}",
    "\\and": "\\land",
    "\\ang": "\\angle",
    "\\Beta": "\\mathrm {B}",
    "\\bull": "\\bullet",
    "\\Chi": "\\mathrm {X}",
    "\\clubs": "\\clubsuit",
    "\\cnums": "\\mathbb {C}",
    "\\Complex": "\\mathbb {C}",
    "\\Dagger": "\\ddagger",
    "\\diamonds": "\\diamondsuit",
    "\\Doteq": "\\doteqdot",
    "\\doublecap": "\\Cap",
    "\\doublecup": "\\Cup",
    "\\empty": "\\emptyset",
    "\\Epsilon": "\\mathrm {E}",
    "\\Eta": "\\mathrm {H}",
    "\\exist": "\\exists",
    "\\ge": "\\geq",
    "\\gggtr": "\\ggg",
    "\\hAar": "\\Leftrightarrow",
    "\\harr": "\\leftrightarrow",
    "\\Harr": "\\Leftrightarrow",
    "\\hearts": "\\heartsuit",
    "\\image": "\\Im",
    "\\infin": "\\infty",
    "\\Iota": "\\mathrm {I}",
    "\\isin": "\\in",
    "\\Kappa": "\\mathrm {K}",
    "\\larr": "\\leftarrow",
    "\\Larr": "\\Leftarrow",
    "\\lArr": "\\Leftarrow",
    "\\le": "\\leq",
    "\\lrarr": "\\leftrightarrow",
    "\\Lrarr": "\\Leftrightarrow",
    "\\lrArr": "\\Leftrightarrow",
    "\\Mu": "\\mathrm {M}",
    "\\natnums": "\\mathbb {N}",
    "\\ne": "\\neq",
    "\\Nu": "\\mathrm {N}",
    "\\O": "\\emptyset",
    "\\omicron": "\\mathrm {o}",
    "\\Omicron": "\\mathrm {O}",
    "\\or": "\\lor",
    "\\part": "\\partial",
    "\\plusmn": "\\pm",
    "\\rarr": "\\rightarrow",
    "\\Rarr": "\\Rightarrow",
    "\\rArr": "\\Rightarrow",
    "\\real": "\\Re",
    "\\reals": "\\mathbb {R}",
    "\\Reals": "\\mathbb {R}",
    "\\restriction": "\\upharpoonright",
    "\\Rho": "\\mathrm {P}",
    "\\sdot": "\\cdot",
    "\\sect": "\\S",
    "\\spades": "\\spadesuit",
    "\\sub": "\\subset",
    "\\sube": "\\subseteq",
    "\\supe": "\\supseteq",
    "\\Tau": "\\mathrm {T}",
    "\\thetasym": "\\vartheta",
    "\\varcoppa": "\\mbox{\\coppa}", // XXX seems to be a bug in ocaml texvc
    "\\weierp": "\\wp",
    "\\Zeta": "\\mathrm {Z}"
  });

  var big_literals = arr2set([
    "\\big",
    "\\Big",
    "\\bigg",
    "\\Bigg",
    "\\biggl",
    "\\Biggl",
    "\\biggr",
    "\\Biggr",
    "\\bigl",
    "\\Bigl",
    "\\bigr",
    "\\Bigr"
  ]);

  var other_delimiters1 = arr2set([
    "\\backslash",
    "\\downarrow",
    "\\Downarrow",
    "\\langle",
    "\\lbrace",
    "\\lceil",
    "\\lfloor",
    "\\llcorner",
    "\\lrcorner",
    "\\rangle",
    "\\rbrace",
    "\\rceil",
    "\\rfloor",
    "\\rightleftharpoons",
    "\\twoheadleftarrow",
    "\\twoheadrightarrow",
    "\\ulcorner",
    "\\uparrow",
    "\\Uparrow",
    "\\updownarrow",
    "\\Updownarrow",
    "\\urcorner",
    "\\Vert",
    "\\vert",
    "\\lbrack",
    "\\rbrack"
  ]);

  var other_delimiters2 = obj2map({
    "\\darr": "\\downarrow",
    "\\dArr": "\\Downarrow",
    "\\Darr": "\\Downarrow",
    "\\lang": "\\langle",
    "\\rang": "\\rangle",
    "\\uarr": "\\uparrow",
    "\\uArr": "\\Uparrow",
    "\\Uarr": "\\Uparrow"
  });

  var fun_ar1 = arr2set([
    "\\acute",
    "\\bar",
    "\\bcancel",
    "\\bmod",
    "\\boldsymbol",
    "\\breve",
    "\\cancel",
    "\\check",
    "\\ddot",
    "\\dot",
    "\\emph",
    "\\grave",
    "\\hat",
    //"\\mathbb", // moved to fun_ar1nb
    //"\\mathbf", // moved to fun_ar1nb
    "\\mathbin",
    "\\mathcal",
    "\\mathclose",
    "\\mathfrak",
    "\\mathit",
    "\\mathop",
    "\\mathopen",
    "\\mathord",
    "\\mathpunct",
    "\\mathrel",
    //"\\mathrm", // moved to fun_ar1nb
    "\\mathsf",
    "\\mathtt",
    //"\\operatorname", // already exists in fun_ar1nb
    "\\pmod",
    "\\sqrt",
    "\\textbf",
    "\\textit",
    "\\textrm",
    "\\textsf",
    "\\texttt",
    "\\tilde",
    "\\vec",
    "\\xcancel",
    "\\xleftarrow",
    "\\xrightarrow"
  ]);

  var other_fun_ar1 = obj2map({
    "\\Bbb": "\\mathbb",
    "\\bold": "\\mathbf"
  });

  var fun_ar1nb = arr2set([
    "\\operatorname",
    "\\mathbb",
    "\\mathbf",
    "\\mathrm"
  ]);

  var fun_ar1opt = arr2set([
    "\\sqrt", "\\xleftarrow", "\\xrightarrow"
  ]);

  var fun_ar2 = arr2set([
    "\\binom",
    "\\cancelto",
    "\\cfrac",
    "\\dbinom",
    "\\dfrac",
    "\\frac",
    "\\overset",
    "\\stackrel",
    "\\tbinom",
    "\\tfrac",
    "\\underset"
  ]);

  var fun_ar2nb = arr2set([
    "\\sideset"
  ]);

  var fun_infix = arr2set([
    "\\atop",
    "\\choose",
    "\\over"
  ]);

  var declh_function = arr2set([
    "\\rm",
    "\\it",
    "\\cal",
    "\\bf"
  ]);

  var left_function = arr2set([ "\\left" ]);
  var right_function = arr2set([ "\\right" ]);
}
// first rule is the start production.
start
  = _ t:tex_expr { console.assert(t instanceof ast.LList); return t.toArray(); }

// the PEG grammar doesn't automatically ignore whitespace when tokenizing.
// so we add `_` productions in appropriate places to eat whitespace.
// Lexer rules (which are capitalized) are expected to always eat
// *trailing* whitespace.  Leading whitespace is taken care of in the `start`
// rule above.
_
  = [ \t\n\r]*

/////////////////////////////////////////////////////////////
// PARSER
//----------------------------------------------------------

tex_expr
  = e:expr EOF
    { return e; }
  / e1:ne_expr name:FUN_INFIX e2:ne_expr EOF
    { return ast.LList(ast.Tex.INFIX(name, e1.toArray(), e2.toArray())); }
  / e1:ne_expr f:FUN_INFIXh e2:ne_expr EOF
    { return ast.LList(ast.Tex.INFIXh(f[0], f[1], e1.toArray(), e2.toArray()));}

expr
  = ne_expr
  / /* */
  { return ast.LList.EMPTY; }

ne_expr
  = h:lit_aq t:expr
    { return ast.LList(h, t); }
  / h:litsq_aq t:expr
    { return ast.LList(h, t); }
  / d:DECLh e:expr
    { return ast.LList(ast.Tex.DECLh(d[0], d[1], e.toArray())); }
litsq_aq
  = litsq_fq
  / litsq_dq
  / litsq_uq
  / litsq_zq
litsq_fq
  = l1:litsq_dq SUP l2:lit
    { return ast.Tex.FQ(l1[0], l1[1], l2); }
  / l1:litsq_uq SUB l2:lit
    { return ast.Tex.FQ(l1[0], l2, l1[1]); }
litsq_uq
  = base:litsq_zq SUP upi:lit
    { return ast.Tex.UQ(base, upi); }
litsq_dq
  = base:litsq_zq SUB downi:lit
    { return ast.Tex.DQ(base, downi); }
litsq_zq
  = SQ_CLOSE
    { return ast.Tex.LITERAL(sq_close_ri); }
expr_nosqc
  = l:lit_aq e:expr_nosqc
    { return ast.LList(l, e); }
  / /* */
    { return ast.LList.EMPTY; }
lit_aq
  = lit_fq
  / lit_dq
  / lit_uq
  / lit_dqn
  / lit_uqn
  / lit

lit_fq
  = l1:lit_dq SUP l2:lit
    { return ast.Tex.FQ(l1[0], l1[1], l2); }
  / l1:lit_uq SUB l2:lit
    { return ast.Tex.FQ(l1[0], l2, l1[1]); }
  / l1:lit_dqn SUP l2:lit
    { return ast.Tex.FQN(l1[0], l2); }

lit_uq
  = base:lit SUP upi:lit
    { return ast.Tex.UQ(base, upi); }
lit_dq
  = base:lit SUB downi:lit
    { return ast.Tex.DQ(base, downi); }
lit_uqn
  = SUP l:lit
    { return ast.Tex.UQN(l); }
lit_dqn
  = SUB l:lit
    { return ast.Tex.DQN(l); }


left
  = LEFT d:DELIMITER
    { return d; }
  / LEFT SQ_CLOSE
    { return sq_close_ri; }
right
  = RIGHT d:DELIMITER
    { return d; }
  / RIGHT SQ_CLOSE
    { return sq_close_ri; }
lit
  = r:LITERAL                   { return ast.Tex.LITERAL(r); }
  / r:DELIMITER                 { return ast.Tex.LITERAL(r); }
  / b:BIG r:DELIMITER           { return ast.Tex.BIG(b, r); }
  / b:BIG SQ_CLOSE              { return ast.Tex.BIG(b, sq_close_ri); }
  / l:left e:expr r:right       { return ast.Tex.LR(l, r, e.toArray()); }
  / name:FUN_AR1opt e:expr_nosqc SQ_CLOSE l:lit /* must be before FUN_AR1 */
    { return ast.Tex.FUN2sq(name, ast.Tex.CURLY(e.toArray()), l); }
  / name:FUN_AR1 l:lit          { return ast.Tex.FUN1(name, l); }
  / name:FUN_AR1nb l:lit        { return ast.Tex.FUN1nb(name, l); }
  / f:FUN_AR1hl l:lit           { return ast.Tex.FUN1hl(f[0], f[1], l); }
  / f:FUN_AR1hf l:lit           { return ast.Tex.FUN1hf(f[0], f[1], l); }
  / name:FUN_AR2 l1:lit l2:lit  { return ast.Tex.FUN2(name, l1, l2); }
  / name:FUN_AR2nb l1:lit l2:lit { return ast.Tex.FUN2nb(name, l1, l2); }
  / f:FUN_AR2h l1:lit l2:lit    { return ast.Tex.FUN2h(f[0], f[1], l1, l2); }
  / BOX
  / CURLY_OPEN e:expr CURLY_CLOSE
    { return ast.Tex.CURLY(e.toArray()); }
  / CURLY_OPEN e1:ne_expr name:FUN_INFIX e2:ne_expr CURLY_CLOSE
    { return ast.Tex.INFIX(name, e1.toArray(), e2.toArray()); }
  / CURLY_OPEN e1:ne_expr f:FUN_INFIXh e2:ne_expr CURLY_CLOSE
    { return ast.Tex.INFIXh(f[0], f[1], e1.toArray(), e2.toArray()); }
  / BEGIN_MATRIX   m:matrix END_MATRIX
    { return ast.Tex.MATRIX("matrix", lst2arr(m)); }
  / BEGIN_PMATRIX  m:matrix END_PMATRIX
    { return ast.Tex.MATRIX("pmatrix", lst2arr(m)); }
  / BEGIN_BMATRIX  m:matrix END_BMATRIX
    { return ast.Tex.MATRIX("bmatrix", lst2arr(m)); }
  / BEGIN_BBMATRIX m:matrix END_BBMATRIX
    { return ast.Tex.MATRIX("Bmatrix", lst2arr(m)); }
  / BEGIN_VMATRIX  m:matrix END_VMATRIX
    { return ast.Tex.MATRIX("vmatrix", lst2arr(m)); }
  / BEGIN_VVMATRIX m:matrix END_VVMATRIX
    { return ast.Tex.MATRIX("Vmatrix", lst2arr(m)); }
  / BEGIN_ARRAY    m:matrix END_ARRAY
    { return ast.Tex.MATRIX("array", lst2arr(m)); }
  / BEGIN_ALIGN    m:matrix END_ALIGN
    { return ast.Tex.MATRIX("aligned", lst2arr(m)); }
  / BEGIN_ALIGNED  m:matrix END_ALIGNED // parse what we emit
    { return ast.Tex.MATRIX("aligned", lst2arr(m)); }
  / BEGIN_ALIGNAT  m:matrix END_ALIGNAT
    { return ast.Tex.MATRIX("alignedat", lst2arr(m)); }
  / BEGIN_ALIGNEDAT m:matrix END_ALIGNEDAT // parse what we emit
    { return ast.Tex.MATRIX("alignedat", lst2arr(m)); }
  / BEGIN_SMALLMATRIX m:matrix END_SMALLMATRIX
    { return ast.Tex.MATRIX("smallmatrix", lst2arr(m)); }
  / BEGIN_CASES    m:matrix END_CASES
    { return ast.Tex.MATRIX("cases", lst2arr(m)); }
  / "\\begin{" alpha+ "}" /* better error messages for unknown environments */
    { throw new SyntaxError("Illegal TeX function", [], text(), offset(), line(), column()); }
  / f:generic_func &{ return !all_functions[f]; }
    { throw new SyntaxError("Illegal TeX function", [], f, offset(), line(), column()); }

matrix
  = l:line tail:( NEXT_ROW m:matrix { return m; } )?
    { return { head: lst2arr(l), tail: tail }; }
line
  = e:expr tail:( NEXT_CELL l:line { return l; } )?
    { return { head: e.toArray(), tail: tail }; }

/////////////////////////////////////////////////////////////
// LEXER
//----------------------------------------------------------
//space =           [ \t\n\r]
alpha =           [a-zA-Z]
literal_id =      [a-zA-Z]
literal_mn =      [0-9]
literal_uf_lt =   [,:;?!\']
delimiter_uf_lt = [().]
literal_uf_op =   [-+*=]
delimiter_uf_op = [\/|]
boxchars =  [-0-9a-zA-Z+*,=():\/;?.!\'` \x80-\xFF]
//aboxchars = [-0-9a-zA-Z+*,=():\/;?.!\'` ]

BOX
 = b:generic_func &{ return box_functions[b]; } _ "{" cs:boxchars+ "}" _
   { return ast.Tex.BOX(b, cs.join('')); }

// returns a RenderT
LITERAL
 = c:( literal_id / literal_mn / literal_uf_lt / "-" / literal_uf_op ) _
   { return ast.RenderT.TEX_ONLY(c); }
 / f:generic_func &{ return latex_function_names[f]; } _
   c:( "(" / "[" / "\\{" / { return " ";}) _
   { return ast.RenderT.TEX_ONLY(f + c); }
 / f:generic_func &{ return mediawiki_function_names[f]; } _
   c:( "(" / "[" / "\\{" / { return " ";}) _
   { return ast.RenderT.TEX_ONLY("\\operatorname {" + f.slice(1) + "}" + c); }
 / f:generic_func &{ return other_literals1[f]; } _ // from Texutil.find(...)
   { return ast.RenderT.TEX_ONLY(f + " "); }
 / f:generic_func &{ return other_literals2[f]; } _ // from Texutil.find(...)
   { return ast.RenderT.TEX_ONLY("\\mbox{" + f + "} "); }
 / mbox:generic_func &{ return mbox === "\\mbox"; } _
   "{" f:generic_func &{ return other_literals2[f]; } _ "}" _
   /* make sure we can parse what we emit */
   { return ast.RenderT.TEX_ONLY("\\mbox{" + f + "} "); }
 / f:generic_func &{ return other_literals3[f]; } _ // from Texutil.find(...)
   { return ast.RenderT.TEX_ONLY(other_literals3[f] + " "); }
 / "\\" c:[, ;!_#%$&] _
   { return ast.RenderT.TEX_ONLY("\\" + c); }
 / c:[><~] _
   { return ast.RenderT.TEX_ONLY(c); }
 / c:[%$] _
   { return ast.RenderT.TEX_ONLY("\\" + c); /* escape dangerous chars */}

// returns a RenderT
DELIMITER
 = c:( delimiter_uf_lt / delimiter_uf_op / "[" ) _
   { return ast.RenderT.TEX_ONLY(c); }
 / "\\" c:[{}|] _
   { return ast.RenderT.TEX_ONLY("\\" + c); }
 / f:generic_func &{ return other_delimiters1[f]; } _ // from Texutil.find(...)
   { return ast.RenderT.TEX_ONLY(f + " "); }
 / f:generic_func &{ return other_delimiters2[f]; } _ // from Texutil.find(...)
   { return ast.RenderT.TEX_ONLY(other_delimiters2[f] + " "); }

FUN_AR1nb
 = f:generic_func &{ return fun_ar1nb[f]; } _ { return f; }

FUN_AR1opt
 = f:generic_func &{ return fun_ar1opt[f]; } _ "[" _ { return f; }

NEXT_CELL
 = "&" _

NEXT_ROW
 = "\\\\" _

BEGIN_MATRIX
 = "\\begin{matrix}" _
END_MATRIX
 = "\\end{matrix}" _
BEGIN_PMATRIX
 = "\\begin{pmatrix}" _
END_PMATRIX
 = "\\end{pmatrix}" _
BEGIN_BMATRIX
 = "\\begin{bmatrix}" _
END_BMATRIX
 = "\\end{bmatrix}" _
BEGIN_BBMATRIX
 = "\\begin{Bmatrix}" _
END_BBMATRIX
 = "\\end{Bmatrix}" _
BEGIN_VMATRIX
 = "\\begin{vmatrix}" _
END_VMATRIX
 = "\\end{vmatrix}" _
BEGIN_VVMATRIX
 = "\\begin{Vmatrix}" _
END_VVMATRIX
 = "\\end{Vmatrix}" _
BEGIN_ARRAY
 = "\\begin{array}" _
END_ARRAY
 = "\\end{array}" _
BEGIN_ALIGN
 = "\\begin{align}" _
END_ALIGN
 = "\\end{align}" _
BEGIN_ALIGNED
 = "\\begin{aligned}" _
END_ALIGNED
 = "\\end{aligned}" _
BEGIN_ALIGNAT
 = "\\begin{alignat}" _
END_ALIGNAT
 = "\\end{alignat}" _
BEGIN_ALIGNEDAT
 = "\\begin{alignedat}" _
END_ALIGNEDAT
 = "\\end{alignedat}" _
BEGIN_SMALLMATRIX
 = "\\begin{smallmatrix}" _
END_SMALLMATRIX
 = "\\end{smallmatrix}" _
BEGIN_CASES
 = "\\begin{cases}" _
END_CASES
 = "\\end{cases}" _

SQ_CLOSE
 =  "]" _
CURLY_OPEN
 = "{" _
CURLY_CLOSE
 = "}" _
SUP
 = "^" _
SUB
 = "_" _

// This is from Texutil.find in texvc
generic_func
 = "\\" alpha+ { return text(); }

BIG
 = f:generic_func &{ return big_literals[f]; } _
   { return f; }

FUN_AR1
 = f:generic_func &{ return fun_ar1[f]; } _
   { return f; }
 / f:generic_func &{ return other_fun_ar1[f]; } _
   { return other_fun_ar1[f]; }

FUN_AR2
 = f:generic_func &{ return fun_ar2[f]; } _
   { return f; }

FUN_INFIX
 = f:generic_func &{ return fun_infix[f]; } _
   { return f; }

DECLh
 = f:generic_func &{ return declh_function[f]; } _
   { return ast.Tex.DECLh(f, ast.FontForce.RM(), []); /*see bug 54818*/ }

FUN_AR2nb
 = f:generic_func &{ return fun_ar2nb[f]; } _
   { return f; }

LEFT
 = f:generic_func &{ return left_function[f]; } _

RIGHT
 = f:generic_func &{ return right_function[f]; } _

// Missing lexer tokens!
FUN_INFIXh = impossible
FUN_AR1hl = impossible
FUN_AR1hf = impossible
FUN_AR2h = impossible
impossible = & { return false; }

// End of file
EOF = & { return peg$currPos === input.length; }
