/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
'use strict';

var dfOpt, envOpt = require('./envOpt.js');


dfOpt = Object.freeze({
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

  stripSuffixes: /(?:[\.\-](?:c?js|common|node|bridge))+$/, /*
    Never freeze a RegExp: Everyhing already is read-only, except for
    lastIndex, which might break /g or /y flag matches. In this case here,
    we use neither, so not freezing doesn't matter anyway. */

  addSuffix: '.mjs',
  preferDefaultExport: 1,
  resolveImportedValues: true,
  reexport: true,
  debug: (envOpt.debugEsm >= 1),
});


module.exports = dfOpt;
