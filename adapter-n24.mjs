import nodeFs from 'node:fs';
import nodeModuleLib from 'node:module';

import defaultReexportOpt from './dfReexOpt-n24.js';
import pkgInfo from './package.json' with { type: 'json' };

const logTag = '[' + pkgInfo.name + ']';

const cwarn = console.warn.bind(console, logTag, 'W:');
// cwarn('adapter-n24 init @', process.cwd(),  process.argv);


const EX = function esmStub(bridgeModule) {
  function esmRqr(id, ...unsupp) {
    if (unsupp.length) {
      cwarn('The unsupported esmRqr options are:', unsupp);
      const msg = 'No esmRqr options supported in this node.js version.';
      throw new Error(logTag + ' ' + msg);
    }
    // cwarn('esmRqr', [id, ...unsupp], Object.keys(bridgeModule));
    try {
      // cwarn('D: esmRqr: importing:', id, 'for', bridgeModule.id);
      if (id === bridgeModule.id) {
        throw new Error('Module is trying to directly import itself: ' + id);
      }
      const impl = bridgeModule.require(id);
      // cwarn('D: esmRqr: imported', id, impl);
      if ((impl && typeof impl) !== 'object') { return impl; }
      if (id.endsWith('.json')) {
        if (Array.isArray(impl)) { return [...impl]; }
        return { ...impl };
      }
      return impl;
    } catch (err) {
      err.moduleId = id;
      throw err;
    }
  }
  return esmRqr;
};


EX.getDefaultConfig = Object.bind(null, defaultReexportOpt);



nodeModuleLib.registerHooks({
  load(url, context, defaultLoad) {
    const ctx = { ...context };
    // cwarn('D: "load" hook:', { url, ...ctx });
    const attr = ctx.importAttributes || false;
    if ((!attr.type) && url.startsWith('file://')) {
      const filePath = url.slice(7).split(/\?|#/)[0];
      if (ctx.format === 'json') {
        if (filePath.endsWith('.json')) {
          try {
            const data = JSON.parse(nodeFs.readFileSync(filePath));
            return {
              source: JSON.stringify(data),
              shortCircuit: true,
              format: 'json',
            };
          } catch (errLoadJson) {
            errLoadJson.filePath = filePath;
            cwarn('Loading JSON failed!',
              'Trying with regular loader, which will probably fail.',
              errLoadJson);
          }
        }
      }
    }
    try {
      const impl = defaultLoad(url, ctx);
      const preview = { url, ...ctx, ...impl };
      preview.source = String(impl.source || '').slice(0, 256);
      // console.debug(logTag, 'D:', 'defaultLoad(', url, ') =->', preview);
      return impl;
    } catch (errDfLoad) {
      errDfLoad.loaderContext = ctx;
      throw errDfLoad;
    }
  },
});



export default EX;
