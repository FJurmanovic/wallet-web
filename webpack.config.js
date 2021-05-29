const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const alias = {
	common: path.resolve(__dirname, '/common'),
	core: path.resolve(__dirname, '/core'),
    configs: path.resolve(__dirname, '/configs'),
    components: path.resolve(__dirname, '/components'),
    pages: path.resolve(__dirname, '/pages'),
    services: path.resolve(__dirname, '/services'),
    layouts: path.resolve(__dirname, "/layouts")
};

module.exports = {
    entry: {
        app: ['babel-polyfill', './src/index']
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "initial",
                    minSize: 200000,
                    maxSize: 400000
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all'
                }
            }
        }
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].[contenthash].js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
    ],
    resolve: {
        extensions: ['.js', '.ts'],
        alias: alias
    },
    devServer: {
        historyApiFallback: true,
    }   
}