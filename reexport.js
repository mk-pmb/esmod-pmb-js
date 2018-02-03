/*jslint indent: 2, maxlen: 80, node: true */
'use strict';

var EX, stdEsm = require('@std/esm'), dfOpt,
  objHas = Object.prototype.hasOwnProperty;

dfOpt = {
  esm: 'js',
  cjs: {
    // namedExports: true,  // <- seems to have  no effect anyway
    // interop: true,       // <- seems to have  no effect anyway
  },
  stripSuffixes: /(?:[\.\-](?:c?js|common|node|bridge))+$/,
  addSuffix: '.mjs',
  preferDefaultExport: 1,
  reexport: true,
};


function ifObj(x, d) { return ((x && typeof x) === 'object' ? x : d); }

function subObAss(dest, prop, src) {
  var ass = Object.assign({}, (src || dfOpt)[prop], dest[prop]);
  dest[prop] = ass;
  return ass;
}

function optimizeOpts(origOpts) {
  if (!origOpts) { return dfOpt; }
  var opt = Object.assign({}, dfOpt, origOpts);
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



EX = function esmBridge(bridgeModule, opt) {
  opt = optimizeOpts(opt);
  var esmRequire = stdEsm(bridgeModule, opt), mjsFn, esMod;
  if (opt.reexport) {
    mjsFn = EX.guessMjsFile(bridgeModule, opt);
    esMod = checkPreferDefault(esmRequire(mjsFn), opt);
    bridgeModule.exports = esMod;
  }
  return esmRequire;
};
EX.defaultConfig = dfOpt;


EX.guessMjsFile = function (cjsMod, opt) {
  return (replaceIfRx((cjsMod.filename || cjsMod), opt.stripSuffixes
    ) + (opt.addSuffix || ''));
};






module.exports = EX;
