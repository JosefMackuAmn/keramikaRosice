const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public', 'js'),
        publicPath: './public/'
    },
    devtool: 'source-map',
    /* devServer: {
        index: '',
        contentBase: path.join(__dirname, '/public'), // serve your static files from here
        watchContentBase: true, // initiate a page refresh if static content changes
        proxy: [ // allows redirect of requests to webpack-dev-server to another destination
          {
            context: () => true,
            target: 'http://localhost:8080', // server and port to redirect to
            secure: false,
          },
        ],
        port: 3000, // port webpack-dev-server listens to, defaults to 8080
        overlay: { // Shows a full-screen overlay in the browser when there are compiler errors or warnings
          warnings: false, // defaults to false
          errors: false, // defaults to false
        },
    } */
};