import React from 'react';

class App extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="doc"> 
        {
          "name": "configa",
          "version": "1.0.0",
          "description": "A template zone for common configuration files",
          "main": "server/index.js",
          "scripts": {
            "test": "",
            "start": "nodemon --watch server --exec babel-node -- server",
            "lint": "./node_modules/.bin/eslint ./**/*.js*"
          },
          "repository": {
            "type": "git",
            "url": "git+ssh://git@bitbucket.org/andela-cnwosu/configa.git"
          },
          "keywords": [
            "Reactjs",
            "Nodejs",
            "template"
          ],
          "author": "Chineze Nwosu",
          "license": "ISC",
          "homepage": "https://bitbucket.org/chineze/toast#readme",
          "devDependencies": {
            "babel-cli": "^6.22.2",
            "babel-eslint": "^7.1.1",
            "babel-loader": "^6.2.10",
            "babel-preset-es2015": "^6.22.0",
            "css-loader": "^0.26.1",
            "eslint": "^3.15.0",
            "eslint-config-google": "^0.7.1",
            "eslint-plugin-import": "^2.2.0",
            "eslint-plugin-jsx-a11y": "^4.0.0",
            "eslint-plugin-react": "^6.9.0",
            "extract-text-webpack-plugin": "^2.0.0-rc.3",
            "node-sass": "^4.5.0",
            "nodemon": "^1.11.0",
            "react-hot-loader": "^1.3.1",
            "sass-loader": "^6.0.0",
            "style-loader": "^0.13.1",
            "url-loader": "^0.5.7",
            "webpack-hot-middleware": "^2.16.1"
          },
          "dependencies": {
            "babel-polyfill": "^6.22.0",
            "babel-preset-react": "^6.22.0",
            "babel-register": "^6.22.0",
            "dotenv": "^4.0.0",
            "express": "^4.14.1",
            "lodash": "^4.17.4",
            "react": "^15.4.2",
            "react-dom": "^15.4.2",
            "react-router": "^3.0.2",
            "serve-favicon": "^2.3.2",
            "webpack": "^2.2.1",
            "webpack-dev-middleware": "^1.10.0"
          }
        }
      </div>
    );
  };
};

export default App;
