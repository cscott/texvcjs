'use strict';
const Fun2 = require('./fun2');

class Fun2sq extends Fun2 {

    inCurlies() {
        return this.render();
    }

    render() {
        return '{' + this.fname +
            '[' + this.arg1.render() + ']' +
            this.arg2.inCurlies() + '}';
    }

    /* istanbul ignore next */
    get name() {
        return 'FUN2sq';
    }
}

module.exports = Fun2sq;
