const merge = require('webpack-merge');
const webpack = require("webpack");
const common = require('./webpack.common.js');
const config = require ('./config.dev.js');

module.exports = merge(common, {
	plugins: [
		new webpack.DefinePlugin({
			SOCKET_URI: JSON.stringify(config.socketUri),
		}),
	]
});