import * as constants from '../constants';
import * as CampaignActions from '../actions/campaigns';
import * as AdminActions from '../actions/administrative';
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
  ['alignments', 'genders'].forEach(item => {
    dispatch(AdminActions.loadCollection(item, user.uid));
  });
  return dispatch({ type: constants.Login.LOGIN_USER, user: scopedUserFields });
};
export const logoutUser = _user => {
  return { type: constants.Login.LOGOUT_USER };
};
