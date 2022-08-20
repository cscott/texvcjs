'use strict';
const Fun1 = require('./fun1');
class Mhchem extends Fun1 {

    extractIdentifiers() {
        return [];
    }

    inCurlies() {
        return '{' +  this.render() + '}';
    }
    get name() {
        return 'MHCHEM';
    }
}
module.exports = Mhchem;
