
<!--#echo json="package.json" key="name" underline="=" -->
esmod-pmb
=========
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Use @std/esm (ES modules, import, export for Node v6) with less boilerplate.
<!--/#echo -->


Usage
-----

Let's assume you have an ES module like [`usage.mjs`](test/usage.mjs):

<!--#include file="test/usage.mjs" code="javascript" -->
<!--#verbatim lncnt="7" -->
```javascript
import dfOnly from './default-export-only.mjs';
import * as named from './named-exports-only.mjs';

export default dfOnly;
export const { foo, answer } = named;
```
<!--/include-->

… and you want to use it from old node's CommonJS realm.
The `@std/esm` module can do it:

```javascript
module.exports = require('@std/esm')(module)('./usage.mjs')
```

But that's still a bit too much boilerplate for my taste.
Don't waste your time micro-managing the filename
and whether you should add `.default` to the above formula!
There's a much easier way:

Make a bridge module with almost the same name,
except it ends with `.node.js` instead of `.mjs`
(thus here, [`usage.node.js`](test/usage.node.js)):

<!--#include file="test/usage.node.js" code="javascript" -->
<!--#verbatim lncnt="3" -->
```javascript
require('esmod-pmb')(module);
```
<!--/include-->

It should work out of the box:

```bash
$ nodejs -p "require('./usage.node.js')"
{ foo: [Getter], answer: [Getter], default: [Getter] }
```

To see values instead of getters, copy them to another object:

```bash
$ nodejs -p "Object.assign({}, require('./usage.node.js'))"
{ foo: 23,
  answer: 42,
  default: { isDefaultExport: true, bar: 5 } }
```

For modules that have a default export and no named exports,
like [`default-export-only.mjs`](test/default-export-only.mjs):

<!--#include file="test/default-export-only.mjs" code="javascript" -->
<!--#verbatim lncnt="3" -->
```javascript
export default { isDefaultExport: true, bar: 5 };
```
<!--/include-->

… your bridge module will export that as the top level:

```bash
$ nodejs -p "require('./default-export-only.node.js')"
{ isDefaultExport: true, bar: 5 }
$ nodejs -p "require('@std/esm')(module)('./default-export-only.mjs')"
{ default: [Getter] }
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
