const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/js/index.js',
    output: {
        filename: '[contenthash].js',
        path: path.resolve(__dirname, 'public', 'js'),
        publicPath: './public/'
    }
};