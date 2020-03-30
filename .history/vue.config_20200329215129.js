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
const proxyTarget = {
  dev: {
    baseUrl: "http://10.25.231.104:30111/"
  },
  test: {
    baseUrl: "https://easy-mock.com/mock/5bbef26ad6735265fe8afac2/imada"
  },
  mock: {
    baseUrl: "http://10.25.229.102:3000/mock/"
  }
};

const argv = yargs.argv;
const target = proxyTarget[argv.env] || proxyTarget.dev;
console.log("proxy ", target);
let devServerProxy = undefined;
switch (argv.env) {
  case "mock":
    devServerProxy = {
      "/api/uaa": {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/uaa": "/35"
        }
      },
      "/api/uc": {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/uc": "/29"
        }
      },
      "/api/msg/admin": {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/msg/admin": "/26"
        }
      }
    };
    break;
  default:
    devServerProxy = {
      "/api": {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    };
}

const externals = {
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
  axios: "axios",
  "element-ui": "ELEMENT"
};
const cdn = {
  css: ["https://cdn.bootcss.com/element-ui/2.8.2/theme-chalk/index.css"],
  js: [
    "https://cdn.bootcss.com/vue/2.6.10/vue.min.js",
    "https://cdn.bootcss.com/vue-router/3.0.6/vue-router.min.js",
    "https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js",
    "https://cdn.bootcss.com/axios/0.18.0/axios.min.js",
    "https://cdn.bootcss.com/element-ui/2.8.2/index.js",
    "https://cdn.bootcss.com/element-ui/2.8.2/locale/en.min.js",
    "https://cdn.bootcss.com/element-ui/2.8.2/locale/zh-CN.min.js"
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
