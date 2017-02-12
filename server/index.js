import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../config/webpack.config.dev';

dotenv.config();
const PORT = process.env.PORT || 8000;
const compiler = webpack(webpackConfig);

let app = express();

app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
}));
app.use(webpackHotMiddleware(compiler));

app.get('/helloworld', (request, response) => {
  response.send('Hello World');
});

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '../public/index.html'));
});

const server = app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

module.exports = {
  stopServer: () => {
    console.log('Stopping server on port', PORT);
    server.close();
  },
};
