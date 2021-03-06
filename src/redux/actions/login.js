import database from '../../firebaseDB';
import * as constants from '../constants';
import * as CampaignActions from '../actions/campaigns';
import * as AppDataActions from './resource_load';

export const loginUser = user => dispatch => {
  let scopedUserFields = {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    email: user.email,
    phoneNumber: user.phoneNumber,
    signinType: user.signinType
  };
  const ref = database.collection(`users`);
  ref
    .where('uid', '==', user.uid)
    .get()
    .then(snapshot => {
      if (!snapshot.empty) {
        ref.doc(snapshot.docs[0].id).update(scopedUserFields);
      } else {
        ref.add(scopedUserFields);
      }
      dispatch(CampaignActions.setCampaignListener(scopedUserFields));
      dispatch(AppDataActions.getAppData(user.uid));
    });
  return dispatch({ type: constants.Login.LOGIN_USER, user: scopedUserFields });
};
export const logoutUser = _user => (dispatch, getState) => {
  return dispatch({ type: constants.Login.LOGOUT_USER });
};
