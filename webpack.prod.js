const webpack = require('webpack');

const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.config.js');

module.exports = Merge(CommonConfig, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        screw_ie8: true,
      },
      comments: false,
    }),
  ],
  devtool: false,
});
