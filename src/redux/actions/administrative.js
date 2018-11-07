import * as constants from '../constants';
import database, { app } from '../../firebase';
import _ from 'lodash';

const setValuesList = values => dispatch => {
  dispatch({ type: constants.Values.SET_VALUES_LIST, values });
};
const setAlignmentsList = alignments => dispatch => {
  dispatch({ type: constants.Alignments.SET_ALIGNMENTS_LIST, alignments });
};
const setQuirksList = quirks => dispatch => {
  dispatch({ type: constants.Quirks.SET_QUIRKS_LIST, quirks });
};
const setOccupationsList = occupations => dispatch => {
  dispatch({ type: constants.Occupations.SET_OCCUPATIONS_LIST, occupations });
};
const setRacesList = races => dispatch => {
  dispatch({ type: constants.Races.SET_RACES_LIST, races });
};
const setGendersList = genders => dispatch => {
  dispatch({ type: constants.Genders.SET_GENDERS_LIST, genders });
};
export const updateCollectionList = (item, type, constant) => (
  dispatch,
  getState
) => {
  const updatedState = { ...getState()[type].all };
  updatedState[item.id] = item;
  dispatch({ type: constant, [type]: updatedState });
};

export const loadCollection = type => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    database
      .collection(type)
      .get()
      .then(querySnapshot => {
        let items = {};
        querySnapshot.forEach(doc => {
          items[doc.id] = { ...doc.data(), id: doc.id };
        });
        dispatch(eval(`set${_.capitalize(type)}List`)(items));
        resolve(items);
      })
      .catch(err => reject(err));
  });
};

export const createCollection = (collection, type) => (dispatch, getState) => {
  collection.forEach(item => {
    database
      .collection(type)
      .add({ name: item })
      .then(res =>
        dispatch(
          updateCollectionList(
            { id: res.id, name: item },
            type,
            constants[_.capitalize(type)][`SET_${_.toUpper(type)}_LIST`]
          )
        )
      );
  });
};
