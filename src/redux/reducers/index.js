import { combineReducers } from 'redux';
import LoginReducer from './login';

export default combineReducers({ login: LoginReducer });
