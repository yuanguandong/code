const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');
const commonConfig = {
	entry: {
		main: './src/index.js',
	},
	module: {
		rules: [{ 
			test: /\.js$/, 
			exclude: [/node_modules/,/example/],
			use: [{
				loader: 'babel-loader'
			}
			// , {
			// 	loader: 'imports-loader?this=>window'
			// }
		]
		}, {
			test: /\.(jpg|png|gif)$/,
			use: {
				loader: 'url-loader',
				options: {
					name: '[name]_[hash].[ext]',
					outputPath: 'images/',
					limit: 10240
				}
			} 
		}, {
			test: /\.(eot|ttf|svg)$/,
			use: {
				loader: 'file-loader'
			} 
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}), 
		new CleanWebpackPlugin(['dist'], {
			root: path.resolve(__dirname, '../')
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			_join: ['lodash', 'join']
		}),
	],
	// optimization: {
	// 	runtimeChunk: {
	// 		name: 'runtime'
	// 	},
	// 	usedExports: true,
	// 	splitChunks: {
  //     chunks: 'all',
  //     cacheGroups: {
  //     	vendors: {
  //     		test: /[\\/]node_modules[\\/]/,
  //     		priority: -10,
  //     		name: 'vendors',
  //     	}
  //     }
  //   }
	// },
	performance: false,
	output: {
		path: path.resolve(__dirname, '../dist')
	}
}

module.exports = (env) => {
	if(env && env.production) {
		return merge(commonConfig, prodConfig);
	}else {
		return merge(commonConfig, devConfig);
	}
}

