/*jslint indent: 2, maxlen: 80, node: true */
'use strict';

var EX, stdEsm = require('esm'), esmApi = require('./esm-api.js'),
  defaultReexportOpt = require('./dfReexOpt-n16.js'),
  objHas = Object.prototype.hasOwnProperty;


function cleanupEsmOpt(opt) {
  var clean = {};
  function copy(key) {
    if (objHas.call(opt, key)) { clean[key] = opt[key]; }
  }
  esmApi.coreOptNames.forEach(copy);
  esmApi.devOptNames.forEach(copy);
  if (opt.esm) {
    // backwards-compat to @std/esm v0.21.1
    if (opt.mode) { throw new Error('Conflicting options: mode vs. esm'); }
    clean.mode = opt.esm;
    if (clean.mode === 'js') { clean.mode = 'auto'; }
  }
  return clean;
}


EX = function stdEsmAdapter(bridgeModule, opt) {
  return stdEsm(bridgeModule, cleanupEsmOpt(opt));
};


EX.getDefaultConfig = Object.bind(null, defaultReexportOpt);


module.exports = EX;
