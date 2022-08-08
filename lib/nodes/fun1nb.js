'use strict';
const Fun1 = require('./fun1');
class Fun1nb extends Fun1 {
    get name() {
        return 'FUN1nb';
    }
    inCurlies() {
        return '{' + this.render() + '}';
    }

    render() {
        return  this.fname +
            ' ' + this.arg.inCurlies() + ' ';
    }

}

module.exports = Fun1nb;
