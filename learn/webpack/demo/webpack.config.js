const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TemplatedPathPlugin = require("./my-plugin.js");
const AutoTryCatch = require("./try-catch-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: "./src/index.js",
  devServer: {
    port: 8000, // 顺便更改一下端口
    hot: true,
  },
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "output"),
    filename: "[name].js",
  },
  /* externals: {
    'react': 'React' // import React from 'react'; => const React = window.React => <script src="xxx">
  }, */
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            /* options: {
          modules: true
        } */
          },
        ],
      },
      {
        test: /\.mobile$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            /* options: {
          modules: true
        } */
          },
          {
            loader: "./mobile-css-loader",
            options: {
              width: 750,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new AutoTryCatch(),
    // new TemplatedPathPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          filename: "react.js",
          chunks: "all", // async, initial
          test: /[\\/]node_modules[\\/]react[\\/]/,
        },
        "react-dom": {
          filename: "react-dom.js",
          chunks: "all", // async, initial
          test: /[\\/]node_modules[\\/]react-dom[\\/]/,
        },
      },
    },
  },
};
