const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const { DefinePlugin } = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const alias = {
	common: path.resolve(__dirname, '/common'),
	core: path.resolve(__dirname, '/core'),
    configs: path.resolve(__dirname, '/configs'),
    components: path.resolve(__dirname, '/components'),
    pages: path.resolve(__dirname, '/pages'),
    services: path.resolve(__dirname, '/services'),
    layouts: path.resolve(__dirname, "/layouts"),
    styles: path.resolve(__dirname, "/styles"),
};


module.exports = (env, args) => {
    let settings = {}
    if (env && env.env) {
        switch (env.env) {
            case "production":
                settings = require("./src/configs/production/app-settings.json");
                break;
            case "testing":
                settings = require("./src/configs/testing/app-settings.json");
                break;
            case "develop":
            default:
                settings = require("./src/configs/development/app-settings.json");
        }
    } else {
        settings = require("./src/configs/development/app-settings.json");
    }
    return {
        entry: {
            styles: ['./src/styles/main.scss'],
            app: {
                import: ['babel-polyfill', './src/index'],
                dependOn: 'styles'
            },
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
                }
            },
            minimize: true,
            minimizer: [new TerserPlugin(), new UglifyJsPlugin()],
        },
        output: {
            path: path.join(__dirname, 'public'),
            filename: '[name].[contenthash].js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
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
                },
                {
                    test: /\.css$/,
                    use: {
                        loader: 'css-loader'
                    }
                },
                {
                    test: /\.(scss|css)$/,
                    exclude: /node_modules/,
                    use: [
                        "sass-to-string",
                        {
                            loader: "sass-loader",
                            options: {
                                sassOptions: {
                                    outputStyle: "compressed",
                                },
                            }
                        },
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new DefinePlugin({
                __CONFIG__: JSON.stringify(settings)
            }),
        ],
        resolve: {
            extensions: ['.js', '.ts', '.jsx', '.tsx'],
            alias: alias
        },
        devServer: {
            historyApiFallback: true,
        }   
    }
}