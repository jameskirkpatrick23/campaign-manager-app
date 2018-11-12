import * as constants from '../constants';
import database, { app } from '../../firebase';
import _ from 'lodash';

const setAlignmentsList = alignments => dispatch => {
  dispatch({ type: constants.Alignment.SET_ALIGNMENTS_LIST, alignments });
};
const setGendersList = genders => dispatch => {
  dispatch({ type: constants.Gender.SET_GENDERS_LIST, genders });
};

export const loadCollection = (type, uid) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    database
      .collection(type)
      .get()
      .then(querySnapshot => {
        database
          .collection(type)
          .where('creatorId', '==', uid)
          .get()
          .then(snap => {
            let items = {};
            _.uniq([...querySnapshot, ...snap]).forEach(doc => {
              items[doc.id] = { ...doc.data(), id: doc.id };
            });
            dispatch(eval(`set${_.capitalize(type)}List`)(items));
            resolve(items);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};
