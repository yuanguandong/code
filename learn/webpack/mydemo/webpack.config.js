const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TemplatedPathPlugin = require("./my-plugin.js");

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
    filename: "[name].[contenthash].js",
  },
  /* externals: {
    'react': 'React' // import React from 'react'; => const React = window.React => <script src="xxx">
  }, */
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options:{
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ]
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            // options: {
            //   modules: true,
            // },
          },
        ],
      },
      {
        test: /\.mobile$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "./mobile-css-loader.js",
            options: {
              width: 750,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new TemplatedPathPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          filename: "react.js",
          chunks: "all",
          // test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/
          test({ resource }) {
            // console.log('resource',resource)
            return /[\\/]node_modules[\\/]react[\\/]/.test(resource);
          },
        },
        "react-dom": {
          filename: "react-dom.js",
          chunks: "all",
          // test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/
          test({ resource }) {
            // console.log('resource',/[\\/]node_modules[\\/]react-dom[\\/]/.test(resource))
            return /[\\/]node_modules[\\/]react-dom[\\/]/.test(resource);
          },
        },
      },
    },
  },
};
