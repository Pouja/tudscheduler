const paths = require('./paths.js');
const plugins = require('./plugins.js');
const loaders = require('./loaders.js');
const util = require('./util.js');

const config = {
    entry: [paths.entry],
    // Render source-map file for final build
    devtool: 'source-map',
    // output config
    output: {
        path: paths.build, // Path of output file
        filename: 'app.js' // Name of output file
    },
    plugins: [
        plugins.css('main.css'),
        plugins.loaderOptionsPlugin,
        plugins.definePlugin,
        plugins.uglifyJsPlugin,
        plugins.transferWww
    ],
    module: {
        loaders: [loaders.replaceLocalhost, loaders.css, loaders.src]
    }
};

util.sanityCheck(config);

module.exports = config;
