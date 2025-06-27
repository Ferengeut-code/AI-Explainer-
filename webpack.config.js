const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    entry: {
        background: './src/background.ts',
        options: './src/options.ts',
        popup: './src/popup.ts',

    },  // Entry point for Webpack
    output: {
        path: path.resolve(__dirname, 'AI-Explainer', 'dist'),  // Output folder
        filename: '[name].js',  // Name of the compiled file
        clean: true,  // Clean the output directory before each build
    },
    devtool: 'cheap-module-source-map', // Source map for easier debugging
    module: {
        rules: [
            {
                test: /\.css$/,  // For regular CSS files
                use: ['style-loader', 'css-loader', 'postcss-loader'],  // Basic CSS processing (without modules)
                exclude: [/\.module\.css$/, /node_modules/],  // Exclude CSS modules
            },
            {
                test: /\.(js|jsx|ts|tsx)$/,  // Process .js, .jsx, .ts, and .tsx files
                exclude: [
                    /node_modules/,
                ],  // Exclude these folders from processing
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
                    },
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,  // Image processing
                use: [
                    {
                        loader: 'file-loader',  // Loader for images
                        options: {
                            name: '[name].[hash].[ext]',  // File name format
                            outputPath: 'images',  // Output path for images
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],  // File extensions to resolve
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'options.html',
            template: './src/options.html',
            chunks: ['options'],
        }),
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            template: './src/popup.html',
            chunks: ['popup'],
        }),
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),  // Path to static files
        },
        historyApiFallback: true,
        compress: true,  // Enable compression
        port: 3000,  // Dev server port
        hot: true,  // Enable hot reloading
    },
    mode: 'development',  // Development mode
};