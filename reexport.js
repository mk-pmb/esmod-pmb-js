/*jslint indent: 2, maxlen: 80, node: true */
'use strict';

var EX, adapter, pkgName = require('./package.json').name,
  nodeVerNums = process.versions.node.split('.').map(Number),
  envOpt = require('./envOpt.js'),
  obAss = Object.assign, objHas = Object.prototype.hasOwnProperty;

adapter = (function nodeVersionsGate() {
  if (nodeVerNums[0] <= 21) { return require('./adapter-n16.js'); }
  var msg = (pkgName + ' is incompatible with your Node.js version.'
    );
  throw new Error(msg);
}());


function ifObj(x, d) { return ((x && typeof x) === 'object' ? x : d); }

function subObAss(dest, prop, src) {
  var val = dest[prop], dflt = (src || EX.defaultConfig)[prop];
  if (dflt) {
    val = obAss({}, dflt, val);
    dest[prop] = val;
  }
  return val;
}

function optimizeOpts(origOpts) {
  if (!origOpts) { return EX.defaultConfig; }
  var opt = obAss({}, EX.defaultConfig, origOpts);
  if (opt.cjs !== true) { subObAss(opt, 'cjs'); }
  if (envOpt.debugEsm > 9e3) { opt.debug = true; }
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
  var esmRqr, mjsFn, esMod, expo;
  opt = optimizeOpts(opt);
  esmRqr = adapter(bridgeModule, opt);
  if (opt.reexport) {
    mjsFn = EX.guessMjsFile(bridgeModule, opt);
    esMod = esmRqr(mjsFn);
    expo = checkPreferDefault(esMod, opt);
    if (ifObj(expo) && opt.resolveImportedValues) { expo = obAss({}, expo); }
    bridgeModule.exports = expo;
  }
  return esmRqr;
};


EX.defaultConfig = adapter.getDefaultConfig();


EX.guessMjsFile = function (cjsMod, opt) {
  return (replaceIfRx((cjsMod.filename || cjsMod), opt.stripSuffixes
    ) + (opt.addSuffix || ''));
};






module.exports = EX;
