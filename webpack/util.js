const path = require('path');
const _ = require('lodash');

exports.resolve = function(...paths) {
    return path.resolve(__dirname, '../', ...paths);
};

exports.isDevMode = function() {
    return process.env.NODE_ENV !== 'production';
};

exports.sanityCheck = (config) =>
    ['plugins', 'module.loaders', 'module.preLoaders']
    .map(_.propertyOf(config))
    .filter(Boolean)
    .forEach(function(path) {
        path.forEach(function(plugin, idx) {
            if (plugin === undefined) {
                throw new Error(`undefined plugin encountered at ${idx} for ${path}`);
            }
        });
    });
