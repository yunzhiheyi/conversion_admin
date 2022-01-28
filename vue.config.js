var path = require("path");

function resolve(dir) {
  return path.join(__dirname, "./", dir);
}
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  outputDir: "build/production",
  chainWebpack: (config) => {
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
    //忽略的打包文件
    config.externals({
      vue: "Vue",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      axios: "axios",
      "element-ui": "ELEMENT",
    });
    const entry = config.entry("app");
    entry.add("babel-polyfill").end();
    entry.add("classlist-polyfill").end();
  },
  lintOnSave: false,

  devServer: {
    // 端口配置
    port: 1882,
    // 反向代理配置
    // public: "http://172.168.20.100:18801",
    // 端口配置
    // public: "172.16.22.133:18801",
    // 反向代理配置
    proxy: {
      "/api": {
        target: process.env.VUE_APP_SERVER_URL + "/api",
        ws: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
};
