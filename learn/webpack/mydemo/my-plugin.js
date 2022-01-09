const replacePathVariables = (path, data, assetInfo) => {
  // path = path + "111";
  console.log('path',path)
  return path;
};

const plugin = "TemplatedPathPlugin";

class TemplatedPathPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(plugin, (compilation) => {
      compilation.hooks.assetPath.tap(plugin, replacePathVariables);
    });
  }
}

module.exports = TemplatedPathPlugin