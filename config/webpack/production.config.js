const paths = require('./paths.js');
const plugins = require('./plugins.js');
const loaders = require('./loaders.js');
const util = require('./util.js');
const pkg = require('../../package.json');

const config = {
    entry: {
        app: paths.entry,
        vendor: Object.keys(pkg.dependencies)
    },
    // Render source-map file for final build
    devtool: 'source-map',
    // output config
    output: {
        path: paths.build, // Path of output file
        filename: 'app.js' // Name of output file
    },
    plugins: [
        plugins.commonChunk('vendor'),
        plugins.css('main.css'),
        plugins.loaderOptionsPlugin,
        plugins.definePlugin,
        plugins.uglifyJsPlugin,
        plugins.transferWww
    ],
    module: {
        loaders: [loaders.replaceLocalhost, loaders.json, loaders.css, loaders.src]
    },
    externals:{
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    }
};

util.sanityCheck(config);

module.exports = config;
