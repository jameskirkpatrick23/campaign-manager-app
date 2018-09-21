import * as constants from '../constants';
import database from '../../firebase';
import firebase from 'firebase';

//<editor-fold Tags>

export const updateTagList = tag => (dispatch, getState) => {
  const updatedState = { ...getState().tags.tags };
  updatedState[tag.id] = tag;
  dispatch({ type: constants.Tag.UPDATE_TAG_LIST, tags: updatedState });
};

export const createTag = tagName => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    database
      .collection(`tags`)
      .add({
        name: tagName,
        createdAt: firebase.firestore.Timestamp.now(),
        creatorId: getState().login.user.uid,
        collaboratorIds: []
      })
      .then(res => {
        resolve(res);
      })
      .catch(function(error) {
        reject('Error writing document: ', error);
      });
  });
};

//</editor-fold>
