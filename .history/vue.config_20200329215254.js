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

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  publicPath: "/ep",
};