/*
 * @Author: wulin
 * @Date: 2019-05-24 18:23:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-07-01 18:34:08
 * @Description: file content
 */
const path = require("path");
const yargs = require("yargs");
const CompressionPlugin = require("compression-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  // eslint-disable-next-line no-unused-vars
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      console.log("为生产环境修改配置...");
      let myConfig = {
        plugins: []
      };

      myConfig.externals = externals;
      myConfig.plugins.push(
        new CompressionPlugin({
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 8192,
          minRatio: 0.8
        })
      );
      return myConfig;
    } else {
      console.log("为开发环境修改配置...");
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("styles", resolve("src/styles"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("store", resolve("src/store"));
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
    config.plugin("html").tap(args => {
      if (process.env.NODE_ENV === "production") {
        args[0].cdn = cdn;
      }
      return args;
    });
  },
  devServer: {
    open: process.platform === "darwin",
    port: 8888,
    https: false,
    hotOnly: false,
    proxy: devServerProxy
  },

};
