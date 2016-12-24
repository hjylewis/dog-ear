var path = require('path');

module.exports = {
    entry: {
        'newtab/bundle.js': './src/newtab/index.js',
        'popup/bundle.js': './src/popup/index.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]',
        publicPath: ''
    },

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
                loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
            },
            {
                test: /\.svg$/,
                loaders: ['babel?presets[]=es2015,presets[]=react', 'svg-react', 'svg-inline?idPrefix=[hash:6]-']
            }
        ]
    },

    devtool: 'source-map'
};
