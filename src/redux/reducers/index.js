import { combineReducers } from 'redux';
import LoginReducer from './login';
import CampaignReducer from './campaigns';

export default combineReducers({
  login: LoginReducer,
  campaigns: CampaignReducer
});
