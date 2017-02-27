import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../config/webpack.config.dev';
import replace from 'replace-in-file';
import docs from '../src/data';

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

  // modify variables.scss to include docs count
  const options = {
    files: 'src/stylesheets/abstracts/_variables.scss',
    from: /docCount: [0-9]+/g,
    to: 'docCount: ' + docs.length,
    encoding: 'utf8',
  };

  replace(options, (error) => {
    if (error) {
      return console.error('Error occurred:', error);
    }
    console.log('variables.scss file modified');
  });
}

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log('Configa running on port', PORT);
});
