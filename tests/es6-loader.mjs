import path from 'path';
import process from 'process';

const baseURL = new URL('file://');
baseURL.pathname = `${process.cwd()}/`;
const esDir = path.resolve('..');

/* A custom module resolver to load everything in the parent directory (esDir)
 * as an ES6 module.
 */
export function resolve(specifier, parentModuleURL, defaultResolver) {
  const resolvedModule = defaultResolver(specifier, parentModuleURL);

  if (resolvedModule.url.includes(esDir)) {
    resolvedModule.format = 'esm';
  }

  return resolvedModule;
}
