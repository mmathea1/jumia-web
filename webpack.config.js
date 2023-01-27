const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['raw-loader', 'sass-loader', 'style-loader', 'css-loader'],
                exclude: /node_modules/,
            },
            { test: /\.ts$/, use: 'ts-loader' },

        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
    },
};