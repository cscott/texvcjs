/** PEGjs lexer/parser */
{
    const Box = require("./nodes/box");
    const Big = require("./nodes/big");
    const ChemFun2u = require("./nodes/chemFun2u");
    const ChemWord = require("./nodes/chemWord");
    const Curly = require("./nodes/curly");
    const Declh = require("./nodes/declh");
    const Dollar = require("./nodes/dollar");
    const Dq = require("./nodes/dq");
    const Fq = require("./nodes/fq");
    const Fun1 = require("./nodes/fun1");
    const Fun1nb = require("./nodes/fun1nb");
    const Fun2 = require("./nodes/fun2");
    const Fun2nb = require("./nodes/fun2nb");
    const Fun2sq = require("./nodes/fun2sq");
    const Infix = require("./nodes/infix");
    const Literal = require("./nodes/literal");
    const Lr = require('./nodes/lr');
    const Matrix = require("./nodes/matrix");
    const Mhchem = require("./nodes/mhchem");
    const Uq = require("./nodes/uq");
  const TexArray = require( './nodes/texArray');

    const tu = require('./texutil');
  const assert = require('assert');

  const lst2arr = function(l) {
      const arr = new TexArray();
      while (l !== null && typeof l !== 'undefined') {
          if (typeof  l.first() !== 'undefined' ) {
            arr.push(l.first());
        }
      l = l.second();
    }
    return arr;
  };
}
// first rule is the start production.
start
  = _ t:tex_expr
    { assert.ok(t instanceof TexArray); return lst2arr(t); }

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
    { return new TexArray(new Infix(name, lst2arr(e1), lst2arr(e2))); }

expr
  = ne_expr
  / ""
    { return new TexArray(); }

ne_expr
  = h:lit_aq t:expr
    { return new TexArray(h, t); }
  / h:litsq_aq t:expr
    { return new TexArray(h, t); }
  / d:DECLh e:expr
    { return new TexArray(new Declh(d.fname, lst2arr(e))); }
litsq_aq
  = litsq_fq
  / litsq_dq
  / litsq_uq
  / litsq_zq
litsq_fq
  = l1:litsq_dq SUP l2:lit
    {
        return new Fq(l1.base, l1.down, l2); }
  / l1:litsq_uq SUB l2:lit
    {
        return new Fq(l1.base, l2, l1.up); }
litsq_uq
  = base:litsq_zq SUP upi:lit
    { return new Uq(base, upi); }
litsq_dq
  = base:litsq_zq SUB downi:lit
    { return new Dq(base, downi); }
litsq_zq
  = SQ_CLOSE
    { return new Literal( "]"); }
expr_nosqc
  = l:lit_aq e:expr_nosqc
    { return new TexArray(l, e); }
  / "" /* */
    { return new TexArray(); }
lit_aq
  = lit_fq
  / lit_dq
  / lit_uq
  / lit_dqn
  / lit_uqn
  / lit

lit_fq
  = l1:lit_dq SUP l2:lit
    { return new Fq(l1.base, l1.down, l2); }
  / l1:lit_uq SUB l2:lit
    { return new Fq (l1.base, l2, l1.up); }
  / l1:lit_dqn SUP l2:lit
    { return new Fq(new TexArray(), l1.down, l2); }

lit_uq
  = base:lit SUP upi:lit
    { return new Uq(base, upi); }
lit_dq
  = base:lit SUB downi:lit
    { return new Dq(base, downi); }
lit_uqn
  = SUP l:lit
    { return new Uq( new TexArray(),l); }
lit_dqn
  = SUB l:lit
    { return new Dq(new TexArray(),l); }


left
  = LEFT d:DELIMITER
    { return d; }
  / LEFT SQ_CLOSE
    { return  "]"; }
right
  = RIGHT d:DELIMITER
    { return d; }
  / RIGHT SQ_CLOSE
    { return  "]"; }
lit
  = r:LITERAL                   { return new Literal(r); }
  / f:generic_func &{ return tu.latex_function_names[f]; } _
  c:( "(" / "[" / "\\{" / "" { return " ";}) _
  { return new TexArray( new Literal(f) , new Literal( c ) ) ; }
  // quasi-literal; this is from Texutil.find(...) but the result is not
  // guaranteed to be Tex.LITERAL(...)
  / f:generic_func &{ return tu.nullary_macro_aliase[f]; } _ // from Texutil.find(...)
   {
     var ast = peg$parse(tu.nullary_macro_aliase[f]);
     assert.ok(ast instanceof TexArray && ast.length === 1);
     return ast.first();
   }
  / f:generic_func &{ return tu.deprecated_nullary_macro_aliase[f]; } _ // from Texutil.find(...)
   {
     var ast = peg$parse(tu.deprecated_nullary_macro_aliase[f]);
     assert.ok(ast instanceof TexArray && ast.length === 1);
     if (options.oldtexvc){
       return ast.first();
     } else {
          throw new peg$SyntaxError("Deprecation: Alias no longer supported.", [], text(), location());
     }
   }
  / r:DELIMITER                 { return new Literal(r); }
  / b:BIG r:DELIMITER           { return new Big(b, r); }
  / b:BIG SQ_CLOSE              { return new Big(b,  "]"); }
  / l:left e:expr r:right       {return new Lr(l, r, lst2arr(e)); }
  / name:FUN_AR1opt e:expr_nosqc SQ_CLOSE l:lit /* must be before FUN_AR1 */
    { return new Fun2sq(name, new Curly(lst2arr(e)), l); }
  / name:FUN_AR1 l:lit          { return new Fun1(name, l); }
  / name:FUN_AR1nb l:lit        {return new Fun1nb(name, l); }
  / name:FUN_MHCHEM l:chem_lit  { return new Mhchem(name, l); }
  / name:FUN_AR2 l1:lit l2:lit  { return new Fun2(name, l1, l2); }
  / name:FUN_AR2nb l1:lit l2:lit { return new Fun2nb(name, l1, l2); }
  / BOX
  / CURLY_OPEN e:expr CURLY_CLOSE
    { return new Curly(lst2arr(e)); }
  / CURLY_OPEN e1:ne_expr name:FUN_INFIX e2:ne_expr CURLY_CLOSE
    { return new Infix(name, lst2arr(e1), lst2arr(e2)); }
  / BEGIN_MATRIX   m:(array/matrix) END_MATRIX
    { return new Matrix("matrix", lst2arr(m)); }
  / BEGIN_PMATRIX  m:(array/matrix) END_PMATRIX
    { return new Matrix("pmatrix", lst2arr(m)); }
  / BEGIN_BMATRIX  m:(array/matrix) END_BMATRIX
    { return new Matrix("bmatrix", lst2arr(m)); }
  / BEGIN_BBMATRIX m:(array/matrix) END_BBMATRIX
    { return new Matrix("Bmatrix", lst2arr(m)); }
  / BEGIN_VMATRIX  m:(array/matrix) END_VMATRIX
    { return new Matrix("vmatrix", lst2arr(m)); }
  / BEGIN_VVMATRIX m:(array/matrix) END_VVMATRIX
    { return new Matrix("Vmatrix", lst2arr(m)); }
  / BEGIN_ARRAY    opt_pos m:array END_ARRAY
    { return new Matrix("array", lst2arr(m)); }
  / BEGIN_ALIGN    opt_pos m:matrix END_ALIGN
    { return new Matrix("aligned", lst2arr(m)); }
  / BEGIN_ALIGNED  opt_pos m:matrix END_ALIGNED // parse what we emit
    { return new Matrix("aligned", lst2arr(m)); }
  / BEGIN_ALIGNAT  m:alignat END_ALIGNAT
    { return new Matrix("alignedat", lst2arr(m)); }
  / BEGIN_ALIGNEDAT m:alignat END_ALIGNEDAT // parse what we emit
    { return new Matrix("alignedat", lst2arr(m)); }
  / BEGIN_SMALLMATRIX m:(array/matrix) END_SMALLMATRIX
    { return new Matrix("smallmatrix", lst2arr(m)); }
  / BEGIN_CASES    m:matrix END_CASES
    { return new Matrix("cases", lst2arr(m)); }
  / "\\begin{" alpha+ "}" /* better error messages for unknown environments */
    { throw new peg$SyntaxError("Illegal TeX function", [], text(), location()); }
  / f:generic_func &{ return !tu.all_functions[f]; }
    { throw new peg$SyntaxError("Illegal TeX function", [], f, location()); }


// "array" requires mandatory column specification
array
  = cs:column_spec m:matrix
    {
        if (m.length ) {
            m.first().first().unshift(cs);
            return m;
        }
        return new TexArray(new TexArray(cs));
    }

// "alignat" requires mandatory # of columns
alignat
  = as:alignat_spec m:matrix
    { m.first().first().unshift(as); return m; }

// "matrix" does not require column specification
matrix
  = l:line_start tail:( NEXT_ROW m:matrix { return m; } )?
    { return new TexArray( lst2arr(l), tail ); }
line_start
  = f:HLINE l:line_start
    {
        if (typeof l.first() === 'undefined' ) {
            l.push(new TexArray())
        }
        l.first().unshift(new Literal(f + " ")); return l;}
  / line
line
  = e:expr tail:( NEXT_CELL l:line { return l; } )?
    { return new TexArray(e, tail); }

column_spec
  = CURLY_OPEN cs:(one_col+ { return text(); }) CURLY_CLOSE
    { return new Curly(new TexArray(new Literal(cs))); }

one_col
  = [lrc] _
  / "p" CURLY_OPEN boxchars+ CURLY_CLOSE
  / "*" CURLY_OPEN [0-9]+ _ CURLY_CLOSE
     ( one_col
     / CURLY_OPEN one_col+ CURLY_CLOSE
     )
  / "||" _
  / "|" _
  / "@" _ CURLY_OPEN boxchars+ CURLY_CLOSE

alignat_spec
  = CURLY_OPEN num:([0-9]+ { return text(); }) _ CURLY_CLOSE
    { return new Curly(new TexArray(new Literal(num))); }

opt_pos
  = "[" _ [tcb] _ "]" _
  / "" /* empty */

/////////////////////////////////////////////////////////////
// MHCHEM grammar rules
//----------------------------------------------------------


chem_lit
  = CURLY_OPEN e:chem_sentence CURLY_CLOSE               { return new Curly(lst2arr(e)); }

chem_sentence =
    _ p:chem_phrase " " s:chem_sentence                  { return new TexArray(p,new TexArray(new Literal(" "),s)); } /
    _ p:chem_phrase _                                    { return new TexArray(p,new TexArray()); }

chem_phrase =
    m:"(^)"                                              { return new Literal(m); } /
    m:chem_word n:CHEM_SINGLE_MACRO                      { return new ChemWord(m, new Literal(n)); }/
    m:chem_word                                          { return m; } /
    m:CHEM_SINGLE_MACRO                                  { return new Literal(m); } /
    m:"^"                                                { return new Literal(m); }

chem_word =
    m:chem_char n:chem_word_nt                           { return new ChemWord(m, n); } /
    m:CHEM_SINGLE_MACRO n:chem_char_nl o:chem_word_nt    { return new ChemWord(new ChemWord(new Literal(m), n), o); }

chem_word_nt = m:chem_word                               { return m; } /
    ""                                                   { return new Literal(""); }

chem_char =
    m:chem_char_nl                                       { return m;} /
    c:CHEM_LETTER                                        { return new Literal(c) }

chem_char_nl =
    m:chem_script                                        { return m;} /
    CURLY_OPEN c:chem_text CURLY_CLOSE                   { return new Curly(new TexArray(c)); } /
    BEGIN_MATH c:expr END_MATH                           { return new Dollar(lst2arr(c)); }/
    name:CHEM_BOND l:chem_bond                           { return new Fun1(name, l); } /
    m:chem_macro                                         { return m; } /
    c:CHEM_NONLETTER                                     { return new Literal(c) }

chem_bond
 = CURLY_OPEN e:CHEM_BOND_TYPE CURLY_CLOSE               { return new Curly(new TexArray(new Literal(e))); }

chem_script =
    a:CHEM_SUPERSUB b:CHEM_SCRIPT_FOLLOW                 { return new ChemWord(new Literal(a), new Literal(b)); } /
    a:CHEM_SUPERSUB b:chem_lit                           { return new ChemWord(new Literal(a), b); } /
    a:CHEM_SUPERSUB BEGIN_MATH b:expr END_MATH           { return new ChemWord(new Literal(a), new Dollar(lst2arr(b))); }

// TODO \color is a not documented feature of mhchem for MathJax, at the moment named colors are accepted
chem_macro =
    name:CHEM_MACRO_2PU l1:chem_lit "_" l2:chem_lit      { return new ChemFun2u(name, l1, l2); }/ //return new Fun1nb(name, l);
    name:CHEM_MACRO_2PC l1:CHEM_COLOR l2:chem_lit        { return new Fun2(name, l1, l2); } /
    name:CHEM_MACRO_2P l1:chem_lit l2:chem_lit           { return new Fun2(name, l1, l2); } /
    name:CHEM_MACRO_1P l:chem_lit                        { return new Fun1(name, l); }

chem_text = cs:boxchars+                                 { return new Literal(cs.join('')); }
CHEM_COLOR = "{" _ name:alpha+ _ "}" _                   { return new Literal(name.join('')); }

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
boxchars "valid UTF-16 sequences"// match only valid UTF-16 sequences
 = [-0-9a-zA-Z+*,=():\/;?.!\'` \[\]\x80-\ud7ff\ue000-\uffff]
 / l:[\ud800-\udbff] h:[\udc00-\udfff] { return text(); }
//aboxchars = [-0-9a-zA-Z+*,=():\/;?.!\'` ]

BOX
 = b:generic_func &{ return tu.box_functions[b]; } _ "{" cs:boxchars+ "}" _
   { return new Box(b, cs.join('')); }

LITERAL
 = c:( literal_id / literal_mn / literal_uf_lt / "-" / literal_uf_op ) _
   { return c; }
 / f:generic_func &{ return tu.mediawiki_function_names[f]; } _
   c:( "(" / "[" / "\\{" / "" { return " ";}) _
   { return "\\operatorname {" + f.slice(1) + "}" + c; }
 / f:generic_func &{ return tu.nullary_macro[f]; } _ // from Texutil.find(...)
   { return f + " "; }
 / f:generic_func &{ return options.usemathrm && tu.nullary_macro_in_mbox[f]; } _ // from Texutil.find(...)
   { return "\\mathrm {" + f + "} "; }
 / mathrm:generic_func &{ return options.usemathrm && mathrm === "\\mathrm"; } _
   "{" f:generic_func &{ return options.usemathrm && tu.nullary_macro_in_mbox[f]; } _ "}" _
   /* make sure we can parse what we emit */
   { return options.usemathrm && "\\mathrm {" + f + "} "; }
 / f:generic_func &{ return tu.nullary_macro_in_mbox[f]; } _ // from Texutil.find(...)
   { return "\\mbox{" + f + "} "; }
 / mbox:generic_func &{ return mbox === "\\mbox"; } _
   "{" f:generic_func &{ return tu.nullary_macro_in_mbox[f]; } _ "}" _
 /* make sure we can parse what we emit */
  { return "\\mbox{" + f + "} "; }
 / f:(COLOR / DEFINECOLOR)
   { return f; }
 / "\\" c:[, ;!_#%$&] _
   { return "\\" + c; }
 / c:[><~] _
   { return c; }
 / c:[%$] _
   { if(options.oldtexvc) {
    return "\\" + c; /* escape dangerous chars */
    } else {
     throw new peg$SyntaxError("Deprecation: % and $ need to be escaped.", [], text(), location());
    }}

DELIMITER
 = c:( delimiter_uf_lt / delimiter_uf_op / "[" ) _
   { return c; }
 / "\\" c:[{}|] _
   { return "\\" + c; }
 / f:generic_func &{ return tu.other_delimiters1[f]; } _ // from Texutil.find()
   { return f + " "; }
 / f:generic_func &{ return tu.other_delimiters2[f]; } _ // from Texutil.find()
   { var p = peg$parse(tu.other_delimiters2[f]);
     assert.ok(p instanceof TexArray && p.length === 1);
     assert.ok(p.first() instanceof Literal);
     return p.first().arg;
   }

FUN_AR1nb
 = f:generic_func &{ return tu.fun_ar1nb[f]; } _ { return f; }

FUN_AR1opt
 = f:generic_func &{ return tu.fun_ar1opt[f]; } _ "[" _ { return f; }

NEXT_CELL
 = "&" _

NEXT_ROW
 = "\\\\" _

BEGIN
 = "\\begin" _
END
 = "\\end" _

BEGIN_MATRIX
 = BEGIN "{matrix}" _
END_MATRIX
 = END "{matrix}" _
BEGIN_PMATRIX
 = BEGIN "{pmatrix}" _
END_PMATRIX
 = END "{pmatrix}" _
BEGIN_BMATRIX
 = BEGIN "{bmatrix}" _
END_BMATRIX
 = END "{bmatrix}" _
BEGIN_BBMATRIX
 = BEGIN "{Bmatrix}" _
END_BBMATRIX
 = END "{Bmatrix}" _
BEGIN_VMATRIX
 = BEGIN "{vmatrix}" _
END_VMATRIX
 = END "{vmatrix}" _
BEGIN_VVMATRIX
 = BEGIN "{Vmatrix}" _
END_VVMATRIX
 = END "{Vmatrix}" _
BEGIN_ARRAY
 = BEGIN "{array}" _
END_ARRAY
 = END "{array}" _
BEGIN_ALIGN
 = BEGIN "{align}" _
END_ALIGN
 = END "{align}" _
BEGIN_ALIGNED
 = BEGIN "{aligned}" _
END_ALIGNED
 = END "{aligned}" _
BEGIN_ALIGNAT
 = BEGIN "{alignat}" _
END_ALIGNAT
 = END "{alignat}" _
BEGIN_ALIGNEDAT
 = BEGIN "{alignedat}" _
END_ALIGNEDAT
 = END "{alignedat}" _
BEGIN_SMALLMATRIX
 = BEGIN "{smallmatrix}" _
END_SMALLMATRIX
 = END "{smallmatrix}" _
BEGIN_CASES
 = BEGIN "{cases}" _
END_CASES
 = END "{cases}" _

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
 = f:generic_func &{ return tu.big_literals[f]; } _
   { return f; }

FUN_AR1
 = f:generic_func &{ return tu.fun_ar1[f]; } _
   { return f; }
 / f:generic_func &{ return options.oldmhchem && tu.fun_mhchem[f]} _
   { return f; }
 / f:generic_func &{ return tu.other_fun_ar1[f]; } _
   { if (options.oldtexvc) {
        return tu.other_fun_ar1[f];
     } else {
        throw new peg$SyntaxError("Deprecation: \\Bbb and \\bold are not allowed in math mode.", [], text(), location());
       }}

FUN_MHCHEM
 = f:generic_func &{ return tu.fun_mhchem[f]; } _
   { return f; }

FUN_AR2
 = f:generic_func &{ return tu.fun_ar2[f]; } _
   { return f; }

FUN_INFIX
 = f:generic_func &{ return tu.fun_infix[f]; } _
   { return f; }

DECLh
 = f:generic_func &{ return tu.declh_function[f]; } _
   { return new Declh(f, new TexArray()); }

FUN_AR2nb
 = f:generic_func &{ return tu.fun_ar2nb[f]; } _
   { return f; }

LEFT
 = f:generic_func &{ return tu.left_function[f]; } _

RIGHT
 = f:generic_func &{ return tu.right_function[f]; } _

HLINE
 = f:generic_func &{ return tu.hline_function[f]; } _
   { return f; }

COLOR
 = f:generic_func &{ return tu.color_function[f]; } _ cs:COLOR_SPEC
   { return f + " " + cs; }

DEFINECOLOR
 = f:generic_func &{ return tu.definecolor_function[f]; } _
   "{" _ name:alpha+ _ "}" _ "{" _
     a:( "named"i _ "}" _ cs:COLOR_SPEC_NAMED { return "{named}" + cs; }
       / "gray"i  _ "}" _ cs:COLOR_SPEC_GRAY  { return "{gray}" + cs; }
       / "rgb"    _ "}" _ cs:COLOR_SPEC_rgb   { return "{rgb}" + cs; }
       // Note that we actually convert RGB format to rgb format here.
       / "RGB"    _ "}" _ cs:COLOR_SPEC_RGB   { return "{rgb}" + cs; }
       / "cmyk"i  _ "}" _ cs:COLOR_SPEC_CMYK  { return "{cmyk}" + cs; } )
   { return f + " {" + name.join('') + "}" + a; }

COLOR_SPEC
 = COLOR_SPEC_NAMED
 / "[" _ "named"i _ "]" _ cs:COLOR_SPEC_NAMED
   { return "[named]" + cs; }
 / "[" _ "gray"i _ "]" _ cs:COLOR_SPEC_GRAY
   { return "[gray]" + cs; }
 / "[" _ "rgb"  _ "]" _ cs:COLOR_SPEC_rgb
   { return "[rgb]" + cs; }
 / "[" _ "RGB"  _ "]" _ cs:COLOR_SPEC_RGB
   // Note that we actually convert RGB format to rgb format here.
   { return "[rgb]" + cs; }
 / "[" _ "cmyk"i _ "]" _ cs:COLOR_SPEC_CMYK
   { return "[cmyk]" + cs; }

COLOR_SPEC_NAMED
 = "{" _ name:alpha+ _ "}" _
   { return "{" + name.join('') + "}"; }
COLOR_SPEC_GRAY
 = "{" _ k:CNUM + "}"
   { return "{"+k+"}"; }
COLOR_SPEC_rgb
 = "{" _ r:CNUM "," _ g:CNUM "," _ b:CNUM "}" _
   { return "{"+r+","+g+","+b+"}"; }
COLOR_SPEC_RGB
 = "{" _ r:CNUM255 "," _ g:CNUM255 "," _ b:CNUM255 "}" _
   // Note that we normalize the values to [0,1] here.
   { return "{"+r+","+g+","+b+"}"; }
COLOR_SPEC_CMYK
 = "{" _ c:CNUM "," _ m:CNUM "," _ y:CNUM "," _ k:CNUM "}" _
   { return "{"+c+","+m+","+y+","+k+"}"; }

// An integer in [0, 255] => normalize it to [0,1]
CNUM255
 = n:$( "0" / ([1-9] ([0-9] [0-9]?)? ) ) &{ return parseInt(n, 10) <= 255; } _
   { return n / 255; }

// A floating-point number in [0, 1]
CNUM
 = n:$( "0"? "." [0-9]+ ) _
   { return n; }
 / n:$( [01] "."? ) _
   { return n; }


// MHCHEM LEXER RULES
CHEM_SINGLE_MACRO
 = f:generic_func &{ return tu.mhchem_single_macro[f]; } { return f; }
 / "\\" c:[, ;!_#%$&] { return "\\" + c; }

CHEM_BOND = f:generic_func &{ return tu.mhchem_bond[f]; } _ { return f; }

CHEM_MACRO_1P = f:generic_func &{ return tu.mhchem_macro_1p[f]; } _   { return f; }

CHEM_MACRO_2P = f:generic_func &{ return tu.mhchem_macro_2p[f]; } _   { return f; }

CHEM_MACRO_2PU = f:generic_func &{ return tu.mhchem_macro_2pu[f]; } _ { return f; }

CHEM_MACRO_2PC = f:generic_func &{ return tu.mhchem_macro_2pc[f]; } _ { return f; }

CHEM_SCRIPT_FOLLOW = literal_mn / literal_id / [+-.*']

CHEM_SUPERSUB = "_" / "^"

CHEM_BOND_TYPE = "=" / "#" / "~--" / "~-"  / "~=" / "~" / "-~-" / "...." / "..." / "<-" / "->" / "-" / "1" / "2" / "3"


// As '$' cannot be used (dangerous char in math mode) to switch from chem mode to math mode
// \begin{math} and \end{math} are introduced to do so
BEGIN_MATH = BEGIN "{math}" _

END_MATH = END "{math}" _

CHEM_LETTER = [a-zA-Z]

CHEM_NONLETTER =
    c: "\\{" { return c; } /
    c: "\\}" { return c; } /
    c: "\\\\" { return c; } /
    c:[+-=#().,;/*<>|@&\'\[\]] { return c; } /
    c:literal_mn { return c; } /
    CURLY_OPEN CURLY_CLOSE { return "{}"; }

// Missing lexer tokens!
FUN_INFIXh = impossible
FUN_AR1hl = impossible
FUN_AR1hf = impossible
FUN_AR2h = impossible
impossible = & { return false; }

// End of file
EOF = & { return peg$currPos === input.length; }
