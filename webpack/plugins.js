const util = require('./util.js');
const webpack = require('webpack');
const paths = require('./paths.js');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FileSystem = require('fs');

exports.definePlugin = new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
});

exports.noErrorsPlugin = new webpack.NoErrorsPlugin();

exports.css = (name) => new ExtractTextPlugin(name);

exports.hotModuleReplacement = new webpack.HotModuleReplacementPlugin();

exports.transferWww = new TransferWebpackPlugin([{
    from: 'www'
}], paths.root);

exports.uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    },
    output: {
        comments: false
    },
    sourceMap: true
});

exports.loaderOptionsPlugin = new webpack.LoaderOptionsPlugin({
    debug: util.isDevMode(),
    minimize: !util.isDevMode()
});
