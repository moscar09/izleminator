const merge   = require('webpack-merge');
const webpack = require("webpack");
const config = require ('./config.js');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin    = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => {
    var webp_config = {
        entry: {
            'extension/scripts/inlined': './src/inlined.js',
            'extension/scripts/main': './src/main.js',
            'extension/scripts/popup': './src/popup.js',
        },
        output: {
            filename: './[name]-bundle.js'
        },
        module: {
            rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }]
        },
        plugins: [
            new CopyWebpackPlugin([
                {from:'./static/manifest.json',to:'extension/manifest.json'},
                {from:'./static/popup.html',to:'extension/popup.html'},
                {from:'./static/style.css',to:'extension/style.css'} ,
                {from:'./static/icons',to:'extension/icons'} ,
            ]),
        ]
    };

    if(argv['mode'] === 'development') {
        var webp_config = merge(webp_config, {
            devtool: 'source-map',
            entry: {
                'public/test': './test/testPlayer.js',
                'public/inlined': './src/inlined.js',
            },
            plugins: [
                new webpack.DefinePlugin({
                    SOCKET_URI: JSON.stringify(config.development.socketUri),
                    IS_DEV: true,
                }),
                new CopyWebpackPlugin([
                    {from:'./test/index.html',to:'public/index.html'},
                    {from:'./static/style.css',to:'public/style.css'} ,
                ]),
            ]
        });
    } else {
        var webp_config = merge(webp_config, {
            plugins: [
                new UglifyJSPlugin(),
                new webpack.DefinePlugin({
                    SOCKET_URI: JSON.stringify(config.production.socketUri),
                    IS_DEV: false,
                }),
            ]
        });
    }

    return webp_config;
};