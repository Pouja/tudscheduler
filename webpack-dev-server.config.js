const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const srcPath = path.resolve(__dirname, 'src');
const npmPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
    // Entry points to the project
    entry: [
        'webpack/hot/dev-server',
        'webpack/hot/only-dev-server',
        path.join(__dirname, '/src/Index.js')
    ],
    // Server Configuration options
    devServer: {
        contentBase: 'www', // Relative directory for base of server
        devtool: 'eval',
        hot: true, // Live-reload
        inline: true,
        port: 3000, // Port Number
        host: 'localhost' // Change to '0.0.0.0' for external facing server
    },
    devtool: 'eval',
    output: {
        path: buildPath, // Path of output file
        filename: 'app.js'
    },
    plugins: [
        new ExtractTextPlugin('main.css'),
        // Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),
        // Allows error warnings but does not stop compiling.
        new webpack.NoErrorsPlugin(),
        // Moves files
        new TransferWebpackPlugin([{
            from: 'www'
        }], path.resolve(__dirname, '.'))
    ],
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
            include: [srcPath]
        }, {
            test: /\.js$/,
            loaders: ['react-hot', 'babel-loader'],
            include: [path.resolve(srcPath, 'components')]
        }, {
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: [path.resolve(srcPath, 'components'), npmPath]
        }],
        preLoaders: [{
            test: /\.js$/,
            loader: 'eslint-loader',
            exclude: /node_modules/
        }]
    },
    eslint: {
        failOnError: true
    }
};

module.exports = config;
