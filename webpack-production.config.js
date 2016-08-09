const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const srcPath = path.resolve(__dirname, 'src');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
    entry: [path.join(__dirname, '/src/Index.js')],
    // Render source-map file for final build
    devtool: 'source-map',
    // output config
    output: {
        path: buildPath, // Path of output file
        filename: 'app.js', // Name of output file
    },
    plugins: [
        new ExtractTextPlugin('main.css'),
        // Define production build to allow React to strip out unnecessary checks
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        // Minify the bundle
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                // suppresses warnings, usually from module minification
                warnings: false,
            },
        }),
        // Allows error warnings but does not stop compiling.
        // Transfer Files
        new TransferWebpackPlugin([{
            from: 'www'
        }, ], path.resolve(__dirname, '.')),
    ],
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
            include: [srcPath]
        }, {
            test: /\.js$/, // All .js files
            loaders: ['babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
            include: [srcPath]
        }, ],
    },
};

module.exports = config;
