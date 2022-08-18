'use strict';
const Fun2 = require('./fun2');

class Fun2nb extends Fun2 {

    inCurlies() {
        return '{' + this.render() + '}';
    }

    render() {
        return this.fname +
            ' ' + this.arg1.inCurlies() +
            this.arg2.inCurlies();
    }
}

module.exports = Fun2nb;
