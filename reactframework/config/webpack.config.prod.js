const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const commonConfig = require("./webpack.config.common");
const resolvePath = (dir) => path.resolve(__dirname, dir);
const merge = require("webpack-merge");

const prodConfig = {
  mode: "production",
  output: {
    // publicPath: "/",
    path: resolvePath("../dist"),
    filename: "[name].[contenthash:4].js",
    assetModuleFilename: "images/[contenthash:6][ext][query]",
    clean: true,
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        react: {
          // name: "react",
          filename: "react.js",
          chunks: "all",
          test: /[\\/]node_modules[\\/](react)[\\/]/,
          priority: -1,
        },
        "react-dom": {
          // name: "react-dom",
          filename: "react-dom.js",
          chunks: "all",
          test: /[\\/]node_modules[\\/](react-dom)[\\/]/,
          priority: -1,
        },
      },
    },
  },
};

module.exports = () => merge(commonConfig, prodConfig);
