"use strict";
var assert = require('assert');
var texvcinfo = require('../');
var testcases = [
    {
        input: '',
        out: {
            "checked": "",
            "identifiers": [],
            requiredPackages: [],
            "success": true,
            endsWithDot: false
        }
    },
    {
        input: '{\\cos(x).}',
        out: {
            "checked": "{\\cos(x).}",
            "identifiers": ['x'],
            requiredPackages: [],
            endsWithDot: true,
            "success": true
        }
    },
    {
        input: '{\\cos\\left(x.\\right)}',
        out: {
            "checked": "{\\cos \\left(x.\\right)}",
            "identifiers": ['x'],
            requiredPackages: [],
            endsWithDot: false,
            "success": true
        }
    },
    {
        input: '\\mathbb{x}',
        out: {
            "checked": "\\mathbb {x} ",
            "identifiers": [
                "\\mathbb{x}"
            ],
            requiredPackages: ['ams'],
            "success": true,
            endsWithDot: false
        }
    },
    {
        input: 'a+\\badfunc-b',
        out: {
            "column": 3,
            "details": "\\badfunc",
            "error": {
                "expected": [],
                "found": "\\badfunc",
                "location": {
                    "end": {
                        "column": 11,
                        "line": 1,
                        "offset": 10
                    },
                    "start": {
                        "column": 3,
                        "line": 1,
                        "offset": 2
                    }
                },
                "message": "Illegal TeX function",
                "name": "SyntaxError"
            },
            "line": 1,
            "offset": 2,
            "status": "F",
            "success": false,
            "warnings": []
        }
    },
    {
        input: '\\sin\\left(x)',
        out: {
            "line": 1,
            "offset": 12,
            "status": "S",
            "success": false,
            "warnings": [],
            "column": 13,
            "details": "SyntaxError: Expected \"-\", \"[\", \"\\\\\", \"\\\\begin\", \"\\\\begin{\", \"]\", \"^\", \"_\", \"{\", [ \\t\\n\\r], [%$], [().], [,:;?!'], [/|], [0-9], [><~], [\\-+*=], or [a-zA-Z] but end of input found.",
            "error": {
                "message": "Expected \"-\", \"[\", \"\\\\\", \"\\\\begin\", \"\\\\begin{\", \"]\", \"^\", \"_\", \"{\", [ \\t\\n\\r], [%$], [().], [,:;?!'], [/|], [0-9], [><~], [\\-+*=], or [a-zA-Z] but end of input found.",
                "expected": [
                    {
                        "type": "class",
                        "parts": [
                            " ",
                            "\t",
                            "\n",
                            "\r"
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "_",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "^",
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            [
                                "a",
                                "z"
                            ],
                            [
                                "A",
                                "Z"
                            ]
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            [
                                "0",
                                "9"
                            ]
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            ",",
                            ":",
                            ";",
                            "?",
                            "!",
                            "'"
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "-",
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            "-",
                            "+",
                            "*",
                            "="
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "\\",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "\\",
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            ">",
                            "<",
                            "~"
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            "%",
                            "$"
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            "(",
                            ")",
                            "."
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            "/",
                            "|"
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "[",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "\\",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "{",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "\\begin",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "\\begin{",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "]",
                        "ignoreCase": false
                    }
                ],
                "found": null,
                "location": {
                    "start": {
                        "offset": 12,
                        "line": 1,
                        "column": 13
                    },
                    "end": {
                        "offset": 12,
                        "line": 1,
                        "column": 13
                    }
                },
                "name": "SyntaxError"
            }
        }

    },
    {
        input: '\\ce{H2O}',
        options: {usemhchem: true},
        out: {
            "checked": "{\\ce {H2O}}",
            "endsWithDot": false,
            "identifiers": [],
            "requiredPackages": [
                "mhchem"
            ],
            "success": true
        }
    }, {
        input: '\\ce{H2O}',
        out: {
            "error": {
                "detail": "mhchem package required.",
                "found": "\\ce",
                "message": "Attempting to use the $\\ce$ command outside of a chemistry environment.",
                "name": "SyntaxError",
                "status": "C"
            },
            "success": false
        }
    },
    {
        input: '\\ce {\\log}',
        options: {usemhchem: true},
        out: {
            "checked": "{\\ce {\\log }}",
            "endsWithDot": false,
            "identifiers": [],
            "requiredPackages": [
                "mhchem"
            ],
            "success": true,
            "warnings": [
                {
                    "details": {
                        "column": 10,
                        "details": "SyntaxError: Expected [a-zA-Z] but \"}\" found.",
                        "error": {
                            "expected": [
                                {
                                    "ignoreCase": false,
                                    "inverted": false,
                                    "parts": [
                                        [
                                            "a",
                                            "z"
                                        ],
                                        [
                                            "A",
                                            "Z"
                                        ],
                                    ],
                                    "type": "class",
                                }
                            ],
                            "found": "}",
                            "location": {
                                "end": {
                                    "column": 11,
                                    "line": 1,
                                    "offset": 10,
                                },
                                "start": {
                                    "column": 10,
                                    "line": 1,
                                    "offset": 9,
                                },
                            },
                            "message": "Expected [a-zA-Z] but \"}\" found.",
                            "name": "SyntaxError",
                        },
                        "line": 1,
                        "offset": 9,
                        "status": "S",
                        "success": false,
                        "warnings": [],
                    },
                    "type": "mhchem-deprecation"
                }
            ]
        }
    },
    {
        input: '\\ce{a{b^c}}',
        options: {usemhchem: true},
        out: {
            "success": true,
            "checked": "{\\ce {a{b^{c}}}}",
            "requiredPackages": [
                "mhchem"
            ],
            "identifiers": [
                "a",
                "b",
                "c"
            ],
            "endsWithDot": false,
            "warnings": [
                {
                    "details": {
                        "column": 8,
                        "details": "SyntaxError: Expected \"}\" or valid UTF-16 sequences but \"^\" found.",
                        "error": {
                            "expected": [
                                {
                                    "description": "valid UTF-16 sequences",
                                    "type": "other"
                                },
                                {
                                    "ignoreCase": false,
                                    "text": "}",
                                    "type": "literal",
                                },
                            ],
                            "found": "^",
                            "location": {
                                "end": {
                                    "column": 9,
                                    "line": 1,
                                    "offset": 8,
                                },
                                "start": {
                                    "column": 8,
                                    "line": 1,
                                    "offset": 7,
                                }
                            },
                            "message": "Expected \"}\" or valid UTF-16 sequences but \"^\" found.",
                            "name": "SyntaxError",
                        },
                        "line": 1,
                        "offset": 7,
                        "status": "S",
                        "success": false,
                        "warnings": [],
                    },
                    "type": "mhchem-deprecation"
                }
            ]
        }
    }
];

describe('Feedback', function () {
    testcases.forEach(function (tc) {
        var input = tc.input;
        var output = tc.out;
        var options = tc.options;
        it('should give adequate feedback ' + JSON.stringify(input), function () {
            assert.deepEqual(texvcinfo.feedback(input, options), output);
        });
    });
});