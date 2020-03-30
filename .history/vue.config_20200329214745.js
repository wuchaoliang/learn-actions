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
    baseUrl: "http://192.168.3.33:31901/",
    openBaseUrl: "http://10.25.231.104:30111/",
    cdnUrl: "http://10.25.23.101:9001/"
  },
  sit: {
    baseUrl: "http://10.25.231.108:30111/",
    cdnUrl: "http://10.25.23.101:1001/"
  }
};

const argv = yargs.argv;
const target = proxyTarget[argv.env] || proxyTarget.dev;
const isAnalyzer = argv.isAnalyzer;
console.log("proxy ", target);
let devServerProxy = {
  "^/interface": {
    target: target.baseUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/interface": ""
    }
  },
  "^/open": {
    target: target.openBaseUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/open": ""
    }
  }
};
const externals = {
  vue: "Vue",
  // "vue-router": "VueRouter",
  vuex: "Vuex",
  axios: "axios",
  "element-ui": "ELEMENT"
};
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
    open: process.platform === "darwin",
    port: 8889,
    https: true,
    disableHostCheck: true,
    hotOnly: false,
    proxy: devServerProxy
  },

  // 第三方插件配置
  pluginOptions: {},

  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/styles/index.scss";'
      }
    }
  }
};
