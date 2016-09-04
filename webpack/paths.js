const util = require('./util.js');

module.exports = {
    entry: util.resolve('src/Index.js'),
    src: util.resolve('src/'),
    build: util.resolve('build'),
    npm: util.resolve('node_modules/'),
    components: util.resolve('src/components'),
    www: util.resolve('www/'),
    root: util.resolve('.'),
    index: util.resolve('www','index.html')
};
