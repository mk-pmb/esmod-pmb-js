import 'usnam-pmb';

import isFunc from 'is-fn';
import eq from 'equal-pmb';
import dfOnly from './default-export-only.node.js';
import named from './named-exports-only.node.js';
import mixed from './usage.node.js';

eq(dfOnly, { isDefaultExport: true, bar: 5 });
eq(named, { answer: 42, foo: 23 });
eq(mixed, { answer: 42, default: dfOnly, foo: 23 });
eq(isFunc(eq), true);
