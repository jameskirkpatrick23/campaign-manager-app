import database from '../../firebase';
import { Quirk } from '../constants';

import firebase from 'firebase';

export const updateQuirksList = quirk => (dispatch, getState) => {
  const updatedState = { ...getState().quirks.all };
  updatedState[quirk.id] = quirk;
  dispatch({ type: Quirk.UPDATE_QUIRK_LIST, quirks: updatedState });
};

export const createQuirk = quirkName => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const myId = getState().login.user.uid;
    const ref = database.collection(`quirks`);
    ref
      .orderByChild('name')
      .equalTo(quirkName)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          ref.doc(snapshot.val()).update({
            collaboratorIds: firebase.firestore.FieldValue.arrayUnion(myId)
          });
        } else {
          ref
            .add({
              name: quirkName,
              creatorId: myId,
              collaboratorIds: []
            })
            .then(res => {
              dispatch({ type: 'CREATED_QUIRK', quirkName });
              resolve(res);
            })
            .catch(error => {
              reject('Error writing document: ', error);
            });
        }
      });
  });
};
