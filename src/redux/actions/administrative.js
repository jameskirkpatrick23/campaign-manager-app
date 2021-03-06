import * as constants from '../constants';
import database, { app } from '../../firebaseDB';
import _ from 'lodash';

const setValuesList = values => dispatch => {
  dispatch({ type: constants.Value.SET_VALUES_LIST, values });
};
const setPlacetypesList = placeTypes => dispatch => {
  dispatch({ type: constants.Place.SET_PLACE_TYPES_LIST, placeTypes });
};
export const setAlignmentsList = alignments => dispatch => {
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
export const setGendersList = genders => dispatch => {
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
    const ref = database.collection(type);
    ref
      .where('default', '==', true)
      .get()
      .then(snap => {
        ref
          .where('creatorId', '==', uid)
          .get()
          .then(mySnaps => {
            ref
              .where('collaboratorIds', 'array-contains', uid)
              .get()
              .then(partOfSnaps => {
                let items = {};
                snap.forEach(doc => {
                  items[doc.id] = { ...doc.data(), id: doc.id };
                });
                mySnaps.forEach(doc => {
                  items[doc.id] = { ...doc.data(), id: doc.id, default: false };
                });
                partOfSnaps.forEach(doc => {
                  items[doc.id] = { ...doc.data(), id: doc.id, default: false };
                });
                dispatch(eval(`set${_.capitalize(type)}List`)(items));
                resolve(items);
              });
          });
      })
      .catch(err => reject(err));
  });
};

export const createCollection = (collection, type) => (dispatch, getState) => {
  collection.forEach(item => {
    database
      .collection(type)
      .add({ name: item, default: true })
      .then(res =>
        dispatch(
          updateCollectionList(
            { id: res.id, name: item, default: true },
            type,
            constants[_.capitalize(type.slice(0, -1))][
              `SET_${_.toUpper(type)}_LIST`
            ]
          )
        )
      );
  });
};
