import { resolve, sep } from 'path';
import * as fs from 'fs';
import { props, rewritableMethods, proxyableMethods } from './methods-props.js';
export default function mountFromFs(rewrites) {
  const resolvedRewrites = [];

  for (const [from, to] of rewrites) {
    resolvedRewrites.push([resolve(from), resolve(to)]);
  }

  let lfs = {}; // Attach some props.

  for (const prop of props) lfs[prop] = fs[prop]; // Rewrite the path of the selected methods.


  for (const method of rewritableMethods) {
    const func = fs[method];
    if (typeof func !== 'function') continue;

    lfs[method] = (...args) => {
      const path = args[0]; // If first argument is not a path, just proxy the function.

      if (typeof path !== 'string' && !Buffer.isBuffer(path)) {
        if (!require('url').URL || !(path instanceof require('url').URL)) return func.apply(fs, args);
      } // Rewrite the path argument.


      let filename = resolve(String(path));
      let rewritten = false;

      for (const [from, to] of resolvedRewrites) {
        if (!filename.startsWith(to)) continue;
        const rootRegex = /(^[a-zA-Z]:\\$)|(^\/$)/; // C:\ vs /

        const isRoot = to.match(rootRegex);
        const baseRegex = '^(' + to.replace(/\\/g, '\\\\') + ')';

        if (isRoot) {
          const regex = new RegExp(baseRegex);
          filename = filename.replace(regex, () => from + sep);
        } else {
          const regex = new RegExp(baseRegex + '(\\\\|\/|$)');
          filename = filename.replace(regex, (match, p1, p2) => from + p2);
        }

        rewritten = true;
      }

      if (!rewritten) return func.apply('/not-an-existing-file', args);
      args[0] = filename;
      return func.apply(fs, args);
    };
  } // Just proxy the rest of the methods.


  for (const method of proxyableMethods) {
    const func = fs[method];
    if (typeof func !== 'function') continue;
    lfs[method] = func.bind(fs);
  }

  return lfs;
}