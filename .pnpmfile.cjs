function readPackage(pkg) {
  if (pkg.dependencies && pkg.dependencies.postcss) {
    pkg.dependencies.postcss = "8.5.30";
  }
  if (pkg.dependencies && pkg.dependencies["source-map-js"]) {
    pkg.dependencies["source-map-js"] = "1.2.2";
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
