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

const argv = yargs.argv;
const target = proxyTarget[argv.env] || proxyTarget.dev;
const isAnalyzer = argv.isAnalyzer;
console.log("proxy ", target);
let devServerProxy = undefined;
switch (argv.env) {
  case "mock":
    devServerProxy = {
      "/api/tf/mgt/" /** 贸易融资*/: {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/tf/mgt/": "/mock/17/tf/mgt/"
        }
      },
      "/api/prod/mgt/" /** 产品中心*/: {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/prod/mgt/": "/mock/44/prod/mgt/"
        }
      },
      "/api/uaa" /** 权限中心*/: {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/uaa": "/mock/35/uaa"
        }
      },
      "/api/prod/" /** 产品中心*/: {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/prod/": "/mock/44/prod/"
        }
      },
      "/api/uc" /**用户中心 */: {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/uc": "/mock/29/uc"
        }
      },
      "/api/msg/" /**消息中心 */: {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/msg/": "/mock/26/msg/"
        }
      },
      "/api/workorder" /**工单中心 */: {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/workorder": "/mock/59"
        }
      },
      "/api/cust/" /**客户管理 */: {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/cust/": "/mock/11/cust/"
        }
      },
      "/yapi/": {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/yapi": ""
        }
      },
      "/api/file" /**文件服务 */: {
        target: target.baseUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/file": "/mock/32/file"
        }
      }
    };
    break;
  default:
    devServerProxy = {
      "^/api": {
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
  publicPath: "/ep",
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
    // config.optimization.splitChunks({
    //   cacheGroups: {
    //     common: {
    //       test: /\.js$/,
    //       name: "common",
    //       chunks: "all",
    //       minChunks: 2,
    //       priority: 10
    //     }
    //   }
    // });
    config.plugin("define").tap(definitions => {
      Object.assign(definitions[0]["process.env"], {
        MDB_ENV: JSON.stringify(argv.env || "dev")
      });
      return definitions;
    });
    config.plugin("html").tap(args => {
      if (process.env.NODE_ENV === "production") {
        args[0].cdn = cdn;
      }
      return args;
    });
    config.plugins.delete("prefetch");
  },
  devServer: {
    open: process.platform === "darwin",
    port: 8889,
    https: true,
    disableHostCheck: true,
    hotOnly: false,
    proxy: devServerProxy,
    after: function (app) {
      let bodyParser = require("body-parser");
      let fs = require("fs");
      app.use(bodyParser.json());
      app.use(
        bodyParser.urlencoded({
          extended: false
        })
      );
      app.post("/localserver/update", (req, res) => {
        console.log("devServer :: after", req.params, req.body);
        const requestBody = req.body;
        fs.writeFile(
          requestBody.path,
          "export default " + JSON.stringify(requestBody.data),
          err => {
            if (!err) {
              res.send({
                retMsg: "success",
                timestamp: 0,
                data: null,
                retCode: 1
              });
            } else {
              res.send({
                retMsg: "error",
                timestamp: 0,
                data: null,
                retCode: 1
              });
            }
            res.end();
          }
        );
      });
    }
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