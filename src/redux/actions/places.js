import ReactGA from 'react-ga';
import firebase from 'firebase';
import * as constants from '../constants';
import database from '../../firebaseDB';
import { deleteFloor } from './floors';
import {
  generateImagePromises,
  handleFileChanges,
  deleteConnected,
  generateDeleteKeys,
  stripExcessData,
  updateConnected,
  conditionallyUpdateConnected,
  createAncillaryObject
} from './reusable';

//<editor-fold Types>
export const updatePlaceTypesList = type => (dispatch, getState) => {
  const updatedState = { ...getState().places.types };
  updatedState[type.id] = type;
  dispatch({ type: constants.Place.UPDATE_PLACE_TYPES, types: updatedState });
};

export const createPlaceType = typeName => dispatch => {
  dispatch(createAncillaryObject(typeName, 'placeType'));
};
//</editor-fold>

//<editor-fold Places>
export const updatePlacesList = place => (dispatch, getState) => {
  const updatedState = { ...getState().places.all };
  updatedState[place.id] = place;
  dispatch({ type: constants.Place.UPDATE_PLACE_LIST, places: updatedState });
};

const removePlaceFromList = placeId => (dispatch, getState) => {
  const updatedState = { ...getState().places.all };
  delete updatedState[placeId];
  dispatch({ type: constants.Place.UPDATE_PLACE_LIST, places: updatedState });
};

export const editPlace = placeData => (dispatch, getState) => {
  ReactGA.event({
    category: 'Places',
    action: 'Edit Place'
  });
  dispatch({ type: constants.Place.UPDATE_PLACE, data: placeData });
  const userUid = getState().login.user.uid;
  const currentPlace = getState().places.all[placeData.placeId];

  const batch = database.batch();
  const usedRef = database.collection(`places`).doc(placeData.placeId);
  conditionallyUpdateConnected(currentPlace, placeData, batch);
  const usedData = { ...placeData };
  stripExcessData(usedData);
  const fileChanges = handleFileChanges(placeData, currentPlace, userUid);

  return new Promise((resolve, reject) => {
    // make all the new images
    return Promise.all(fileChanges.newImagePromiseArray)
      .then(resolvedImages => {
        Promise.all(fileChanges.newAttachedFilePromiseArray)
          .then(resolvedFiles => {
            Promise.all([
              ...fileChanges.deleteImageArray,
              ...fileChanges.deleteAttachedArray
            ])
              .then(() => {
                batch.update(usedRef, {
                  ...usedData,
                  updatedAt: firebase.firestore.Timestamp.now(),
                  images: fileChanges.currentImages.concat(resolvedImages),
                  attachedFiles: fileChanges.currentAttachedFiles.concat(
                    resolvedFiles
                  )
                });
                batch
                  .commit()
                  .then(res => {
                    resolve(res);
                  })
                  .catch(error => {
                    reject(`Error writing document: ${error.message}`);
                  });
              })
              .catch(err => {
                reject(
                  `Something went wrong while trying upload files: ${
                    err.message
                  }`
                );
              });
          })
          .catch(err => {
            reject(
              `Something went wrong while trying upload images: ${err.message}`
            );
          });
      })
      .catch(err => {
        reject(
          `Something went wrong while trying upload images and files: ${
            err.message
          }`
        );
      });
  });
};

export const createPlace = placeData => (dispatch, getState) => {
  ReactGA.event({
    category: 'Places',
    action: 'Create Place'
  });
  dispatch({ type: constants.Place.CREATING_PLACE, data: placeData });
  const userUid = getState().login.user.uid;
  const currentCampaign = getState().campaigns.currentCampaign;
  const batch = database.batch();
  const usedRef = database.collection('places').doc();
  const usedData = { ...placeData, id: usedRef.id };

  updateConnected(usedData, 'placeIds', batch);

  const newFiles = generateImagePromises(placeData, userUid, 'places');

  return new Promise((resolve, reject) => {
    stripExcessData(usedData);
    return Promise.all(newFiles.imagePromiseArray)
      .then(resolvedImages => {
        Promise.all(newFiles.attachedFilePromiseArray)
          .then(resolvedFiles => {
            batch.set(usedRef, {
              ...usedData,
              floorIds: [],
              noteIds: [],
              createdAt: firebase.firestore.Timestamp.now(),
              updatedAt: firebase.firestore.Timestamp.now(),
              campaignIds: [currentCampaign.id],
              images: resolvedImages,
              attachedFiles: resolvedFiles,
              creatorId: userUid,
              collaboratorIds: []
            });
            batch
              .commit()
              .then(res => {
                resolve(res);
              })
              .catch(error => {
                reject('Error writing document: ', error);
              });
          })
          .catch(err => {
            console.error(
              `Something went wrong while trying upload images: ${err.message}`
            );
          });
      })
      .catch(err => {
        console.error(
          `Something went wrong while trying upload images: ${err.message}`
        );
      });
  });
};

export const deletePlace = place => dispatch => {
  ReactGA.event({
    category: 'Places',
    action: 'Delete Place'
  });
  dispatch({ type: constants.Place.DELETING_PLACE, id: place.id });
  const batch = database.batch;
  const usedRef = database.collection('places').doc(place.id);
  batch.delete(usedRef);
  dispatch(deleteConnected(place, 'placeIds', batch));
  const filePromises = generateDeleteKeys(place);

  return new Promise((resolve, reject) => {
    Promise.all(filePromises)
      .then(() => {
        dispatch(removePlaceFromList(place.id));
        batch
          .commit()
          .then(res => {
            place.floorIds.forEach(floorId => {
              dispatch(deleteFloor(floorId));
            });
            resolve(res);
          })
          .catch(err => {
            reject(
              `Something went wrong while trying to delete: ${err.message}`
            );
          });
      })
      .catch(err => {
        reject(
          `Failed to delete all the images and files for place ${err.message}`
        );
      });
  });
};
//</editor-fold>
