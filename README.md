# texvcjs

[![NPM][NPM1]][NPM2]

A TeX/LaTeX validator. 

`texvcjs` takes user input and validates it while replacing
MediaWiki-specific functions.  It is a JavaScript port of [texvc],
which was originally written in [OCaml] for the [Math extension].

The `texvcjs` library was originally written to be used by the
[mw-ocg-latexer] PDF-generation backend of the mediawiki
[Collection extension].

`texvcjs` also makes it possible to print the identified texvc tokens.
Moreover, it provides additional information on the input such as
* listing the identifiers;
* discovering if the expressions ends with a dot.

## Installation

Node version 10, 12 and 15 are tested to work.

Install the node package dependencies with:
```
npm install
```
Ensure everything works:
```
npm test
```

## Running

To test your installation:
```sh
bin/texvcjs '\sin(x)+{}{}\cos(x)^2 newcommand'
```
which should emit:
```
+\sin(x)+{}{}\cos(x)^{2}newcommand
```

To test the info functionalities, run texvcjs with the info flag:
```
./bin/texvcjs --info -o json \\frac12 > ./vis/data.json
```


## API

Your programs can also use the JavaScript API exported by the
`texvcjs` node module:
```js
var texvcjs = require('texvcjs');

var result = texvcjs.check('\\sin(x)+{}{}\\cos(x)^2 newcommand');
console.log(result.status);
console.log(result.output || ''); // cleaned/validated output
```

If the `output` field is not `undefined`, then validation was successful.

The `status` field is a single character:
* `+`: Success! The result is in the `output` field.
* `F`: A TeX function was not recognized.  The function name is in the
  `details` field.
* `S`: A parsing error occurred.
* `-`: Some other problem occurred.

For status types `F`, `S`, and `-`, the position of the error may be found
in the `line`, `column` and `offset` fields of the result.  More information
about the problem can be found in the `details` field of the result, which
is a string.

The fields `ams_required`, `cancel_required`, `color_required`,
`euro_required`, and `teubner_required` are set to `true` iff the input
string requires the use of the corresponding [LaTeX packages].
The `ams_required` field requires the use of the `amsmath` and `amssymb`
packages.

## mhchem

To use the `\ce` tags from the mhchem package the parser needs to be called
with the mhchem option. During the parsing if a `\ce` tag is encountered
its contens is treated according to the [mhchem grammar]. The parsing in
general and the building up of the AST is done in a similar fashion to the
math mode but preserves the whitespaces when needed.

As the design of the parser does not allow the usage of the dollar sign in
the math mode the tags `\begin{math}` and `\end{math}` were introduced to 
provide the ability to switch to math mode within a chemical formula. The
undocumented `\color` tag of mhchem is only supported for named colors. 
The full documentation of the mhchem package can be found on the 
[mhchem website].

### Examples:
This example would be typeset wrongly without the extended parser as some
charges would be typeset as bonds and some addition signs would end up as 
charges. Running:
```sh
bin/texvcjs  --usemhchem '\ce{2Na + 2H2O -> 2Na+ + 2OH- + H-H}'
```
emits:
```
+{\ce {2Na + 2H2O -> 2Na+ + 2OH- + H-H}}
```
More examples can be found on the [mhchem website].

## License

Copyright (c) 2014-2022 C. Scott Ananian, Moritz Schubotz, Johannes Stegmüller

Licensed under GPLv2.

[mw-ocg-latexer]: https://github.com/wikimedia/mediawiki-extensions-Collection-OfflineContentGenerator-latex_renderer
[texvc]: https://phabricator.wikimedia.org/diffusion/EMAT/browse/REL1_23/texvccheck/README
[Math extension]: https://www.mediawiki.org/wiki/Extension:Math
[Collection extension]: https://www.mediawiki.org/wiki/Extension:Collection
[OCaml]: https://ocaml.org/
[LaTeX packages]: http://www.ctan.org/

[mhchem grammar]: https://raw.githubusercontent.com/mhchem/MathJax-mhchem-validity-syntax/master/mhchem-strict-simplified.grm
[mhchem website]: https://mhchem.github.io/MathJax-mhchem/

[NPM1]: https://nodei.co/npm/mathoid-texvcjs.png
[NPM2]: https://nodei.co/npm/mathoid-texvcjs/
