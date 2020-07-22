// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
// const ArcGISPlugin = require("@arcgis/webpack-plugin");

const path = require("path");

const client = {
    entry: {
        index: [
            "./src/client/sass/main.scss",  
            "./src/client/index.tsx"]
    },
    watch: true,
    devtool: "source-map",
    output: {
        filename: "[name].[chunkhash].js",
        publicPath: "",
        path: path.resolve("build", "public"),
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                terserOptions: {
                    output: {
                        comments: false
                    }
                }
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: false }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "resolve-url-loader",
                        options: { includeRoot: true }
                    },
                    "sass-loader?sourceMap"
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        //new CleanWebpackPlugin(),


        new CopyPlugin(
            [
                {
                    from: path.resolve("src","client","assets"),
                    to: path.resolve("build", "public", "assets"),
                    force: true
                }
            ]
        ),

        // new ArcGISPlugin({
        //     features: {
        //         "3d": false
        //     }
        // }),

        new HtmlWebPackPlugin({
            title: 'Server + Client - Foundation',
            template: './src/client/index.ejs',
            filename: './index.html',
            favicon: "./src/client/assets/favicon.ico",
            chunksSortMode: 'none',
            inlineSource: '.(css)$'
        }),

        new MiniCssExtractPlugin({
            filename: "[name].[chunkhash].css",
            chunkFilename: "[id].css"
        })
    ],
    resolve: {
        modules: [
            path.resolve(__dirname, "/src"),
            path.resolve(__dirname, "node_modules/")
        ],
        extensions: [".ts", ".tsx", ".js", ".scss", ".css"]
    },
    node: {
        process: false,
        global: false,
        fs: "empty"
    }
};


const server = {
    entry: './src/server/index.ts',
    watch: true,
    mode: "development",
    target: 'node',
    externals: [nodeExternals()],
    output: {
        path: path.resolve("build"),
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'ts-loader'
                ]
            }
        ]
    },
    plugins: [
        new NodemonPlugin({
            script: './build/index.js'
        }),
        new CopyPlugin(
            [
                {
                    from: path.resolve("cert"),
                    to: path.resolve("build", "cert"),
                    force: true
                }
            ]
        )
    ]
};

module.exports = [client, server];