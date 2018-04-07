const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
	entry: {
		inlined: './scripts/inlined.js',
		main: './scripts/main.js',
		popup: './scripts/popup.js',
	},
	output: {
		filename: './dist/scripts/[name]-bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		}]
	},
	plugins: [
        new CopyWebpackPlugin([
            {from:'./manifest.json',to:'dist/manifest.json'},
            {from:'./popup.html',to:'dist/popup.html'},
            {from:'./style.css',to:'dist/style.css'} ,
            {from:'./icons',to:'dist/icons'} ,
        ]),
	]
};