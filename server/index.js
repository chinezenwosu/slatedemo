import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../config/webpack.config.dev';

dotenv.config();
const PORT = process.env.PORT || 8000;
const compiler = webpack(webpackConfig);

let app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(favicon(path.join(__dirname, '..', 'public', 'img', 'favicon.png')));

if (process.env.NODE_ENV !== 'production') {
  app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log('Configa running on port', PORT);
});
