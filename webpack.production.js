const merge = require('webpack-merge');
const webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const config = require ('./config/config.prod.js');


module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin(),
	new webpack.DefinePlugin({
		SOCKET_URI: JSON.stringify(config.socketUri),
	}),
  ]
});