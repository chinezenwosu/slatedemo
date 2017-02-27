export default
`import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client', // Development middleware
    path.join(__dirname, '../src/index.js'),
  ],
  output: {
    path: '/',
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),

    // Production plugins

    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),

    // Development plugins

    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, '../src'),
        loaders: ['react-hot-loader', 'babel-loader'],
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, '../src/stylesheets'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader',
        }),
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=25000',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};`;
