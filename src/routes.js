import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './components/App';
import Greetings from './components/Greetings';
import SignUpPage from './components/signup/SignUpPage';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Greetings}/>
    <Route path='signup' component={SignUpPage} />
  </Route>
);
