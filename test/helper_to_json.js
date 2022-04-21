'use strict';
var Texutil = require('../lib/texutil');
var fs = require('fs');
var path = require('path');



describe('Transform texutil to json', function () {
    var out = {}

    var sets = [
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
        'latex_function_names',
        'left_function',
        'mathoid_required',
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
    ]
    sets.forEach(set => Object.entries(Texutil[set]).forEach(([key, value]) => {
        if (out[key] === undefined) {
            out[key] = {}
        }
        out[key][set] = value
    }))
    var maps = [
        'nullary_macro_aliase',
        'deprecated_nullary_macro_aliase',
        'other_delimiters2',
        'other_fun_ar1'
    ]
    maps.forEach(map =>
        Object.entries(Texutil[map]).forEach(([key, value]) => {
            if (out[key] === undefined) {
                out[key] = {}
            }
            out[key][map] = value
        })
    )
    var sorted = Object.keys(out).sort().reduce((r,k)=>(r[k]=out[k],r),{})
    fs.writeFileSync('lib/texutil.json',JSON.stringify( sorted, null, 2))

})
