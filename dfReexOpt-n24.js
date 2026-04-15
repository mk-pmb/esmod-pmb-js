/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
'use strict';

var dfOpt = Object.assign({}, require('./dfReexOpt-n16.js'));

delete dfOpt.cjs;
delete dfOpt.mode;

Object.freeze(dfOpt);
module.exports = dfOpt;
