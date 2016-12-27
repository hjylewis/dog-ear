var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');

module.exports = {
    entry: {
        'newtab/bundle.js': './src/newtab/index.js',
        'popup/bundle.js': './src/popup/index.js'
    },

    output: {
        path: path.join(__dirname, 'package/dist'),
        filename: '[name]',
        publicPath: ''
    },

    plugins: [
        new ExtractTextPlugin('newtab/styles.css')
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                babelrc: false,
                query: { presets: ['es2015', 'react'] }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(['css?sourceMap', 'sass?sourceMap'])
            },
            {
                test: /\.svg$/,
                loaders: [
                    'babel?presets[]=es2015,presets[]=react',
                    'svg-react',
                    'svgo?' + JSON.stringify({
                        plugins: [
                            {
                                cleanupIDs: {
                                    prefix: '[name]-'
                                }
                            }
                        ]
                    })
                ]
            }
        ]
    },

    devtool: 'source-map'
};
