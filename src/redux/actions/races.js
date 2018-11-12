import database from '../../firebase';
import { Races } from '../constants';

import firebase from 'firebase';

export const updateRacesList = race => (dispatch, getState) => {
  const updatedState = { ...getState().races.all };
  updatedState[race.id] = race;
  dispatch({ type: Races.UPDATE_RACE_LIST, races: updatedState });
};

export const createRace = raceName => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const myId = getState().login.user.uid;
    const ref = database.collection(`races`);
    ref
      .orderByChild('name')
      .equalTo(raceName)
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
              name: raceName,
              creatorId: myId,
              collaboratorIds: []
            })
            .then(res => {
              dispatch({ type: 'CREATED_RACE', raceName });
              resolve(res);
            })
            .catch(error => {
              reject('Error writing document: ', error);
            });
        }
      });
  });
};
