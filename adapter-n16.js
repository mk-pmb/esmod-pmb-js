/*jslint indent: 2, maxlen: 80, node: true */
'use strict';

var EX, stdEsm = require('esm'), esmApi = require('./esm-api.js'),
  envOpt = require('./envOpt.js'),
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


EX.getDefaultConfig = Object.bind(null, Object.freeze({
  mode: 'auto',
  cjs: Object.freeze({
    // namedExports: true,  // <- seems to have no effect anyway
    // interop: true,       // <- seems to have no effect anyway

    paths: true,  // support old-school node path rules…
    // NB: … but in *.js only. Not a bug, just red tape (upstream issue 582,
    //    https://github.com/standard-things/esm/issues/582).
    //    One stopgap to make it work with .mjs would be to do ALL
    //    module resolving ourselves (https://git.io/fAOyA)
    //    but I'll rather research a less intrusive fallback approach
    //    some day. Beat me to the draw with your PR!
  }),
  stripSuffixes: /(?:[\.\-](?:c?js|common|node|bridge))+$/,
  addSuffix: '.mjs',
  preferDefaultExport: 1,
  resolveImportedValues: true,
  reexport: true,
  debug: (envOpt.debugEsm >= 1),
}));


module.exports = EX;
