var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [{
            loader: 'style-loader' // creates style nodes from JS strings
        }, {
            loader: 'css-loader' // translates CSS into CommonJS
        }, {
            loader: 'less-loader' // compiles Less to CSS
        }]
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'react-hot-loader'
        }, {
          loader: 'babel-loader'
        }],
        include: path.join(__dirname, 'src')
      }
    ]
  }
};
