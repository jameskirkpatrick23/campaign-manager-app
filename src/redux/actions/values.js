import database from '../../firebase';
import { Values } from '../constants';

import firebase from 'firebase';

export const updateValuesList = value => (dispatch, getState) => {
  const updatedState = { ...getState().values.all };
  updatedState[value.id] = value;
  dispatch({ type: Values.UPDATE_VALUE_LIST, values: updatedState });
};

export const createValue = valueName => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const myId = getState().login.user.uid;
    const ref = database.collection(`values`);
    ref
      .orderByChild('name')
      .equalTo(valueName)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          ref
            .doc(snapshot.val())
            .update({
              collaboratorIds: firebase.firestore.FieldValue.arrayUnion(myId)
            });
        } else {
          ref
            .add({
              name: valueName,
              creatorId: myId,
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
