const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const resolvePath = (dir) => path.resolve(__dirname, dir);

module.exports = {
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      title: "My App",
      template: "public/index.html",
    }),
    //暴露全局变量
    new webpack.ProvidePlugin({
      _: "lodash",
    }),
    //注入html的内联js
    // new ScriptExtHtmlWebpackPlugin({
    //   inline: /runtime~.+\.js$/  //正则匹配runtime文件名
    // })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|webp|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024,
          },
        },
        // generator: {
        //   filename: "images/[contenthash][ext][query]",
        // },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
              },
            },
          },
          "less-loader",
        ],
        exclude:[/global\.less$/]
      },
      {
        test: /global\.less$/,
        use: [
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
    ],
  },
  resolve: {
    mainFiles: ["index"],
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"], //这几个后缀名的文件后缀可以省略不写
    alias: {
      "@": path.join(__dirname, "../src"), //这样 @就表示根目录src这个路径
    },
  },
};
