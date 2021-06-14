const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const { NODE_ENV } = process.env;

module.exports = {
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: ['ko'],
    }),
    NODE_ENV === 'production' && new UglifyJSPlugin(),
  ],
};
