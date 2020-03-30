/*
 * @Author: wulin
 * @Date: 2019-07-22 16:04:31
 * @Description: file content
 */
const path = require("path");
const yargs = require("yargs");
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

function resolve(dir) {
  return path.join(__dirname, dir);
}
const proxyTarget = {
  dev: {
    baseUrl: "http://10.25.231.104:30111/",
    cdnUrl: "http://10.25.23.101:9001/"
  },
  sit: {
    baseUrl: "http://10.25.231.108:30111/",
    cdnUrl: "http://10.25.23.101:1001/"
  },
  uat: {
    baseUrl: "https://10.25.121.105:11001/",
    cdnUrl: "http://10.25.23.101:1001/"
  },
  prod: {
    baseUrl: ""
  },
  mock: {
    baseUrl: "http://10.25.229.102:3000/"
  }
};
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  publicPath: "/ep",
};