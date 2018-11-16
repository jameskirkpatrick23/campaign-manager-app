import ReactGA from 'react-ga';
import * as constants from '../constants';
import database from '../../firebaseDB';
import firebase from 'firebase';
import { deleteFloor } from './floors';
import { deleteNote } from './notes';
import _ from 'lodash';

import {
  generatePromiseArray,
  generateFileDeletePromiseArray
} from './reusable';
//<editor-fold Types>

export const updatePlaceTypesList = type => (dispatch, getState) => {
  const updatedState = { ...getState().places.types };
  updatedState[type.id] = type;
  dispatch({ type: constants.Place.UPDATE_PLACE_TYPES, types: updatedState });
};

export const createPlaceType = typeName => (dispatch, getState) => {
  ReactGA.event({
    category: 'PlaceTypes',
    action: 'Create Place Type'
  });
  return new Promise((resolve, reject) => {
    const myId = getState().login.user.uid;
    const ref = database.collection(`placeTypes`);
    ref
      .where('name', '==', typeName)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          ref.doc(snapshot.val()).update({
            collaboratorIds: firebase.firestore.FieldValue.arrayUnion(myId)
          });
        } else {
          ref
            .add({
              name: typeName,
              creatorId: myId,
              collaboratorIds: []
            })
            .then(res => {
              dispatch({ type: 'CREATED_OCCUPATION', typeName });
              resolve(res);
            })
            .catch(error => {
              reject('Error writing document: ', error);
            });
        }
      });
  });
};

//</editor-fold>

//<editor-fold Places>

export const updatePlacesList = place => (dispatch, getState) => {
  const updatedState = { ...getState().places.all };
  updatedState[place.id] = place;
  dispatch({ type: constants.Place.UPDATE_PLACE_LIST, places: updatedState });
};

const setPlaceList = places => dispatch => {
  dispatch({ type: constants.Place.SET_PLACE_LIST, places });
};

export const fetchPlaces = campaignId => dispatch => {
  let placesRef = database.collection(`places`);
  return new Promise((resolve, reject) => {
    placesRef
      .where('campaignIds', 'array-contains', campaignId)
      .get()
      .then(querySnapshot => {
        let places = {};
        querySnapshot.forEach(doc => {
          places[doc.id] = { ...doc.data(), id: doc.id };
        });
        dispatch(setPlaceList(places));
        resolve(places);
      })
      .catch(err => reject(err));
  });
};

const removePlaceFromList = placeId => (dispatch, getState) => {
  const updatedState = { ...getState().places.all };
  delete updatedState[placeId];
  dispatch({ type: constants.Place.UPDATE_PLACE_LIST, places: updatedState });
};

export const deletePlace = place => dispatch => {
  ReactGA.event({
    category: 'Places',
    action: 'Delete Place'
  });
  const allImageKeys = Array.from(new Array(place.images.length).keys());
  const { arrayRemove } = firebase.firestore.FieldValue;
  const batch = database.batch;
  const usedRef = database.collection('places').doc(place.id);
  batch.delete(usedRef);
  place.noteIds.forEach(noteId => {
    const noteRef = database.collection('notes').doc(noteId);
    batch.delete(noteRef);
    dispatch(deleteNote({ id: noteId }));
  });
  place.npcIds.forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    batch.update(npcRef, { placeIds: arrayRemove(place.id) });
  });
  place.placeIds.forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    batch.update(placeRef, { placeIds: arrayRemove(place.id) });
  });
  placeData.questIds.forEach(questId => {
    const questRef = database.collection('quests').doc(questId);
    batch.update(questRef, { placeIds: arrayRemove(place.id) });
  });
  const imagePromise = generateFileDeletePromiseArray(
    allImageKeys,
    place.images
  );
  const allFileKeys = Array.from(new Array(place.attachedFiles.length).keys());
  const filePromise = generateFileDeletePromiseArray(
    allFileKeys,
    place.attachedFiles
  );
  dispatch({ type: constants.Place.DELETING_PLACE, id: place.id });
  return new Promise((resolve, reject) => {
    Promise.all([...imagePromise, ...filePromise])
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

export const editPlace = placeData => (dispatch, getState) => {
  ReactGA.event({
    category: 'Places',
    action: 'Edit Place'
  });
  const userUid = getState().login.user.uid;
  const currentPlace = getState().places.all[placeData.placeId];
  const {
    deleteimagesKeys,
    deleteattachedFilesKeys,
    newImages,
    newAttachedFiles,
    images,
    attachedFiles
  } = placeData;
  const { arrayUnion, arrayRemove } = firebase.firestore.FieldValue;

  const batch = database.batch();
  const usedRef = database.collection(`places`).doc(placeData.placeId);

  const deleteImageArray = generateFileDeletePromiseArray(
    deleteimagesKeys,
    currentPlace.images
  );
  const deleteAttachedArray = generateFileDeletePromiseArray(
    deleteattachedFilesKeys,
    currentPlace.attachedFiles
  );
  const newImagePromiseArray = generatePromiseArray(
    newImages,
    userUid,
    'images',
    'places'
  );
  const newAttachedFilePromiseArray = generatePromiseArray(
    newAttachedFiles,
    userUid,
    'attachedFiles',
    'places'
  );

  _.uniq([...currentPlace.placeIds, ...placeData.placeIds]).forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    if (!placeData.placeIds.includes(placeId)) {
      // delete if newData !include oldId
      batch.update(placeRef, { placeIds: arrayRemove(currentPlace.id) });
    } else {
      batch.update(placeRef, { placeIds: arrayUnion(currentPlace.id) });
    }
  });

  _.uniq([...currentPlace.npcIds, ...placeData.npcIds]).forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    if (!placeData.npcIds.includes(npcId)) {
      // delete if newData !include oldId
      batch.update(npcRef, { npcIds: arrayRemove(currentPlace.id) });
    } else {
      batch.update(npcRef, { npcIds: arrayUnion(currentPlace.id) });
    }
  });

  _.uniq([...currentPlace.questIds, ...placeData.questIds]).forEach(questId => {
    const questRef = database.collection('quests').doc(questId);
    if (!placeData.questIds.includes(questId)) {
      // delete if newData !include oldId
      batch.update(questRef, { npcIds: arrayRemove(currentPlace.id) });
    } else {
      batch.update(questRef, { npcIds: arrayUnion(currentPlace.id) });
    }
  });

  let currentImages = Object.keys(images).map(key => images[key]);
  let currentAttachedFiles = Object.keys(attachedFiles).map(
    key => attachedFiles[key]
  );
  dispatch({ type: constants.Place.UPDATE_PLACE, data: placeData });

  const usedData = { ...placeData };
  delete usedData.newImages;
  delete usedData.newAttachedFiles;
  delete usedData.deleteattachedFilesKeys;
  delete usedData.deleteimagesKeys;
  delete usedData.deletenewAttachedFilesKeys;
  delete usedData.deletenewImagesKeys;

  return new Promise((resolve, reject) => {
    // make all the new images
    return Promise.all(newImagePromiseArray)
      .then(resolvedImages => {
        Promise.all(newAttachedFilePromiseArray)
          .then(resolvedFiles => {
            Promise.all([...deleteImageArray, ...deleteAttachedArray])
              .then(() => {
                currentImages = currentImages.concat(resolvedImages);
                currentAttachedFiles = currentAttachedFiles.concat(
                  resolvedFiles
                );
                batch.update(usedRef, {
                  ...usedData,
                  updatedAt: firebase.firestore.Timestamp.now(),
                  images: currentImages,
                  attachedFiles: currentAttachedFiles
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
  const userUid = getState().login.user.uid;
  const currentCampaign = getState().campaigns.currentCampaign;
  const { arrayUnion } = firebase.firestore.FieldValue;
  const batch = database.batch();
  const usedRef = database.collection('places').ref();
  const usedId = usedRef.id;

  placeData.placeIds.forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    batch.update(placeRef, { placeIds: arrayUnion(usedId) });
  });
  placeData.npcIds.forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    batch.update(npcRef, { placeIds: arrayUnion(usedId) });
  });
  placeData.questIds.forEach(questId => {
    const questRef = database.collection('quests').doc(questId);
    batch.update(questRef, { placeIds: arrayUnion(usedId) });
  });
  const imagePromiseArray = generatePromiseArray(
    placeData.newImages,
    userUid,
    'images',
    'places'
  );
  const attachedFilePromiseArray = generatePromiseArray(
    placeData.newAttachedFiles,
    userUid,
    'files',
    'places'
  );
  const usedData = { ...placeData };
  delete usedData.newImages;
  delete usedData.newAttachedFiles;
  delete usedData.deleteattachedFilesKeys;
  delete usedData.deleteimagesKeys;
  delete usedData.deletenewAttachedFilesKeys;
  delete usedData.deletenewImagesKeys;

  dispatch({ type: constants.Place.CREATING_PLACE, data: placeData });
  return new Promise((resolve, reject) => {
    return Promise.all(imagePromiseArray)
      .then(resolvedImages => {
        Promise.all(attachedFilePromiseArray)
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

//</editor-fold>
