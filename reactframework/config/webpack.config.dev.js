const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const commonConfig = require("./weback.config.common.js");
const resolvePath = (dir) => path.resolve(__dirname, dir);
const { merge } = require("webpack-merge");

const devConfig = {
  mode: "development",
  devtool: "source-map",
  devServer: {
    // open: true,
    client: {
      // progress:true, //console面板进度打印
      logging: "warn", //console面板打印级别
    },
    static: {
      directory: resolvePath("../public"),
    },
    //拦截路由加载不同的html
    historyApiFallback: {
      index: "/index.html", //与 output 的 publicPath
    },
    hot: true,
    port: 8000,
    proxy: {
      api: {
        target: "http://localhost:3000",
      },
    },
  },
};

module.exports = () => merge(commonConfig, devConfig);
