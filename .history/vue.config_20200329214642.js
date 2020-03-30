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
const cdn = {
  css: ["/cdn/theme-chalk.css"],
  js: [
    "/cdn/vue.min.js",
    // "/cdn/vue-router.min.js",
    "/cdn/vuex.min.js",
    "/cdn/axios.min.js",
    "/cdn/element-ui.js",
    "/cdn/en.min.js",
    "/cdn/zh-CN.min.js"
  ],
  isElementUi: true
};
const productionGzipExtensions = ["js", "css"];

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
      if (isAnalyzer) myConfig.plugins.push(new BundleAnalyzerPlugin());
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
