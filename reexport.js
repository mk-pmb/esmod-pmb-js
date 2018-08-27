/*jslint indent: 2, maxlen: 80, node: true */
'use strict';

var EX, stdEsm = require('esm'), dfOpt,
  esmVer = require('esm/package.json').version,
  esmApi = require('./esm-api.js'),
  obAss = Object.assign, objHas = Object.prototype.hasOwnProperty;

dfOpt = {
  mode: 'auto',
  cjs: {
    // namedExports: true,  // <- seems to have no effect anyway
    // interop: true,       // <- seems to have no effect anyway
    paths: true,  // support old-school node path rules
  },
  stripSuffixes: /(?:[\.\-](?:c?js|common|node|bridge))+$/,
  addSuffix: '.mjs',
  preferDefaultExport: 1,
  resolveImportedValues: true,
  reexport: true,
};


function ifObj(x, d) { return ((x && typeof x) === 'object' ? x : d); }

function subObAss(dest, prop, src) {
  var ass = obAss({}, (src || dfOpt)[prop], dest[prop]);
  dest[prop] = ass;
  return ass;
}

function optimizeOpts(origOpts) {
  if (!origOpts) { return dfOpt; }
  var opt = obAss({}, dfOpt, origOpts);
  if (opt.cjs !== true) { subObAss(opt, 'cjs'); }
  return opt;
}

function replaceIfRx(s, r, w) { return (r ? s.replace(r, w || '') : s); }

function singleObjectKey(o) {
  var k = Object.keys(o), l = k.length;
  return (l && (l === 1) && k[0]);
}

function checkPreferDefault(mod, opt) {
  if (!ifObj(mod)) { return mod; }
  var prefer = opt.preferDefaultExport;
  if (!prefer) { return mod; }
  if (!objHas.call(mod, 'default')) { return mod; }
  if (prefer === 1) {
    return (singleObjectKey(mod) === 'default' ? mod.default : mod);
  }
  if (prefer === true) { return mod.default; }
  return mod;
}


function fixEsmOpt(opt) {
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


EX = function esmBridge(bridgeModule, opt) {
  opt = optimizeOpts(opt);
  var fixedOpts = fixEsmOpt(opt), esmRqr, mjsFn, esMod, expo;
  console.debug({
    stdEsmVersion: esmVer,
    node: {
      version: process.versions.node,
      platform: process.platform,
      arch: process.arch,
    },
    effectiveStdEsmOpts: fixedOpts,
  });
  esmRqr = stdEsm(bridgeModule, fixedOpts);
  if (opt.reexport) {
    mjsFn = EX.guessMjsFile(bridgeModule, opt);
    esMod = esmRqr(mjsFn);
    expo = checkPreferDefault(esMod, opt);
    if (ifObj(expo) && opt.resolveImportedValues) { expo = obAss({}, expo); }
    bridgeModule.exports = expo;
  }
  return esmRqr;
};
EX.defaultConfig = dfOpt;


EX.guessMjsFile = function (cjsMod, opt) {
  return (replaceIfRx((cjsMod.filename || cjsMod), opt.stripSuffixes
    ) + (opt.addSuffix || ''));
};






module.exports = EX;
