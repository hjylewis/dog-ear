var path = require("path");

module.exports = {
    entry: {
        "newtab/bundle.js": "./src/newtab/index.js",
        "popup/bundle.js": "./src/popup/index.js"
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]",
        publicPath: ""
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: { presets: ['es2015', 'react'] }
            }
        ]
    },

    devtool: "source-map"
};
