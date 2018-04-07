const merge = require('webpack-merge');
const webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const config = require ('./config.prod.js');

const common = require('./webpack.common.js');


module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin(),
	new webpack.DefinePlugin({
		SOCKET_URI: JSON.stringify(config.socketUri),
		IS_DEV: JSON.stringify(config.isDev)
	}),
  ]
});