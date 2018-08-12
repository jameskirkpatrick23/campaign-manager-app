import constants from '../constants';
import * as CampaignActions from '../actions/campaigns';
export const loginUser = user => dispatch => {
  let scopedUserFields = {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    email: user.email,
    phoneNUmber: user.phoneNumber,
    signinType: user.signinType
  };
  dispatch(CampaignActions.setCampaignListener(scopedUserFields));
  return dispatch({ type: constants.LOGIN_USER, user: scopedUserFields });
};
export const logoutUser = _user => {
  return { type: constants.LOGOUT_USER };
};
