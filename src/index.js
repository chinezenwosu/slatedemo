import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
// import fs from 'fs';
// import sass from 'node-sass';
import './stylesheets/main.scss';

render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('app')
);


// fs.readFile(variablesFile, (err, data) => {
//   console.log(data);
  // sass.render({
  //   data: `$docCount: #{docCount};\n#{data}`,
  //   includePaths: [path.dirname(file)],
  // });
// });
