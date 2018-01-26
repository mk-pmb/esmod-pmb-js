
<!--#echo json="package.json" key="name" underline="=" -->
esmod-pmb
=========
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Use @std/esm (ES modules, import, export for Node v6) with less boilerplate.
<!--/#echo -->


Usage
-----

Assuming you have an ES module like [test/usage.mjs](test/usage.mjs),

<!--#include file="test/usage.mjs" code="javascript" -->
<!--#verbatim lncnt="5" -->
```javascript
import reex from '../reexport.js';
export const guessMjsFile = reex.guessMjsFile;
export const answer = 42;
```
<!--/include-->

a bridge module that re-exports the MJS exports via `@std/esm`
can be as simple as this:

<!--#include file="test/usage.node.js" code="javascript" -->
<!--#verbatim lncnt="3" -->
```javascript
require('esmod-pmb')(module);
```
<!--/include-->

… if you name it [test/usage.node.js](test/usage.node.js)
or something other from which [reexport.js](reexport.js)
can guess the `*.mjs` filename:

```bash
$ nodejs -p "require('./test/usage.node.js')"
{ guessMjsFile: [Getter], answer: [Getter], default: [Getter] }
$ nodejs -p "Object.assign({}, require('./test/usage.node.js'))"
{ guessMjsFile: [Function],
  answer: 42,
  default: { nodeVersion: '6.12.3' } }
```





<!--#toc stop="scan" -->



Known issues
------------

* Needs more/better tests and docs.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
