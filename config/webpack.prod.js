const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const srcDir = path.resolve(__dirname, '..', 'src');
const distDir = path.resolve(__dirname, '..', 'dist');
const { NODE_ENV = 'development' } = process.env;

module.exports = {
  context: srcDir,

  devtool: 'cheap-module-source-map',

  entry: [
    './index.js'
  ],

  output: {
    filename: './scripts/main.min.js',

    path: distDir
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: false,
                sourceMap: false
              }
            },
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
        })
      },
      {
        test: /\.(pug|jade)$/,
        loader: 'pug-loader',
        query: {
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
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HashedModuleIdsPlugin(),

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
    }),

    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        screw_ie8: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      }
    }),

    new UnminifiedWebpackPlugin(),

    new ExtractTextPlugin({
      filename: 'styles/[name].css',
      allChunks: true
    }),

    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240
    }),

    new PreloadWebpackPlugin({
      rel: 'preload',
      as: 'script',
      include: 'all',
      fileBlacklist: [/\.(css|map)$/]
    })
  ]
};
