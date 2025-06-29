const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const isDev = process.env.NODE_ENV !== 'production';

const pagesDir = path.resolve(__dirname, 'src/');
const pages = fs
  .readdirSync(pagesDir)
  .filter(file => path.extname(file) === '.pug')
  .map(file => path.basename(file, '.pug'));

const htmlPlugins = pages.map(page =>
  new HtmlWebpackPlugin({
    filename: `${page}.html`,
    template: `./src/${page}.pug`,
  })
);

module.exports = {
  mode: isDev ? 'development' : 'production',

  entry: {
    main: './src/js/index.js',  // Всі імпорти стилів робити в цьому файлі!
  },

  output: {
    filename: 'js/[name].js', // main → js/main.js
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: 'pug-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),  // Dart Sass для підтримки @use
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/assets/img/sprite'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename: 'img/sprite/sprite.svg',
              symbolId: '[name]',
            },
          },
          'svgo-loader',
        ],
      },
      {
        test: /\.svg$/,
        exclude: path.resolve(__dirname, 'src/assets/img/sprite'),
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },

  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'css/style.css',  // Один css файл із усіма стилями
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/img'),
          to: 'img',
          globOptions: {
            ignore: ['**/sprite/*.svg'],
          },
          noErrorOnMissing: true,
        },
        { from: 'src/assets/fonts', to: path.resolve(__dirname, 'dist/fonts') },
        { from: 'src/assets/css', to: path.resolve(__dirname, 'dist/css') },
        { from: 'src/assets/js', to: path.resolve(__dirname, 'dist/js') },
      ],
    }),
    new LiveReloadPlugin({ appendScriptTag: true }),
    new SpriteLoaderPlugin({ plainSprite: true }),
  ],

  resolve: {
    extensions: ['.js', '.pug'],
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3001,
    hot: true,
    liveReload: true,
    open: true,
  },
};
