/** PEGjs lexer/parser */
{
  var tex = require('./tex');
}
// first rule is the start production.
start
  = tex_expr

/////////////////////////////////////////////////////////////
// PARSER
//----------------------------------------------------------

tex_expr
  = expr EOF
  / ne_expr FUN_INFIX ne_expr EOF
  / ne_expr FUN_INFIXh ne_expr EOF

expr
  = /* */
  / ne_expr

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
expr_nosqc
  =  /* */
  / lit_aq expr_nosqc
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
  = LEFT DELIMITER
  / LEFT SQ_CLOSE
right
  = RIGHT DELIMITER
  / RIGHT SQ_CLOSE
lit
  = LITERAL			//{ TEX_LITERAL $1 }
  / DELIMITER			//{ TEX_LITERAL $1 }
  / BIG DELIMITER		//{ TEX_BIG ($1,$2) }
  / BIG SQ_CLOSE		//{ TEX_BIG ($1,sq_close_ri) }
  / left expr right		//{ TEX_LR ($1,$3,$2) }
  / FUN_AR1 lit			//{ TEX_FUN1($1,$2) }
  / FUN_AR1nb lit		//{ TEX_FUN1nb($1,$2) }
  / FUN_AR1hl lit		//{ let t,h=$1 in TEX_FUN1hl(t,h,$2) }
  / FUN_AR1hf lit		//{ let t,h=$1 in TEX_FUN1hf(t,h,$2) }
  / FUN_AR1opt expr_nosqc SQ_CLOSE lit //{ TEX_FUN2sq($1,TEX_CURLY $2,$4) }
  / FUN_AR2 lit lit		//{ TEX_FUN2($1,$2,$3) }
  / FUN_AR2nb lit lit		//{ TEX_FUN2nb($1,$2,$3) }
  / FUN_AR2h lit lit		//{ let t,h=$1 in TEX_FUN2h(t,h,$2,$3) }
  / BOX				//{ let bt,s = $1 in TEX_BOX (bt,s) }
  / CURLY_OPEN expr CURLY_CLOSE
				//{ TEX_CURLY $2 }
  / CURLY_OPEN ne_expr FUN_INFIX ne_expr CURLY_CLOSE
				//{ TEX_INFIX($3,$2,$4) }
  / CURLY_OPEN ne_expr FUN_INFIXh ne_expr CURLY_CLOSE
				//{ let t,h=$3 in TEX_INFIXh(t,h,$2,$4) }
  / BEGIN__MATRIX  matrix END__MATRIX	//{ TEX_MATRIX ("matrix", $2) }
  / BEGIN_PMATRIX  matrix END_PMATRIX	//{ TEX_MATRIX ("pmatrix", $2) }
  / BEGIN_BMATRIX  matrix END_BMATRIX	//{ TEX_MATRIX ("bmatrix", $2) }
  / BEGIN_BBMATRIX matrix END_BBMATRIX	//{ TEX_MATRIX ("Bmatrix", $2) }
  / BEGIN_VMATRIX  matrix END_VMATRIX	//{ TEX_MATRIX ("vmatrix", $2) }
  / BEGIN_VVMATRIX matrix END_VVMATRIX	//{ TEX_MATRIX ("Vmatrix", $2) }
  / BEGIN_ARRAY    matrix END_ARRAY	    //{ TEX_MATRIX ("array", $2) }
  / BEGIN_ALIGN    matrix END_ALIGN	    //{ TEX_MATRIX ("aligned", $2) }
  / BEGIN_ALIGNAT  matrix END_ALIGNAT	//{ TEX_MATRIX ("alignedat", $2) }
  / BEGIN_SMALLMATRIX  matrix END_SMALLMATRIX //{ TEX_MATRIX ("smallmatrix", $2) }
  / BEGIN_CASES    matrix END_CASES	//{ TEX_MATRIX ("cases", $2) }
matrix
  = line			//{ [$1] }
  / line NEXT_ROW matrix	//{ $1::$3 }
line
  = expr			//{ [$1] }
  / expr NEXT_CELL line		//{ $1::$3 }

/////////////////////////////////////////////////////////////
// LEXER
//----------------------------------------------------------
space =           [ \t\n\r]
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

// XXX space?

BOX
 = ("\\text"/"\\mbox"/"\\hbox"/"\\vbox") space* "{" boxchars+ "}"

LITERAL
 = ( literal_id / literal_mn / literal_uf_lt / "-" / literal_uf_op )
 / "\\" latex_function_names space* ( "(" / "[" / "\\{" / { return " ";})
 / "\\" mediawiki_function_names space* ( "(" / "[" / "\\{" / { return " ";})
 / other_literals1 // Texutil.find(...)
 / other_literals2 // Texutil.find(...)
 / other_literals3 // Texutil.find(...)
 / "\\" [, ;!_#%$&]
 / [><~]
 / [%$]

DELIMITER
 = ( delimiter_uf_lt / delimiter_uf_op )
 / [{}|]
 / "["
 / other_delimiters1 // Texutil.find(...)
 / other_delimiters2 // Texutil.find(...)

FUN_AR1nb
 = "\\operatorname"

FUN_AR1opt
 = ("\\sqrt" / "\\xleftarrow" / "\\xrightarrow" ) space* "["

NEXT_CELL
 = "&"

NEXT_ROW
 = "\\\\"

BEGIN__MATRIX
 = "\\begin{matrix}"
END__MATRIX
 = "\\end{matrix}"
BEGIN_PMATRIX
 = "\\begin{pmatrix}"
END_PMATRIX
 = "\\end{pmatrix}"
BEGIN_BMATRIX
 = "\\begin{bmatrix}"
END_BMATRIX
 = "\\end{bmatrix}"
BEGIN_BBMATRIX
 = "\\begin{Bmatrix}"
END_BBMATRIX
 = "\\end{Bmatrix}"
BEGIN_VMATRIX
 = "\\begin{vmatrix}"
END_VMATRIX
 = "\\end{vmatrix}"
BEGIN_VVMATRIX
 = "\\begin{Vmatrix}"
END_VVMATRIX
 = "\\end{Vmatrix}"
BEGIN_ARRAY
 = "\\begin{array}"
END_ARRAY
 = "\\end{array}"
BEGIN_ALIGN
 = "\\begin{align}"
END_ALIGN
 = "\\end{align}"
BEGIN_ALIGNAT
 = "\\begin{alignat}"
END_ALIGNAT
 = "\\end{alignat}"
BEGIN_SMALLMATRIX
 = "\\begin{smallmatrix}"
END_SMALLMATRIX
 = "\\end{smallmatrix}"
BEGIN_CASES
 = "\\begin{cases}"
END_CASES
 = "\\end{cases}"

SQ_CLOSE
 =  "]"
CURLY_OPEN
 = '{'
CURLY_CLOSE
 = '}'
SUP
 = "^"
SUB
 = "_"

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
  //-> LITERAL ( TEX_ONLY( cmd ^ " " ) )

BIG
  = "\\big"
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
  / "\\Bigr"
  //-> BIG (  cmd ^ " " )

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
  //-> DELIMITER( TEX_ONLY( cmd ^ " ") )

FUN_AR1
  = "\\acute"
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
  //-> FUN_AR1( cmd ^ " " )
  / other_fun_ar1

FUN_AR2
  = "\\binom"
  / "\\cancelto"
  / "\\cfrac"
  / "\\dbinom"
  / "\\dfrac"
  / "\\frac"
  / "\\overset"
  / "\\stackrel"
  / "\\tbinom"
  / "\\tfrac"
  / "\\underset"
  //-> FUN_AR2( cmd ^ " " )

FUN_INFIX
  = "\\atop"
  / "\\choose"
  / "\\over"
  //-> FUN_INFIX( cmd ^ " " )

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
  //-> LITERAL ( TEX_ONLY( "\\mbox{" ^ cmd ^ "} " ) )

  / "\\C" //-> LITERAL ( TEX_ONLY( "\\mathbb{C}" ^ " " ) )
  / "\\H" //-> LITERAL ( TEX_ONLY( "\\mathbb{H}" ^ " " ) )
  / "\\N" //-> LITERAL ( TEX_ONLY( "\\mathbb{N}" ^ " " ) )
  / "\\Q" //-> LITERAL ( TEX_ONLY( "\\mathbb{Q}" ^ " " ) )
  / "\\R" //-> LITERAL ( TEX_ONLY( "\\mathbb{R}" ^ " " ) )
  / "\\Z" //-> LITERAL ( TEX_ONLY( "\\mathbb{Z }" ^ " " ) )

other_delimiters2
  = "\\darr" //-> DELIMITER( TEX_ONLY( "\\downarrow" ^ " " ) )
  / "\\dArr" //-> DELIMITER( TEX_ONLY( "\\Downarrow" ^ " " ) )
  / "\\Darr" //-> DELIMITER( TEX_ONLY( "\\Downarrow" ^ " " ) )
  / "\\lang" //-> DELIMITER( TEX_ONLY( "\\langle" ^ " " ) )
  / "\\rang" //-> DELIMITER( TEX_ONLY( "\\rangle" ^ " " ) )
  / "\\uarr" //-> DELIMITER( TEX_ONLY( "\\uparrow" ^ " " ) )
  / "\\uArr" //-> DELIMITER( TEX_ONLY( "\\Uparrow" ^ " " ) )
  / "\\Uarr" //-> DELIMITER( TEX_ONLY( "\\Uparrow" ^ " " ) )

other_fun_ar1
  = "\\Bbb" //-> FUN_AR1( "\\mathbb" ^ " " )
  / "\\bold" //-> FUN_AR1( "\\mathbf" ^ " " )

other_literals3
  = "\\alef" //-> LITERAL ( TEX_ONLY( "\\aleph" ^ " " ) )
  / "\\alefsym" //-> LITERAL ( TEX_ONLY( "\\aleph" ^ " " ) )
  / "\\Alpha" //-> LITERAL ( TEX_ONLY( "\\mathrm{A}" ^ " " ) )
  / "\\and" //-> LITERAL ( TEX_ONLY( "\\land" ^ " " ) )
  / "\\ang" //-> LITERAL ( TEX_ONLY( "\\angle" ^ " " ) )
  / "\\Beta" //-> LITERAL ( TEX_ONLY( "\\mathrm{B}" ^ " " ) )
  / "\\bull" //-> LITERAL ( TEX_ONLY( "\\bullet" ^ " " ) )
  / "\\Chi" //-> LITERAL ( TEX_ONLY( "\\mathrm{X}" ^ " " ) )
  / "\\clubs" //-> LITERAL ( TEX_ONLY( "\\clubsuit" ^ " " ) )
  / "\\cnums" //-> LITERAL ( TEX_ONLY( "\\mathbb{C}" ^ " " ) )
  / "\\Complex" //-> LITERAL ( TEX_ONLY( "\\mathbb{C}" ^ " " ) )
  / "\\Dagger" //-> LITERAL ( TEX_ONLY( "\\ddagger" ^ " " ) )
  / "\\diamonds" //-> LITERAL ( TEX_ONLY( "\\diamondsuit" ^ " " ) )
  / "\\Doteq" //-> LITERAL ( TEX_ONLY( "\\doteqdot" ^ " " ) )
  / "\\doublecap" //-> LITERAL ( TEX_ONLY( "\\Cap" ^ " " ) )
  / "\\doublecup" //-> LITERAL ( TEX_ONLY( "\\Cup" ^ " " ) )
  / "\\empty" //-> LITERAL ( TEX_ONLY( "\\emptyset" ^ " " ) )
  / "\\Epsilon" //-> LITERAL ( TEX_ONLY( "\\mathrm{E}" ^ " " ) )
  / "\\Eta" //-> LITERAL ( TEX_ONLY( "\\mathrm{H}" ^ " " ) )
  / "\\exist" //-> LITERAL ( TEX_ONLY( "\\exists" ^ " " ) )
  / "\\ge" //-> LITERAL ( TEX_ONLY( "\\geq" ^ " " ) )
  / "\\gggtr" //-> LITERAL ( TEX_ONLY( "\\ggg" ^ " " ) )
  / "\\hAar" //-> LITERAL ( TEX_ONLY( "\\Leftrightarrow" ^ " " ) )
  / "\\harr" //-> LITERAL ( TEX_ONLY( "\\leftrightarrow" ^ " " ) )
  / "\\Harr" //-> LITERAL ( TEX_ONLY( "\\Leftrightarrow" ^ " " ) )
  / "\\hearts" //-> LITERAL ( TEX_ONLY( "\\heartsuit" ^ " " ) )
  / "\\image" //-> LITERAL ( TEX_ONLY( "\\Im" ^ " " ) )
  / "\\infin" //-> LITERAL ( TEX_ONLY( "\\infty" ^ " " ) )
  / "\\Iota" //-> LITERAL ( TEX_ONLY( "\\mathrm{I}" ^ " " ) )
  / "\\isin" //-> LITERAL ( TEX_ONLY( "\\in" ^ " " ) )
  / "\\Kappa" //-> LITERAL ( TEX_ONLY( "\\mathrm{K}" ^ " " ) )
  / "\\larr" //-> LITERAL ( TEX_ONLY( "\\leftarrow" ^ " " ) )
  / "\\Larr" //-> LITERAL ( TEX_ONLY( "\\Leftarrow" ^ " " ) )
  / "\\lArr" //-> LITERAL ( TEX_ONLY( "\\Leftarrow" ^ " " ) )
  / "\\le" //-> LITERAL ( TEX_ONLY( "\\leq" ^ " " ) )
  / "\\lrarr" //-> LITERAL ( TEX_ONLY( "\\leftrightarrow" ^ " " ) )
  / "\\Lrarr" //-> LITERAL ( TEX_ONLY( "\\Leftrightarrow" ^ " " ) )
  / "\\lrArr" //-> LITERAL ( TEX_ONLY( "\\Leftrightarrow" ^ " " ) )
  / "\\Mu" //-> LITERAL ( TEX_ONLY( "\\mathrm{M}" ^ " " ) )
  / "\\natnums" //-> LITERAL ( TEX_ONLY( "\\mathbb{N}" ^ " " ) )
  / "\\ne" //-> LITERAL ( TEX_ONLY( "\\neq" ^ " " ) )
  / "\\Nu" //-> LITERAL ( TEX_ONLY( "\\mathrm{N}" ^ " " ) )
  / "\\O" //-> LITERAL ( TEX_ONLY( "\\emptyset" ^ " " ) )
  / "\\omicron" //-> LITERAL ( TEX_ONLY( "\\mathrm{o}" ^ " " ) )
  / "\\Omicron" //-> LITERAL ( TEX_ONLY( "\\mathrm{O}" ^ " " ) )
  / "\\or" //-> LITERAL ( TEX_ONLY( "\\lor" ^ " " ) )
  / "\\part" //-> LITERAL ( TEX_ONLY( "\\partial" ^ " " ) )
  / "\\plusmn" //-> LITERAL ( TEX_ONLY( "\\pm" ^ " " ) )
  / "\\rarr" //-> LITERAL ( TEX_ONLY( "\\rightarrow" ^ " " ) )
  / "\\Rarr" //-> LITERAL ( TEX_ONLY( "\\Rightarrow" ^ " " ) )
  / "\\rArr" //-> LITERAL ( TEX_ONLY( "\\Rightarrow" ^ " " ) )
  / "\\real" //-> LITERAL ( TEX_ONLY( "\\Re" ^ " " ) )
  / "\\reals" //-> LITERAL ( TEX_ONLY( "\\mathbb{R}" ^ " " ) )
  / "\\Reals" //-> LITERAL ( TEX_ONLY( "\\mathbb{R}" ^ " " ) )
  / "\\restriction" //-> LITERAL ( TEX_ONLY( "\\upharpoonright" ^ " " ) )
  / "\\Rho" //-> LITERAL ( TEX_ONLY( "\\mathrm{P}" ^ " " ) )
  / "\\sdot" //-> LITERAL ( TEX_ONLY( "\\cdot" ^ " " ) )
  / "\\sect" //-> LITERAL ( TEX_ONLY( "\\S" ^ " " ) )
  / "\\spades" //-> LITERAL ( TEX_ONLY( "\\spadesuit" ^ " " ) )
  / "\\sub" //-> LITERAL ( TEX_ONLY( "\\subset" ^ " " ) )
  / "\\sube" //-> LITERAL ( TEX_ONLY( "\\subseteq" ^ " " ) )
  / "\\supe" //-> LITERAL ( TEX_ONLY( "\\supseteq" ^ " " ) )
  / "\\Tau" //-> LITERAL ( TEX_ONLY( "\\mathrm{T}" ^ " " ) )
  / "\\thetasym" //-> LITERAL ( TEX_ONLY( "\\vartheta" ^ " " ) )
  / "\\varcoppa" //-> LITERAL ( TEX_ONLY( "\\mbox{coppa}" ^ " " ) )
  / "\\weierp" //-> LITERAL ( TEX_ONLY( "\\wp" ^ " " ) )
  / "\\Zeta" //-> LITERAL ( TEX_ONLY( "\\mathrm{Z}" ^ " " ) )

DECLh
  = "\\rm"
  / "\\it"
  / "\\cal"
  / "\\bf"
  //-> DECLh ( cmd ^ " ", FONTFORCE_RM ) (* see bug 54818 *)

FUN_AR2nb
  = "\\sideset" //-> FUN_AR2nb "\\sideset "
LEFT
  = "\\left" //-> LEFT
RIGHT
  = "\\right" //-> RIGHT

// Missing tokens!
FUN_INFIXh = impossible
FUN_AR1hl = impossible
FUN_AR1hf = impossible
FUN_AR2h = impossible
impossible = & { return false; }

// End of file
EOF = & { return peg$currPos === input.length; }
