// Ref https://medium.com/javascript-in-plain-english/bundling-monorepos-the-right-way-34116aa50433
import path from 'path';

import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

import minimist from 'minimist';

import { IIFEOutputName, getSortedPackages } from './utils';

async function main() {
  const config = [];
  // Support --scope and --ignore globs if passed in via commandline
  const { scope, ignore } = minimist(process.argv.slice(2));
  const packages = await getSortedPackages(scope, ignore);
  packages.forEach(pkg => {
    const basePath = pkg.location;
    const input = path.join(basePath, 'src/index.js');
    const { main } = pkg.toJSON();

    const external = Object.keys(pkg.dependencies);
    const globals = external.reduce((map, key) => {
      return {
        ...map,
        [key]: IIFEOutputName(key),
      };
    }, {});

    const replacePlugin = replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    });
    const bublePlugin = buble({
      objectAssign: true,
      transforms: { forOf: false, templateString: false },
    });

    /* Push build config for this package. */
    config.push({
      external,
      input,
      output: {
        format: 'esm',
        file: path
          .join(basePath, main.replace('.js', '.esm.js'))
          .replace('src/', 'dist/'),
        sourcemap: true,
        exports: 'named',
      },
      plugins: [
        replacePlugin,
        commonjs(),
        vue({ css: true, template: { isProduction: true } }),
        bublePlugin,
        terser({ output: { ecma: 6 } }),
      ],
    });
    config.push({
      external,
      input,
      output: {
        format: 'cjs',
        file: path
          .join(basePath, main.replace('.js', '.ssr.js'))
          .replace('src/', 'dist/'),
        sourcemap: true,
        compact: true,
        exports: 'named',
      },
      plugins: [
        replacePlugin,
        commonjs(),
        vue({ template: { isProduction: true, optimizeSSR: true } }),
        bublePlugin,
      ],
    });
    config.push({
      external,
      input,
      output: {
        format: 'iife',
        file: path
          .join(basePath, main)
          .replace('.js', '.min.js')
          .replace('src/', 'dist/'),
        sourcemap: true,
        compact: true,
        exports: 'named',
        name: IIFEOutputName(pkg.name),
        globals,
      },
      plugins: [
        replacePlugin,
        commonjs(),
        vue({ template: { isProduction: true } }),
        bublePlugin,
        terser({ output: { ecma: 5 } }),
      ],
    });
  });
  return config;
}

export default main();
