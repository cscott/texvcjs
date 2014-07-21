/** PEGjs lexer/parser */
{
  var ast = require('./ast');

  var sq_close_ri = ast.RenderT.HTMLABLEC(ast.FontClass.UFH(), "]", "]");
}
// first rule is the start production.
start
  = _ tex_expr

// the PEG grammar doesn't automatically ignore whitespace when tokenizing.
// so we add `_` productions in appropriate places to eat whitespace.
// generally lexer rules (which are capitalized) are expected to always eat
// *trailing* whitespace.  Leading whitespace is taken care of in the star
// rule above.
_
  = [ \t\n\r]*

/////////////////////////////////////////////////////////////
// PARSER
//----------------------------------------------------------

tex_expr
  = expr EOF
  / ne_expr FUN_INFIX ne_expr EOF
  / ne_expr FUN_INFIXh ne_expr EOF

expr
  = ne_expr
  / /* */

ne_expr
  = lit_aq expr
  / litsq_aq expr
  / DECLh expr
litsq_aq
  = litsq_zq
  / litsq_dq
  / litsq_uq
  / litsq_fq
litsq_fq
  = litsq_dq SUP lit
  / litsq_uq SUB lit
litsq_uq
  = litsq_zq SUP lit
litsq_dq
  = litsq_zq SUB lit
litsq_zq
  = SQ_CLOSE
    { return ast.Tex.LITERAL(sq_close_ri); }
expr_nosqc
  = lit_aq expr_nosqc
  / /* */
lit_aq
  = lit
  / lit_dq
  / lit_uq
  / lit_dqn
  / lit_uqn
  / lit_fq

lit_fq
  = lit_dq SUP lit
  / lit_uq SUB lit
  / lit_dqn SUP lit

lit_uq
  = lit SUP lit
lit_dq
  = lit SUB lit
lit_uqn
  = SUP lit
lit_dqn
  = SUB lit


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
  / left expr right             //{ TEX_LR ($1,$3,$2) }
  / FUN_AR1 lit                 //{ TEX_FUN1($1,$2) }
  / FUN_AR1nb lit               //{ TEX_FUN1nb($1,$2) }
  / FUN_AR1hl lit               //{ let t,h=$1 in TEX_FUN1hl(t,h,$2) }
  / FUN_AR1hf lit               //{ let t,h=$1 in TEX_FUN1hf(t,h,$2) }
  / FUN_AR1opt expr_nosqc SQ_CLOSE lit //{ TEX_FUN2sq($1,TEX_CURLY $2,$4) }
  / FUN_AR2 lit lit             //{ TEX_FUN2($1,$2,$3) }
  / FUN_AR2nb lit lit           //{ TEX_FUN2nb($1,$2,$3) }
  / FUN_AR2h lit lit            //{ let t,h=$1 in TEX_FUN2h(t,h,$2,$3) }
  / BOX                         //{ let bt,s = $1 in TEX_BOX (bt,s) }
  / CURLY_OPEN expr CURLY_CLOSE
                                //{ TEX_CURLY $2 }
  / CURLY_OPEN ne_expr FUN_INFIX ne_expr CURLY_CLOSE
                                //{ TEX_INFIX($3,$2,$4) }
  / CURLY_OPEN ne_expr FUN_INFIXh ne_expr CURLY_CLOSE
                                //{ let t,h=$3 in TEX_INFIXh(t,h,$2,$4) }
  / BEGIN_MATRIX  matrix END_MATRIX     //{ TEX_MATRIX ("matrix", $2) }
  / BEGIN_PMATRIX  matrix END_PMATRIX   //{ TEX_MATRIX ("pmatrix", $2) }
  / BEGIN_BMATRIX  matrix END_BMATRIX   //{ TEX_MATRIX ("bmatrix", $2) }
  / BEGIN_BBMATRIX matrix END_BBMATRIX  //{ TEX_MATRIX ("Bmatrix", $2) }
  / BEGIN_VMATRIX  matrix END_VMATRIX   //{ TEX_MATRIX ("vmatrix", $2) }
  / BEGIN_VVMATRIX matrix END_VVMATRIX  //{ TEX_MATRIX ("Vmatrix", $2) }
  / BEGIN_ARRAY    matrix END_ARRAY         //{ TEX_MATRIX ("array", $2) }
  / BEGIN_ALIGN    matrix END_ALIGN         //{ TEX_MATRIX ("aligned", $2) }
  / BEGIN_ALIGNAT  matrix END_ALIGNAT   //{ TEX_MATRIX ("alignedat", $2) }
  / BEGIN_SMALLMATRIX  matrix END_SMALLMATRIX //{ TEX_MATRIX ("smallmatrix", $2) }
  / BEGIN_CASES    matrix END_CASES     //{ TEX_MATRIX ("cases", $2) }
matrix
  = line NEXT_ROW matrix        //{ $1::$3 }
  / line                        //{ [$1] }
line
  = expr NEXT_CELL line         //{ $1::$3 }
  / expr                        //{ [$1] }

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

latex_function_names
 = "arccos" / "arcsin" / "arctan" / "arg" / "cos" / "cosh" / "cot" / "coth"
 / "csc"/ "deg" / "det" / "dim" / "exp" / "gcd" / "hom" / "inf" / "ker" / "lg"
 / "lim" / "liminf" / "limsup" / "ln" / "log" / "max" / "min" / "Pr" / "sec"
 / "sin" / "sinh" / "sup" / "tan" / "tanh"
mediawiki_function_names
 = "arccot" / "arcsec" / "arccsc" / "sgn" / "sen"

BOX
 = b:("\\text"/"\\mbox"/"\\hbox"/"\\vbox") _ "{" cs:boxchars+ "}" _
   { return ast.Tex.BOX(b, cs.join('')); }

// returns a RenderT
LITERAL
 = c:( literal_id / literal_mn / literal_uf_lt / "-" / literal_uf_op ) _
   { return ast.RenderT.TEX_ONLY(c); }
 / "\\" name:latex_function_names _ c:( "(" / "[" / "\\{" / { return " ";}) _
   { return ast.RenderT.TEX_ONLY("\\" + name + c); }
 / "\\" name:mediawiki_function_names c:( "(" / "[" / "\\{" / { return " ";}) _
   { return ast.RenderT.TEX_ONLY("\\operatorname{" + name + "}" + c); }
 / l:other_literals1 _ // from Texutil.find(...)
   { return ast.RenderT.TEX_ONLY(l + " "); }
 / l:other_literals2 _ // from Texutil.find(...)
   { return ast.RenderT.TEX_ONLY("\\mbox{" + l + "} "); }
 / l:other_literals3 _ // from Texutil.find(...)
   { return ast.RenderT.TEX_ONLY(l + " "); }
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
 / d:other_delimiters1 _ // from Texutil.find(...)
   { return ast.RenderT.TEX_ONLY(d + " "); }
 / d:other_delimiters2 _ // from Texutil.find(...)
   { return ast.RenderT.TEX_ONLY(d + " "); }

FUN_AR1nb
 = name:("\\operatorname") _ { return name; }

FUN_AR1opt
 = name:("\\sqrt" / "\\xleftarrow" / "\\xrightarrow" ) _ "[" _ { return name; }

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
BEGIN_ALIGNAT
 = "\\begin{alignat}" _
END_ALIGNAT
 = "\\end{alignat}" _
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
other_literals1
  = "\\AA"
  / "\\aleph"
  / "\\alpha"
  / "\\amalg"
  / "\\And"
  / "\\angle"
  / "\\approx"
  / "\\approxeq"
  / "\\ast"
  / "\\asymp"
  / "\\backepsilon"
  / "\\backprime"
  / "\\backsim"
  / "\\backsimeq"
  / "\\barwedge"
  / "\\Bbbk"
  / "\\because"
  / "\\beta"
  / "\\beth"
  / "\\between"
  / "\\bigcap"
  / "\\bigcirc"
  / "\\bigcup"
  / "\\bigodot"
  / "\\bigoplus"
  / "\\bigotimes"
  / "\\bigsqcup"
  / "\\bigstar"
  / "\\bigtriangledown"
  / "\\bigtriangleup"
  / "\\biguplus"
  / "\\bigvee"
  / "\\bigwedge"
  / "\\blacklozenge"
  / "\\blacksquare"
  / "\\blacktriangle"
  / "\\blacktriangledown"
  / "\\blacktriangleleft"
  / "\\blacktriangleright"
  / "\\bot"
  / "\\bowtie"
  / "\\Box"
  / "\\boxdot"
  / "\\boxminus"
  / "\\boxplus"
  / "\\boxtimes"
  / "\\bullet"
  / "\\bumpeq"
  / "\\Bumpeq"
  / "\\cap"
  / "\\Cap"
  / "\\cdot"
  / "\\cdots"
  / "\\centerdot"
  / "\\checkmark"
  / "\\chi"
  / "\\circ"
  / "\\circeq"
  / "\\circlearrowleft"
  / "\\circlearrowright"
  / "\\circledast"
  / "\\circledcirc"
  / "\\circleddash"
  / "\\circledS"
  / "\\clubsuit"
  / "\\colon"
  / "\\color"
  / "\\complement"
  / "\\cong"
  / "\\coprod"
  / "\\cup"
  / "\\Cup"
  / "\\curlyeqprec"
  / "\\curlyeqsucc"
  / "\\curlyvee"
  / "\\curlywedge"
  / "\\curvearrowleft"
  / "\\curvearrowright"
  / "\\dagger"
  / "\\daleth"
  / "\\dashv"
  / "\\ddagger"
  / "\\ddots"
  / "\\definecolor"
  / "\\delta"
  / "\\Delta"
  / "\\diagdown"
  / "\\diagup"
  / "\\diamond"
  / "\\Diamond"
  / "\\diamondsuit"
  / "\\digamma"
  / "\\displaystyle"
  / "\\div"
  / "\\divideontimes"
  / "\\doteq"
  / "\\doteqdot"
  / "\\dotplus"
  / "\\dots"
  / "\\dotsb"
  / "\\dotsc"
  / "\\dotsi"
  / "\\dotsm"
  / "\\dotso"
  / "\\doublebarwedge"
  / "\\downdownarrows"
  / "\\downharpoonleft"
  / "\\downharpoonright"
  / "\\ell"
  / "\\emptyset"
  / "\\epsilon"
  / "\\eqcirc"
  / "\\eqsim"
  / "\\eqslantgtr"
  / "\\eqslantless"
  / "\\equiv"
  / "\\eta"
  / "\\eth"
  / "\\exists"
  / "\\fallingdotseq"
  / "\\Finv"
  / "\\flat"
  / "\\forall"
  / "\\frown"
  / "\\Game"
  / "\\gamma"
  / "\\Gamma"
  / "\\geq"
  / "\\geqq"
  / "\\geqslant"
  / "\\gets"
  / "\\gg"
  / "\\ggg"
  / "\\gimel"
  / "\\gnapprox"
  / "\\gneq"
  / "\\gneqq"
  / "\\gnsim"
  / "\\gtrapprox"
  / "\\gtrdot"
  / "\\gtreqless"
  / "\\gtreqqless"
  / "\\gtrless"
  / "\\gtrsim"
  / "\\gvertneqq"
  / "\\hbar"
  / "\\heartsuit"
  / "\\hline"
  / "\\hookleftarrow"
  / "\\hookrightarrow"
  / "\\hslash"
  / "\\iff"
  / "\\iiiint"
  / "\\iiint"
  / "\\iint"
  / "\\Im"
  / "\\imath"
  / "\\implies"
  / "\\in"
  / "\\infty"
  / "\\injlim"
  / "\\int"
  / "\\intercal"
  / "\\iota"
  / "\\jmath"
  / "\\kappa"
  / "\\lambda"
  / "\\Lambda"
  / "\\land"
  / "\\ldots"
  / "\\leftarrow"
  / "\\Leftarrow"
  / "\\leftarrowtail"
  / "\\leftharpoondown"
  / "\\leftharpoonup"
  / "\\leftleftarrows"
  / "\\leftrightarrow"
  / "\\Leftrightarrow"
  / "\\leftrightarrows"
  / "\\leftrightharpoons"
  / "\\leftrightsquigarrow"
  / "\\leftthreetimes"
  / "\\leq"
  / "\\leqq"
  / "\\leqslant"
  / "\\lessapprox"
  / "\\lessdot"
  / "\\lesseqgtr"
  / "\\lesseqqgtr"
  / "\\lessgtr"
  / "\\lesssim"
  / "\\limits"
  / "\\ll"
  / "\\Lleftarrow"
  / "\\lll"
  / "\\lnapprox"
  / "\\lneq"
  / "\\lneqq"
  / "\\lnot"
  / "\\lnsim"
  / "\\longleftarrow"
  / "\\Longleftarrow"
  / "\\longleftrightarrow"
  / "\\Longleftrightarrow"
  / "\\longmapsto"
  / "\\longrightarrow"
  / "\\Longrightarrow"
  / "\\looparrowleft"
  / "\\looparrowright"
  / "\\lor"
  / "\\lozenge"
  / "\\Lsh"
  / "\\ltimes"
  / "\\lVert"
  / "\\lvertneqq"
  / "\\mapsto"
  / "\\measuredangle"
  / "\\mho"
  / "\\mid"
  / "\\mod"
  / "\\models"
  / "\\mp"
  / "\\mu"
  / "\\multimap"
  / "\\nabla"
  / "\\natural"
  / "\\ncong"
  / "\\nearrow"
  / "\\neg"
  / "\\neq"
  / "\\nexists"
  / "\\ngeq"
  / "\\ngeqq"
  / "\\ngeqslant"
  / "\\ngtr"
  / "\\ni"
  / "\\nleftarrow"
  / "\\nLeftarrow"
  / "\\nleftrightarrow"
  / "\\nLeftrightarrow"
  / "\\nleq"
  / "\\nleqq"
  / "\\nleqslant"
  / "\\nless"
  / "\\nmid"
  / "\\nolimits"
  / "\\not"
  / "\\notin"
  / "\\nparallel"
  / "\\nprec"
  / "\\npreceq"
  / "\\nrightarrow"
  / "\\nRightarrow"
  / "\\nshortmid"
  / "\\nshortparallel"
  / "\\nsim"
  / "\\nsubseteq"
  / "\\nsubseteqq"
  / "\\nsucc"
  / "\\nsucceq"
  / "\\nsupseteq"
  / "\\nsupseteqq"
  / "\\ntriangleleft"
  / "\\ntrianglelefteq"
  / "\\ntriangleright"
  / "\\ntrianglerighteq"
  / "\\nu"
  / "\\nvdash"
  / "\\nVdash"
  / "\\nvDash"
  / "\\nVDash"
  / "\\nwarrow"
  / "\\odot"
  / "\\oint"
  / "\\omega"
  / "\\Omega"
  / "\\ominus"
  / "\\oplus"
  / "\\oslash"
  / "\\otimes"
  / "\\overbrace"
  / "\\overleftarrow"
  / "\\overleftrightarrow"
  / "\\overline"
  / "\\overrightarrow"
  / "\\P"
  / "\\pagecolor"
  / "\\parallel"
  / "\\partial"
  / "\\perp"
  / "\\phi"
  / "\\Phi"
  / "\\pi"
  / "\\Pi"
  / "\\pitchfork"
  / "\\pm"
  / "\\prec"
  / "\\precapprox"
  / "\\preccurlyeq"
  / "\\preceq"
  / "\\precnapprox"
  / "\\precneqq"
  / "\\precnsim"
  / "\\precsim"
  / "\\prime"
  / "\\prod"
  / "\\projlim"
  / "\\propto"
  / "\\psi"
  / "\\Psi"
  / "\\qquad"
  / "\\quad"
  / "\\Re"
  / "\\rho"
  / "\\rightarrow"
  / "\\Rightarrow"
  / "\\rightarrowtail"
  / "\\rightharpoondown"
  / "\\rightharpoonup"
  / "\\rightleftarrows"
  / "\\rightrightarrows"
  / "\\rightsquigarrow"
  / "\\rightthreetimes"
  / "\\risingdotseq"
  / "\\Rrightarrow"
  / "\\Rsh"
  / "\\rtimes"
  / "\\rVert"
  / "\\S"
  / "\\scriptscriptstyle"
  / "\\scriptstyle"
  / "\\searrow"
  / "\\setminus"
  / "\\sharp"
  / "\\shortmid"
  / "\\shortparallel"
  / "\\sigma"
  / "\\Sigma"
  / "\\sim"
  / "\\simeq"
  / "\\smallfrown"
  / "\\smallsetminus"
  / "\\smallsmile"
  / "\\smile"
  / "\\spadesuit"
  / "\\sphericalangle"
  / "\\sqcap"
  / "\\sqcup"
  / "\\sqsubset"
  / "\\sqsubseteq"
  / "\\sqsupset"
  / "\\sqsupseteq"
  / "\\square"
  / "\\star"
  / "\\subset"
  / "\\Subset"
  / "\\subseteq"
  / "\\subseteqq"
  / "\\subsetneq"
  / "\\subsetneqq"
  / "\\succ"
  / "\\succapprox"
  / "\\succcurlyeq"
  / "\\succeq"
  / "\\succnapprox"
  / "\\succneqq"
  / "\\succnsim"
  / "\\succsim"
  / "\\sum"
  / "\\supset"
  / "\\Supset"
  / "\\supseteq"
  / "\\supseteqq"
  / "\\supsetneq"
  / "\\supsetneqq"
  / "\\surd"
  / "\\swarrow"
  / "\\tau"
  / "\\textstyle"
  / "\\textvisiblespace"
  / "\\therefore"
  / "\\theta"
  / "\\Theta"
  / "\\thickapprox"
  / "\\thicksim"
  / "\\times"
  / "\\to"
  / "\\top"
  / "\\triangle"
  / "\\triangledown"
  / "\\triangleleft"
  / "\\trianglelefteq"
  / "\\triangleq"
  / "\\triangleright"
  / "\\trianglerighteq"
  / "\\underbrace"
  / "\\underline"
  / "\\upharpoonleft"
  / "\\upharpoonright"
  / "\\uplus"
  / "\\upsilon"
  / "\\Upsilon"
  / "\\upuparrows"
  / "\\varepsilon"
  / "\\varinjlim"
  / "\\varkappa"
  / "\\varliminf"
  / "\\varlimsup"
  / "\\varnothing"
  / "\\varphi"
  / "\\varpi"
  / "\\varprojlim"
  / "\\varpropto"
  / "\\varrho"
  / "\\varsigma"
  / "\\varsubsetneq"
  / "\\varsubsetneqq"
  / "\\varsupsetneq"
  / "\\varsupsetneqq"
  / "\\vartheta"
  / "\\vartriangle"
  / "\\vartriangleleft"
  / "\\vartriangleright"
  / "\\vdash"
  / "\\Vdash"
  / "\\vDash"
  / "\\vdots"
  / "\\vee"
  / "\\veebar"
  / "\\vline"
  / "\\Vvdash"
  / "\\wedge"
  / "\\widehat"
  / "\\widetilde"
  / "\\wp"
  / "\\wr"
  / "\\xi"
  / "\\Xi"
  / "\\zeta"

BIG
  = b:( "\\big"
  / "\\Big"
  / "\\bigg"
  / "\\Bigg"
  / "\\biggl"
  / "\\Biggl"
  / "\\biggr"
  / "\\Biggr"
  / "\\bigl"
  / "\\Bigl"
  / "\\bigr"
  / "\\Bigr" )
  { return b + " "; }

other_delimiters1
  = "\\backslash"
  / "\\downarrow"
  / "\\Downarrow"
  / "\\langle"
  / "\\lbrace"
  / "\\lceil"
  / "\\lfloor"
  / "\\llcorner"
  / "\\lrcorner"
  / "\\rangle"
  / "\\rbrace"
  / "\\rceil"
  / "\\rfloor"
  / "\\rightleftharpoons"
  / "\\twoheadleftarrow"
  / "\\twoheadrightarrow"
  / "\\ulcorner"
  / "\\uparrow"
  / "\\Uparrow"
  / "\\updownarrow"
  / "\\Updownarrow"
  / "\\urcorner"
  / "\\Vert"
  / "\\vert"
  / "\\lbrack"
  / "\\rbrack"

FUN_AR1
  = name:( "\\acute"
  / "\\bar"
  / "\\bcancel"
  / "\\bmod"
  / "\\boldsymbol"
  / "\\breve"
  / "\\cancel"
  / "\\check"
  / "\\ddot"
  / "\\dot"
  / "\\emph"
  / "\\grave"
  / "\\hat"
  / "\\mathbb"
  / "\\mathbf"
  / "\\mathbin"
  / "\\mathcal"
  / "\\mathclose"
  / "\\mathfrak"
  / "\\mathit"
  / "\\mathop"
  / "\\mathopen"
  / "\\mathord"
  / "\\mathpunct"
  / "\\mathrel"
  / "\\mathrm"
  / "\\mathsf"
  / "\\mathtt"
  / "\\operatorname"
  / "\\pmod"
  / "\\sqrt"
  / "\\textbf"
  / "\\textit"
  / "\\textrm"
  / "\\textsf"
  / "\\texttt"
  / "\\tilde"
  / "\\vec"
  / "\\xcancel"
  / "\\xleftarrow"
  / "\\xrightarrow"
  / other_fun_ar1 ) _
  { return name + " "; }

FUN_AR2
  = name:( "\\binom"
  / "\\cancelto"
  / "\\cfrac"
  / "\\dbinom"
  / "\\dfrac"
  / "\\frac"
  / "\\overset"
  / "\\stackrel"
  / "\\tbinom"
  / "\\tfrac"
  / "\\underset" ) _
  { return name + " "; }

FUN_INFIX
  = name:( "\\atop"
  / "\\choose"
  / "\\over" ) _
  { return name + " "; }

other_literals2
  = "\\Coppa"
  / "\\coppa"
  / "\\Digamma"
  / "\\euro"
  / "\\geneuro"
  / "\\geneuronarrow"
  / "\\geneurowide"
  / "\\Koppa"
  / "\\koppa"
  / "\\officialeuro"
  / "\\Sampi"
  / "\\sampi"
  / "\\Stigma"
  / "\\stigma"
  / "\\varstigma"

other_delimiters2
  = "\\darr" { return "\\downarrow"; }
  / "\\dArr" { return "\\Downarrow"; }
  / "\\Darr" { return "\\Downarrow"; }
  / "\\lang" { return "\\langle"; }
  / "\\rang" { return "\\rangle"; }
  / "\\uarr" { return "\\uparrow"; }
  / "\\uArr" { return "\\Uparrow"; }
  / "\\Uarr" { return "\\Uparrow"; }

other_fun_ar1
  = "\\Bbb" { return "\\mathbb"; }
  / "\\bold" { return "\\mathbf"; }

other_literals3
  = "\\C" { return "\\mathbb{C}"; }
  / "\\H" { return "\\mathbb{H}"; }
  / "\\N" { return "\\mathbb{N}"; }
  / "\\Q" { return "\\mathbb{Q}"; }
  / "\\R" { return "\\mathbb{R}"; }
  / "\\Z" { return "\\mathbb{Z }"; }
  / "\\alef" { return "\\aleph"; }
  / "\\alefsym" { return "\\aleph"; }
  / "\\Alpha" { return "\\mathrm{A}"; }
  / "\\and" { return "\\land"; }
  / "\\ang" { return "\\angle"; }
  / "\\Beta" { return "\\mathrm{B}"; }
  / "\\bull" { return "\\bullet"; }
  / "\\Chi" { return "\\mathrm{X}"; }
  / "\\clubs" { return "\\clubsuit"; }
  / "\\cnums" { return "\\mathbb{C}"; }
  / "\\Complex" { return "\\mathbb{C}"; }
  / "\\Dagger" { return "\\ddagger"; }
  / "\\diamonds" { return "\\diamondsuit"; }
  / "\\Doteq" { return "\\doteqdot"; }
  / "\\doublecap" { return "\\Cap"; }
  / "\\doublecup" { return "\\Cup"; }
  / "\\empty" { return "\\emptyset"; }
  / "\\Epsilon" { return "\\mathrm{E}"; }
  / "\\Eta" { return "\\mathrm{H}"; }
  / "\\exist" { return "\\exists"; }
  / "\\ge" { return "\\geq"; }
  / "\\gggtr" { return "\\ggg"; }
  / "\\hAar" { return "\\Leftrightarrow"; }
  / "\\harr" { return "\\leftrightarrow"; }
  / "\\Harr" { return "\\Leftrightarrow"; }
  / "\\hearts" { return "\\heartsuit"; }
  / "\\image" { return "\\Im"; }
  / "\\infin" { return "\\infty"; }
  / "\\Iota" { return "\\mathrm{I}"; }
  / "\\isin" { return "\\in"; }
  / "\\Kappa" { return "\\mathrm{K}"; }
  / "\\larr" { return "\\leftarrow"; }
  / "\\Larr" { return "\\Leftarrow"; }
  / "\\lArr" { return "\\Leftarrow"; }
  / "\\le" { return "\\leq"; }
  / "\\lrarr" { return "\\leftrightarrow"; }
  / "\\Lrarr" { return "\\Leftrightarrow"; }
  / "\\lrArr" { return "\\Leftrightarrow"; }
  / "\\Mu" { return "\\mathrm{M}"; }
  / "\\natnums" { return "\\mathbb{N}"; }
  / "\\ne" { return "\\neq"; }
  / "\\Nu" { return "\\mathrm{N}"; }
  / "\\O" { return "\\emptyset"; }
  / "\\omicron" { return "\\mathrm{o}"; }
  / "\\Omicron" { return "\\mathrm{O}"; }
  / "\\or" { return "\\lor"; }
  / "\\part" { return "\\partial"; }
  / "\\plusmn" { return "\\pm"; }
  / "\\rarr" { return "\\rightarrow"; }
  / "\\Rarr" { return "\\Rightarrow"; }
  / "\\rArr" { return "\\Rightarrow"; }
  / "\\real" { return "\\Re"; }
  / "\\reals" { return "\\mathbb{R}"; }
  / "\\Reals" { return "\\mathbb{R}"; }
  / "\\restriction" { return "\\upharpoonright"; }
  / "\\Rho" { return "\\mathrm{P}"; }
  / "\\sdot" { return "\\cdot"; }
  / "\\sect" { return "\\S"; }
  / "\\spades" { return "\\spadesuit"; }
  / "\\sub" { return "\\subset"; }
  / "\\sube" { return "\\subseteq"; }
  / "\\supe" { return "\\supseteq"; }
  / "\\Tau" { return "\\mathrm{T}"; }
  / "\\thetasym" { return "\\vartheta"; }
  / "\\varcoppa" { return "\\mbox{coppa}"; }
  / "\\weierp" { return "\\wp"; }
  / "\\Zeta" { return "\\mathrm{Z}"; }

DECLh
  = cmd:("\\rm"
  / "\\it"
  / "\\cal"
  / "\\bf") _
  { return ast.Tex.DECLh(cmd + " ", ast.FontForce.RM(), []); /*see bug 54818*/ }

FUN_AR2nb
  = name:("\\sideset") _
  { return name + " "; }
LEFT
  = "\\left" _
RIGHT
  = "\\right" _

// Missing lexer tokens!
FUN_INFIXh = impossible
FUN_AR1hl = impossible
FUN_AR1hf = impossible
FUN_AR2h = impossible
impossible = & { return false; }

// End of file
EOF = & { return peg$currPos === input.length; }
