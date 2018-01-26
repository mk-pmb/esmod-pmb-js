/*jslint indent: 2, maxlen: 80, node: true */
'use strict';

var EX, stdEsm = require('@std/esm'), dfOpt = {
  esm: 'js',
  cjs: {
    namedExports: false,
  },
  stripSuffixes: /(?:[\.\-](?:c?js|common|node|bridge))+$/,
  addSuffix: '.mjs',
};


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


EX = function esmBridge(bridgeModule, opt) {
  opt = optimizeOpts(opt);
  var esmRequire = stdEsm(bridgeModule, opt),
    mjsFn = EX.guessMjsFile(bridgeModule, opt),
    esMod = esmRequire(mjsFn);
  bridgeModule.exports = esMod;
  return esmRequire;
};
EX.defaultConfig = dfOpt;


EX.guessMjsFile = function (cjsMod, opt) {
  return (replaceIfRx((cjsMod.filename || cjsMod), opt.stripSuffixes
    ) + (opt.addSuffix || ''));
};






module.exports = EX;
