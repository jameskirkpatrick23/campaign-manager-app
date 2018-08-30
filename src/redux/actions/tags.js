import * as constants from '../constants';
import database, { app } from '../../firebase';

//<editor-fold Tags>

export const updateTagList = tag => (dispatch, getState) => {
  const updatedState = { ...getState().tags.tags };
  updatedState[tag.id] = tag;
  dispatch({ tag: constants.Tag.UPDATE_TAG_LiST, tags: updatedState });
};

export const createTag = tagName => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    database
      .collection(`users/${getState().login.user.uid}/tags`)
      .add({
        name: tagName
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