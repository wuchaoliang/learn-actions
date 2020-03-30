const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("styles", resolve("src/styles"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("store", resolve("src/store"));
  },
  devServer: {
    port: 8889,
    https: true,
    disableHostCheck: true,
    hotOnly: false
  },
};
