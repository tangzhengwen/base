var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'src/base.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'base.min.js'
    },
    module: {
        // TODO
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new webpack.BannerPlugin('/* BASE Function JS By Don, Version:2.5.12, website: http://tangzhenwen.com */', {
            raw: true,
            entryOnly: true
        })
    ]
};