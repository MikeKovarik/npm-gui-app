// Second seg of ugly hack.
// It's hella hard trying to write isomorphic code, let alone witing it in ESM.
// Node supports ES modules with .mjs extension and they can import another ESM .mjs or CJS .js modules.
// Then there are browsers which can import ESM with any extension but the can't import any classic scripts,
// let alone CJS or UMD with exports. And above all else browsers don't have any module registry so making
// `import path from 'path'` work in browser is impossible.
// It should get easier once dust settles on Nodes implementation and browser's registry but for now we're
// subjected to hack. Though they're all within reason.
import './platform-polyfill.js'

export var fetch = global.fetch
export var fs    = global.fs
