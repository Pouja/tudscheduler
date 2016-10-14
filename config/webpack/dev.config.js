const paths = require('./paths.js');
const plugins = require('./plugins.js');
const loaders = require('./loaders.js');
const util = require('./util.js');
const config = {
    // Entry points to the project
    entry: [
        'webpack/hot/only-dev-server',
        paths.entry
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
        path: paths.build, // Path of output file
        filename: 'app.js'
    },
    plugins: [
        plugins.noErrorsPlugin,
        plugins.css('main.css'),
        plugins.loaderOptionsPlugin,
        plugins.hotModuleReplacement,
        plugins.transferWww
    ],
    module: {
        loaders: [loaders.css, loaders.json, loaders.eslint,loaders.components, loaders.nonReact]
    }
};

//Sanity check
util.sanityCheck(config);

module.exports = config;
