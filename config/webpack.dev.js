const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const srcDir = path.resolve(__dirname, '..', 'src');
const distDir = path.resolve(__dirname, '..', 'dist');
const { NODE_ENV = 'development' } = process.env;

module.exports = {
  context: srcDir,

  devtool: 'source-map',

  entry: [
    './index.js'
  ],

  output: {
    filename: 'main.js',

    path: distDir,

    publicPath: '/',

    sourceMapFilename: 'main.map'
  },

  devServer: {
    contentBase: srcDir,
    publicPath: '/',
    historyApiFallback: true,
    port: 8000
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ],
        include: srcDir
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')({
                browsers: [
                  'last 3 version',
                  'ie >= 10'
                ]
              })]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(pug|jade)$/,
        loader: 'pug-loader',
        query: {
          pretty: true,
          partialDirs: [
            path.join(srcDir, 'pug')
          ]
        }
      },
      {
        test: /\.(eot?.+|svg?.+|ttf?.+|otf?.+|woff?.+|woff2?.+)$/,
        use: 'file-loader?name=assets/[name].[ext]'
      },
      {
        test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
        use: [
          'url-loader?limit=10240&name=assets/[name].[ext]'
        ],
        include: path.resolve(srcDir, 'assets')
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV)
      },
      'NODE_ENV': NODE_ENV,
      '__DEV__': NODE_ENV === 'development',
      '__PROD__': NODE_ENV === 'production'
    }),

    new HtmlWebpackPlugin({
      template: path.join(srcDir, 'index.pug'),

      path: distDir,

      filename: 'index.html'
    })
  ]
};
