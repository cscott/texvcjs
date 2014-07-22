# texvcjs
[![NPM][NPM1]][NPM2]

[![Build Status][1]][2] [![dependency status][3]][4] [![dev dependency status][5]][6]

A TeX/LaTeX validator.

`texvcjs` takes user input and validates it while replacing
MediaWiki-specific functions.  It is a JavaScript port of [texvc].

It was written for the [mw-ocg-latexer] PDF-generation backend of
the mediawiki [Offline Collection Generator] extension.

## Installation

Node version 0.8 and 0.10 are tested to work.

Install the node package depdendencies with:
```
npm install
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

## License

Copyright (c) 2014 C. Scott Ananian

Licensed under GPLv2.

[mw-ocg-latexer]: https://github.com/wikimedia/mediawiki-extensions-Collection-OfflineContentGenerator-latex_renderer

[NPM1]: https://nodei.co/npm/texvcjs.svg
[NPM2]: https://nodei.co/npm/texvcjs/

[1]: https://travis-ci.org/cscott/texvcjs.svg
[2]: https://travis-ci.org/cscott/texvcjs
[3]: https://david-dm.org/cscott/texvcjs.svg
[4]: https://david-dm.org/cscott/texvcjs
[5]: https://david-dm.org/cscott/texvcjs/dev-status.svg
[6]: https://david-dm.org/cscott/texvcjs#info=devDependencies