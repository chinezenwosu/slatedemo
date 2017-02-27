import packageJson from './packageJson.js';
import webpack from './webpack.js';
import eslintrc from './eslintrc.js';

let docs = [
  {
    name: 'package.json',
    domName: 'packagejson',
    text: packageJson,
  },
  {
    name: 'webpack.config.js',
    domName: 'webpack',
    text: webpack,
  },
  {
    name: '.eslintrc.json',
    domName: 'eslintrc',
    text: eslintrc,
  },
  {
    name: 'egg.js',
    domName: 'egg',
    text: packageJson,
  },
];

export default docs;
