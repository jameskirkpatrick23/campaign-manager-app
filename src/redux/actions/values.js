import database from '../../firebaseDB';
import { Value } from '../constants';

import firebase from 'firebase';

export const updateValuesList = value => (dispatch, getState) => {
  const updatedState = { ...getState().values.all };
  updatedState[value.id] = value;
  dispatch({ type: Value.UPDATE_VALUE_LIST, values: updatedState });
};

export const createValue = valueName => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const myId = getState().login.user.uid;
    const ref = database.collection(`values`);
    ref
      .where('name', '==', valueName)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          ref.doc(snapshot.val()).update({
            collaboratorIds: firebase.firestore.FieldValue.arrayUnion(myId)
          });
        } else {
          ref
            .add({
              name: valueName,
              creatorId: myId,
              default: false,
              collaboratorIds: []
            })
            .then(res => {
              dispatch({ type: 'CREATED_VALUE', valueName });
              resolve(res);
            })
            .catch(error => {
              reject('Error writing document: ', error);
            });
        }
      });
  });
};
