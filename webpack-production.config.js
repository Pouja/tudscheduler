const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const srcPath = path.resolve(__dirname, 'src');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var Path = require("path");
var FileSystem = require("fs");

const config = {
    entry: [path.join(__dirname, '/src/Index.js')],
    // Render source-map file for final build
    devtool: 'source-map',
    // output config
    output: {
        path: buildPath, // Path of output file
        filename: 'app.[hash].js', // Name of output file
    },
    plugins: [
        new ExtractTextPlugin('main.[hash].css'),
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
        function() {
            // replaces app.js and main.css with app.[hash].js and main.[hash].css respectively
            this.plugin("done", function(statsData) {
                var stats = statsData.toJson();
                if (!stats.errors.length) {
                    var htmlFileName = "index.html";
                    var html = FileSystem.readFileSync(Path.join(__dirname, "www" ,htmlFileName), "utf8");

                    // Hacky solution since this will work only with the current configuration
                    // If there are more bundles it will fail to do this
                    var htmlOutput = html.replace("app.js", stats.assetsByChunkName.main[0])
                        .replace("main.css", stats.assetsByChunkName.main[1]);
                    FileSystem.writeFileSync(
                        Path.join(__dirname, "build", htmlFileName),
                        htmlOutput);
                }
            });
        }
    ],
    module: {
        loaders: [{
            test: /\.js$/, // All .js files
            include: [srcPath],
            loader: 'webpack-replace',
            query: {
                search: 'http://localhost:8000',
                replace: ''
            }
        }, {
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
