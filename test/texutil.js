'use strict';
const Texutil = require('../lib/texutil');
const fs = require('fs');
const crypto = require('crypto');
const assert = require('assert');


describe('texutil to json', function () {
    it('should be idempotent', function () {


        const out = {};

        const sets = [
            'ams_required',
            'big_literals',
            'box_functions',
            'cancel_required',
            'color_function',
            'color_required',
            'declh_function',
            'definecolor_function',
            'euro_required',
            'fun_ar1',
            'fun_ar1nb',
            'fun_ar1opt',
            'fun_ar2',
            'fun_ar2nb',
            'fun_infix',
            'fun_mhchem',
            'hline_function',
            'ignore_identifier',
            'latex_function_names',
            'left_function',
            'mediawiki_function_names',
            'mhchem_bond',
            'mhchem_macro_1p',
            'mhchem_macro_2p',
            'mhchem_macro_2pc',
            'mhchem_macro_2pu',
            'mhchem_required',
            'mhchem_single_macro',
            'nullary_macro',
            'nullary_macro_in_mbox',
            'other_delimiters1',
            'other_delimiters2',
            'right_function',
            'teubner_required',
            'stix_required'
        ];
        sets.forEach(set => Object.entries(Texutil[set]).forEach(([key, value]) => {
            if (out[key] === undefined) {
                out[key] = {}
            }
            out[key][set] = value
        }))
        const maps = [
            'deprecated_nullary_macro_aliase',
            'nullary_macro_aliase',
            'other_delimiters2',
            'other_fun_ar1',
            'is_literal',
            'is_letter_mod'
        ];
        maps.forEach(map =>
            Object.entries(Texutil[map]).forEach(([key, value]) => {
                if (out[key] === undefined) {
                    out[key] = {}
                }
                out[key][map] = value
            })
        )
        const sortObject = (o) => Object.keys(o).sort().reduce(
            (r, k) => (r[k] = typeof o[k] === 'object' ?
                sortObject(o[k]) :
                o[k], r), {});
        const sorted = sortObject(out);
        const getHash = function (fileBuffer) {
            const hashSum = crypto.createHash('sha256');
            hashSum.update(fileBuffer);
            return hashSum.digest('hex');
        };
        const fileBuffer = fs.readFileSync('lib/texutil.json');
        const oldHash = getHash(fileBuffer);
        const newHash = getHash(JSON.stringify(sorted, null, 2) + '\n');
        // assert.equal(fileBuffer.toString(),JSON.stringify(sorted, null, 2) + '\n' )
        assert.equal(oldHash, newHash);
    });
})
