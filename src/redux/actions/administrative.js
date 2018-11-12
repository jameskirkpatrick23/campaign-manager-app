import * as constants from '../constants';
import database, { app } from '../../firebase';
import _ from 'lodash';

const setValuesList = values => dispatch => {
  dispatch({ type: constants.Value.SET_VALUES_LIST, values });
};
const setAlignmentsList = alignments => dispatch => {
  dispatch({ type: constants.Alignment.SET_ALIGNMENTS_LIST, alignments });
};
const setQuirksList = quirks => dispatch => {
  dispatch({ type: constants.Quirk.SET_QUIRKS_LIST, quirks });
};
const setOccupationsList = occupations => dispatch => {
  dispatch({ type: constants.Occupation.SET_OCCUPATIONS_LIST, occupations });
};
const setRacesList = races => dispatch => {
  dispatch({ type: constants.Race.SET_RACES_LIST, races });
};
const setGendersList = genders => dispatch => {
  dispatch({ type: constants.Gender.SET_GENDERS_LIST, genders });
};
export const updateCollectionList = (item, type, constant) => (
  dispatch,
  getState
) => {
  const updatedState = { ...getState()[type].all };
  updatedState[item.id] = item;
  dispatch({ type: constant, [type]: updatedState });
};

export const loadCollection = (type, uid) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    database
      .collection(type)
      .where('collaboratorIds', 'array-contains', uid)
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

// export const createCollection = (collection, type) => (dispatch, getState) => {
//   collection.forEach(item => {
//     database
//       .collection(type)
//       .add({ name: item })
//       .then(res =>
//         dispatch(
//           updateCollectionList(
//             { id: res.id, name: item },
//             type,
//             constants[_.capitalize(type)][`SET_${_.toUpper(type)}_LIST`]
//           )
//         )
//       );
//   });
// };
