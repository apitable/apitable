// .pnpmfile.cjs
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.devDependencies && pkg.devDependencies.eslint) {
        pkg.devDependencies.eslint = "8.49.0";
      }
      if (pkg.dependencies && pkg.dependencies.eslint) {
        pkg.dependencies.eslint = "8.49.0";
      }
      return pkg;
    },
  },
};
