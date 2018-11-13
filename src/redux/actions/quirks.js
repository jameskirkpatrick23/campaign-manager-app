import database from '../../firebaseDB';
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
      .where('name', '==', quirkName)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          ref.doc(snapshot.val()).update({
            collaboratorIds: firebase.firestore.FieldValue.arrayUnion(myId)
          });
        } else {
          ref
            .add({
              name: quirkName,
              creatorId: myId,
              default: false,
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
