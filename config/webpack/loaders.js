const ExtractTextPlugin = require('extract-text-webpack-plugin');
const paths = require('./paths.js');

exports.css = {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader'
    }),
    include: [paths.src]
};
exports.components = {
    test: /\.js$/,
    loaders: ['react-hot', 'babel-loader'],
    include: [paths.components]
};

exports.nonReact = {
    test: /\.js$/,
    loaders: ['babel-loader'],
    exclude: [paths.components, paths.npm]
};

exports.src = {
    test: /\.js$/, // All .js files
    loaders: ['babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
    include: [paths.src]
};

exports.eslint = {
    enforce: 'pre',
    test: /\.js$/,
    loader: 'eslint-loader',
    exclude: /node_modules/
};
exports.replaceLocalhost = {
    test: /\.js$/, // All .js files
    include: [paths.src],
    loader: 'webpack-replace',
    query: {
        search: 'http://localhost:8000/',
        replace: ''
    }
};
exports.json = {
    test: /\.json$/,
    loader: 'json'
};
