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

exports.hashReplace =
    function() {
        // replaces app.js and main.css with app.[hash].js and main.[hash].css respectively
        this.plugin('done', function(statsData) {
            const stats = statsData.toJson();
            if (!stats.errors.length) {
                const htmlFileName = 'index.html';
                let html = FileSystem.readFileSync(paths.index, 'utf8');

                // Hacky solution since this will work only with the current configuration
                // If there are more bundles it will fail to do this
                const htmlOutput = html.replace('app.js', stats.assetsByChunkName.main[0])
                    .replace('main.css', stats.assetsByChunkName.main[1]);
                FileSystem.writeFileSync(
                    util.resolve('build', htmlFileName),
                    htmlOutput);
            }
        });
};
exports.loaderOptionsPlugin = new webpack.LoaderOptionsPlugin({
    debug: util.isDevMode(),
    minimize: !util.isDevMode()
});
