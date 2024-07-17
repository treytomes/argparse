const webpack = require('webpack');
const path = require('path');
require('dotenv').config();

module.exports = [
  {
    name: 'main',
    devtool: false,
    target: 'async-node',
    entry: './src/index.ts',
    node: {
      __dirname: true,
    },
    mode: process.env.ENV || 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        ENV: process.env.ENV,
        DEBUG: process.env.DEBUG,
      }),
    ],
  },
];
