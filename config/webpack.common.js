const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		'dist/scripts/inlined': './scripts/inlined.js',
		'dist/scripts/main': './scripts/main.js',
		'dist/scripts/popup': './scripts/popup.js',
	},
	output: {
		filename: './[name]-bundle.js'
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