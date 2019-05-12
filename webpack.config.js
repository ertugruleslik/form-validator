var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");

module.exports = {
    entry: './source/scripts/main.js',
    output: {
        path: path.resolve(__dirname, "build"),
        filename: 'scripts/app.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: ['css-loader','sass-loader'],
                    publicPath: '/build/styles'
                })
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "build"),
        compress: true,
        stats: "errors-only",
        port: 8007,
        open: true,
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Project Demo',
            //minify: {
            //    collapseWhitespace: true
            //},
            hash: true,
            chunksSortMode: 'manual',
            template: './source/index.html',
        }),
        new ExtractTextPlugin({
            filename: 'styles/style.css',
            disable: false,
            allChunks: true
        })
    ],
    watch: true
};
