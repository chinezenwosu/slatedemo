import { combineReducers } from 'redux';
import user from './userReducer';

let rootReducer = combineReducers({
  user,
});

export default rootReducer;
