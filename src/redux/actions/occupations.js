import database from '../../firebaseDB';
import { Occupation } from '../constants';
import ReactGA from 'react-ga';
import firebase from 'firebase';

export const updateOccupationsList = occupation => (dispatch, getState) => {
  const updatedState = { ...getState().occupations.all };
  updatedState[occupation.id] = occupation;
  dispatch({
    type: Occupation.UPDATE_OCCUPATION_LIST,
    occupations: updatedState
  });
};

export const createOccupation = occupationName => (dispatch, getState) => {
  ReactGA.event({
    category: 'Occupations',
    action: 'Create Occupation'
  });
  return new Promise((resolve, reject) => {
    const myId = getState().login.user.uid;
    const ref = database.collection(`occupations`);
    ref
      .where('name', '==', occupationName)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          ref.doc(snapshot.val()).update({
            collaboratorIds: firebase.firestore.FieldValue.arrayUnion(myId)
          });
        } else {
          ref
            .add({
              name: occupationName,
              creatorId: myId,
              default: false,
              collaboratorIds: []
            })
            .then(res => {
              dispatch({ type: 'CREATED_OCCUPATION', occupationName });
              resolve(res);
            })
            .catch(error => {
              reject('Error writing document: ', error);
            });
        }
      });
  });
};
