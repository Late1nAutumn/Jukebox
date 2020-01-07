const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './client/src/app.jsx'),
  output: {
    path: path.resolve(__dirname, './client/dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js[x]?/,
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
      　test: /\.(jpg)$/,
    　  loader: 'url-loader?limit=8192&name=asset/stars/[hash:8].[name].[ext]'
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
