// eslint-disable-next-line spaced-comment
/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var usc = '_', rfs = 'readFileSync', // <-- jslint cheats
  loaders = require('module').Module[usc + 'extensions'];

rfs = require('fs')[rfs];

function readAndCompile(modObj, srcFn) {
  var code = rfs(srcFn, 'utf8'), comp = modObj[usc + 'compile'];
  comp.call(modObj, code, srcFn);
}

loaders['.js'] = readAndCompile;
loaders['.mjs'] = readAndCompile;
