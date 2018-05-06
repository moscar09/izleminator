const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require("webpack");
const common = require('./webpack.common.js');
const config = require ('./config.dev.js');

module.exports = merge(common, {
    entry: {
        'public/test': './test/testPlayer.js',
        'public/inlined': './scripts/inlined.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            SOCKET_URI: JSON.stringify(config.socketUri),
            IS_DEV: JSON.stringify(config.isDev)
        }),
        new CopyWebpackPlugin([
            {from:'./test/index.html',to:'public/index.html'},
            {from:'./style.css',to:'public/style.css'} ,
        ]),

    ]
});