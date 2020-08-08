// Ref https://medium.com/javascript-in-plain-english/bundling-monorepos-the-right-way-34116aa50433
import path from "path";

import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

import { getPackages } from "@lerna/project";
import filterPackages from "@lerna/filter-packages";
import batchPackages from "@lerna/batch-packages";
import minimist from "minimist";

var IIFEOutputName = s => {
  const camel = s
    .replace('@', '')
    .replace('/', '-')
    .replace(
      /-([a-z])/gi,
      ($0, $1) => $1.toUpperCase(),
    );
  return `${camel.charAt(0).toUpperCase()}${camel.slice(1)}`;
};

/**
 * @param {string}[scope] - packages to only build (if you don't
 *    want to build everything)
 * @param {string}[ignore] - packages to not build
 *
 * @returns {string[]} - sorted list of Package objects that
 *    represent packages to be built.
 */
async function getSortedPackages(scope, ignore) {
  const packages = await getPackages(__dirname);
  const filtered = filterPackages(packages, scope, ignore, false);

  return batchPackages(filtered).reduce((arr, batch) => arr.concat(batch), []);
}

async function main() {
  const config = [];
  // Support --scope and --ignore globs if passed in via commandline
  const { scope, ignore } = minimist(process.argv.slice(2));
  const packages = await getSortedPackages(scope, ignore);
  packages.forEach(pkg => {
    /* Absolute path to package directory */
    const basePath = path.relative(__dirname, pkg.location);
    /* Absolute path to input file */
    const input = path.join(basePath, 'src/index.js');
    /* "main" field from package.json file. */
    const { main } = pkg.toJSON();

    /* Push build config for this package. */
    config.push({
      input,
      output: {
        format: "esm",
        file: path.join(basePath, main.replace('.js', '.esm.js')).replace('src/', 'dist/'),
        sourcemap: true,
        exports: "named",
      },
      plugins: [
        nodeResolve(),
        replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
        commonjs(),
        vue({ css: true, template: { isProduction: true } }),
        buble({ objectAssign: true, transforms: { forOf: false } }),
        terser({ output: { ecma: 6 } }),
      ],
    });
    config.push({
      input,
      output: {
        format: "cjs",
        file: path.join(basePath, main.replace(".js", ".ssr.js")).replace('src/', 'dist/'),
        sourcemap: true,
        compact: true,
        exports: "named",
      },
      plugins: [
        nodeResolve(),
        replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
        commonjs(),
        vue({ template: { isProduction: true, optimizeSSR: true } }),
        buble({ objectAssign: true, transforms: { forOf: false } }),
      ],
    });
    config.push({
      input,
      output: {
        format: "iife",
        file: path.join(basePath, main).replace(".js", ".min.js").replace('src/', 'dist/'),
        sourcemap: true,
        compact: true,
        exports: "named",
        name: IIFEOutputName(pkg.name),
      },
      plugins: [
        nodeResolve(),
        replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
        commonjs(),
        vue({ template: { isProduction: true } }),
        buble({ objectAssign: true, transforms: { forOf: false } }),
        terser({ output: { ecma: 5 } }),
      ],
    });
  });
  return config;
}

export default main();
