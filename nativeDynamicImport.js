/*jslint indent: 2, maxlen: 80, node: true, evil: true */
/* -*- tab-width: 2 -*- */
'use strict';
var ndi;

try {
  eval("ndi = { func: function nativeImport(id) { return import(id); } };");
} catch (nope) {
  ndi = { err: nope };
}

module.exports = ndi;
