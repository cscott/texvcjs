"use strict";
var assert = require('assert');
var texvc = require('../');
var lister = require('../lib/d3json');
var testcases = [
    {in: '', out: {name: "ARRAY", children: []}},
    {
        in: 'a',
        out: {
            name: "ARRAY",
            children: [{"name": "LITERAL", "children": [{"name": "a"}]}]
        }
    },
    {
        in: 'a^2', out: {
            name: "ARRAY", children: [{
                "name": "UQ", "children": [{
                    "name": "LITERAL", "children": [{"name": "a"}]
                }, {"name": "LITERAL", "children": [{"name": "2"}]}]
            }]
        }
    },
    {
        in: 'a^2+b^2',
        out: {
            name: "ARRAY", children: [{
                "name": "UQ",
                "children": [{"name": "LITERAL", "children": [{"name": "a"}]},
                    {"name": "LITERAL", "children": [{"name": "2"}]}]
            }, {
                "name": "LITERAL",
                "children": [{"name": "+"}]
            }, {
                "name": "UQ", "children": [{
                    "name": "LITERAL",
                    "children": [{"name": "b"}]
                }, {
                    "name": "LITERAL", "children": [{"name": "2"}]
                }]
            }]
        }
    },
    {
        in: 'a^{2}+b^{2}',
        out: {
            "name": "ARRAY", "children": [{
                "name": "UQ", "children": [{
                    "name": "LITERAL", "children": [{"name": "a"}]
                }, {
                    "name": "CURLY", "children": [{
                        "name": "ARRAY", "children": [{
                            "name": "LITERAL", "children": [{
                                "name": "2"
                            }]
                        }]
                    }]
                }]
            }, {
                "name": "LITERAL", "children": [{
                    "name": "+"
                }]
            }, {
                "name": "UQ", "children": [{
                    "name": "LITERAL", "children": [{
                        "name": "b"
                    }]
                }, {
                    "name": "CURLY", "children": [{
                        "name": "ARRAY", "children": [{
                            "name": "LITERAL", "children": [{"name": "2"}]
                        }]
                    }]
                }]
            }]
        }
    },
    {
        in: '\\frac2b',
        out: {
            name: "ARRAY", children: [{
                "name": "FUN2", "children": [{"name": "\\frac"}, {
                    "name": "LITERAL",
                    "children": [{"name": "2"}]
                },
                    {"name": "LITERAL", "children": [{"name": "b"}]}]
            }]
        }
    },
    {
        in: 'b^2',
        flat: true,
        out: {
            "children":
                {
                    "children": [
                        {
                            "name": "LITERAL->b"
                        },
                        {
                            "name": "LITERAL->2"
                        }
                    ],
                    "name": "UQ"
                },
            "name": "ARRAY"
        }
    }
];

describe('tree2d3json', function () {
    testcases.forEach(function (tc) {
        it('should correctly render ' + JSON.stringify(tc.in), function () {
            assert.deepEqual(lister(texvc.parse(tc.in), tc.flat), tc.out);
        });
    });
});
