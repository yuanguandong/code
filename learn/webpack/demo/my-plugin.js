const replacePathVariables = (compilationParams) => {
  path = path + '111'
  return path;
};



const plugin = "TemplatedPathPlugin";
class TemplatedPathPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(plugin, compilation => {
      compilation.hooks.optimize.tap(plugin, replacePathVariables);
    });
  }
}

module.exports = TemplatedPathPlugin