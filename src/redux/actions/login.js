import constants from '../constants';
import * as CampaignActions from '../actions/campaigns';
export const loginUser = user => dispatch => {
  dispatch(CampaignActions.setCampaignListener(user));
  return { type: constants.LOGIN_USER, user };
};
export const logoutUser = user => {
  return { type: constants.LOGOUT_USER };
};
