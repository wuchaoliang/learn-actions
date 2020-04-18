module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  publicPath: "/commerce",
  devServer: {
    port: 8888,
    https: true,
    hotOnly: false,
    proxy: {
      "^/api": {
        target: "http://120.79.209.56/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
