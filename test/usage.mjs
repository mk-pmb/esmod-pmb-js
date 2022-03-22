import dfOnly from './default-export-only.mjs';
import * as named from './named-exports-only.mjs';

export default dfOnly;
export const { foo, answer } = named;
