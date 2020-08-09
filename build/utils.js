import { getPackages } from "@lerna/project";
import filterPackages from "@lerna/filter-packages";
import batchPackages from "@lerna/batch-packages";

const IIFEOutputName = (s) => {
  const camel = s
    .replace("@", "")
    .replace("/", "-")
    .replace(/-([a-z])/gi, ($0, $1) => $1.toUpperCase());
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

export {
  IIFEOutputName,
  getSortedPackages,
};
