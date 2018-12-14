import database from '../../firebaseDB';
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
    });
  dispatch(CampaignActions.setCampaignListener(scopedUserFields));
  dispatch(CampaignActions.setListeners());
  // [
  //   'values',
  //   'alignments',
  //   'quirks',
  //   'occupations',
  //   'races',
  //   'genders',
  //   'placeTypes'
  // ].forEach(item => {
  //   dispatch(AdminActions.loadCollection(item, user.uid));
  // });
  return dispatch({ type: constants.Login.LOGIN_USER, user: scopedUserFields });
};
export const logoutUser = _user => {
  return { type: constants.Login.LOGOUT_USER };
};
