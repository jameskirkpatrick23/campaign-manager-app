import * as constants from '../constants';
import database, { app } from '../../firebase';
import firebase from 'firebase';
//<editor-fold Types>

export const updatePlaceTypesList = type => (dispatch, getState) => {
  const updatedState = { ...getState().places.types };
  updatedState[type.id] = type;
  dispatch({ type: constants.Place.UPDATE_PLACE_TYPES, types: updatedState });
};

export const createPlaceType = typeName => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    database
      .collection(`placeTypes`)
      .add({
        name: typeName,
        creatorId: getState().login.user.uid,
        collaboratorIds: []
      })
      .then(res => {
        dispatch({ type: 'CREATED_PLACE_TYPE', typeName });
        resolve(res);
      })
      .catch(function(error) {
        reject('Error writing document: ', error);
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

export const deletePlace = place => (dispatch, getState) => {
  dispatch({ type: constants.Place.DELETING_PLACE, id: place.id });
  return new Promise((resolve, reject) => {
    database
      .collection(`places`)
      .doc(`${place.id}`)
      .delete()
      .then(res => {
        dispatch(removePlaceFromList(place.id));
        resolve(res);
        console.log('Place deleted successfully');
      })
      .catch(err => {
        console.error('Something went wrong while trying to delete:', err);
        reject(err);
      });
  });
};

export const updatePlaceFloors = (placeId, floorId, dispatch) => {
  return new Promise((resolve, reject) => {
    database
      .collection('places')
      .doc(placeId)
      .update({
        floorIds: firebase.firestore.FieldValue.arrayUnion(floorId)
      })
      .then(res => {
        dispatch({ type: constants.Place.UPDATE_PLACE, placeId });
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const generatePromiseArray = (collection, uid, type) => {
  const storageRef = app.storage().ref();
  return Object.keys(collection).map(key => {
    return new Promise((resolve, reject) => {
      const ref = `${Date.now()}`;
      const currentUpload = collection[key];
      const uploadRef = storageRef.child(`${uid}/places/${type}/${ref}`);
      uploadRef
        .put(currentUpload)
        .then(snapshot => {
          snapshot.ref
            .getDownloadURL()
            .then(url => {
              resolve({
                downloadUrl: url,
                fileName: currentUpload.name,
                storageRef: `${uid}/places/${type}/${ref}`
              });
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  });
};

const generateDeletePromiseArray = (deleteKeys, currentArray) => {
  const storageRef = app.storage().ref();
  const promiseArray = [];
  for (let i = 0; i < deleteKeys.length; i++) {
    const newPromise = new Promise((resolve, reject) => {
      const uploadRef = storageRef.child(
        currentArray[parseInt(deleteKeys[i], 10)].storageRef
      );
      uploadRef
        .delete()
        .then(() => {
          resolve();
        })
        .catch(err => reject(err));
    });
    promiseArray.push(newPromise);
  }
  return promiseArray;
};

// const generateArrays = (options) => {
//   const newImagePromiseArray = generatePromiseArray(
//     options.placeData.newImages,
//     options.userUid,
//     'images'
//   );
//
//   const newAttachedFilePromiseArray = generatePromiseArray(
//     options.placeData.newAttachedFiles,
//     options.userUid,
//     'files'
//   );
//
//   const deleteImagePromiseArray = generateDeletePromiseArray(
//     options.placeData.deleteImageIndexes,
//     options.currentPlace.images,
//     options.userUid,
//     'images',
//     options.updatedImageArray,
//   );
//
//   const deleteAttachedFilePromiseArray = generateDeletePromiseArray(
//     options.placeData.deleteFileIndexes,
//     options.currentPlace.attachedFiles,
//     options.userUid,
//     'files',
//     options.updatedFileArray,
//   );
//
//   return {newImagePromiseArray, newAttachedFilePromiseArray, deleteAttachedFilePromiseArray, deleteImagePromiseArray}
// };

export const editPlace = placeData => (dispatch, getState) => {
  const userUid = getState().login.user.uid;
  const currentPlace = getState().places.all[placeData.placeId];

  // i know we need to attach these at a bare minimum

  const {
    deleteimagesKeys,
    deleteattachedFilesKeys,
    newImages,
    newAttachedFiles,
    images,
    attachedFiles
  } = placeData;

  const deleteImageArray = generateDeletePromiseArray(
    deleteimagesKeys,
    currentPlace.images
  );
  const deleteAttachedArray = generateDeletePromiseArray(
    deleteattachedFilesKeys,
    currentPlace.images
  );
  const newImagePromiseArray = generatePromiseArray(
    newImages,
    userUid,
    'images'
  );
  const newAttachedFilePromiseArray = generatePromiseArray(
    newAttachedFiles,
    userUid,
    'attachedFiles'
  );

  let currentImages = Object.keys(images).map(key => images[key]);
  let currentAttachedFiles = Object.keys(attachedFiles).map(
    key => attachedFiles[key]
  );
  dispatch({ type: constants.Place.UPDATE_PLACE, data: placeData });

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
                new Promise(() => {
                  database
                    .collection(`places`)
                    .doc(placeData.placeId)
                    .update({
                      name: placeData.name,
                      type: placeData.type,
                      location: placeData.location,
                      history: placeData.history,
                      insideDescription: placeData.insideDescription,
                      outsideDescription: placeData.outsideDescription,
                      tagIds: placeData.tagIds,
                      npcIds: placeData.npcIds,
                      questIds: placeData.questIds,
                      placeIds: placeData.placeIds,
                      updatedAt: firebase.firestore.Timestamp.now(),
                      floorIds: placeData.floorIds,
                      noteIds: placeData.noteIds,
                      eventIds: placeData.eventIds,
                      images: currentImages,
                      attachedFiles: currentAttachedFiles
                    })
                    .then(res => {
                      resolve(res);
                    })
                    .catch(error => {
                      reject('Error writing document: ', error);
                    });
                }).catch(err => {
                  reject(err);
                });
              })
              .catch(err => {
                console.error(
                  'Something went wrong while trying upload files:',
                  err
                );
              });
          })
          .catch(err => {
            console.error(
              'Something went wrong while trying upload images:',
              err
            );
          });
      })
      .catch(err => {
        console.error('Something went wrong while trying upload images:', err);
      });
  });
};

export const createPlace = placeData => (dispatch, getState) => {
  const userUid = getState().login.user.uid;
  const currentCampaign = getState().campaigns.currentCampaign;

  const imagePromiseArray = generatePromiseArray(
    placeData.newImages,
    userUid,
    'images'
  );
  const attachedFilePromiseArray = generatePromiseArray(
    placeData.newAttachedFiles,
    userUid,
    'files'
  );

  dispatch({ type: constants.Place.CREATING_PLACE, data: placeData });
  return new Promise((resolve, reject) => {
    return Promise.all(imagePromiseArray)
      .then(resolvedImages => {
        const uploadedImages = resolvedImages;
        Promise.all(attachedFilePromiseArray)
          .then(resolvedFiles => {
            const uploadedFiles = resolvedFiles;
            new Promise(() => {
              database
                .collection(`places`)
                .add({
                  name: placeData.name,
                  type: placeData.type,
                  location: placeData.location,
                  history: placeData.history,
                  insideDescription: placeData.insideDescription,
                  outsideDescription: placeData.outsideDescription,
                  tagIds: placeData.tagIds,
                  npcIds: placeData.npcIds,
                  questIds: placeData.questIds,
                  placeIds: placeData.placeIds,
                  createdAt: firebase.firestore.Timestamp.now(),
                  updatedAt: firebase.firestore.Timestamp.now(),
                  floorIds: [],
                  noteIds: [],
                  eventIds: placeData.eventIds,
                  campaignIds: [currentCampaign.id],
                  images: uploadedImages,
                  attachedFiles: uploadedFiles,
                  creatorId: userUid,
                  collaboratorIds: []
                })
                .then(res => {
                  resolve(res);
                })
                .catch(error => {
                  reject('Error writing document: ', error);
                });
            }).catch(err => {
              console.error(
                'Something went wrong while trying upload files:',
                err
              );
            });
          })
          .catch(err => {
            console.error(
              'Something went wrong while trying upload images:',
              err
            );
          });
      })
      .catch(err => {
        console.error('Something went wrong while trying upload images:', err);
      });
  });
};

export const updatePlaceNotes = (noteId, placeId) => {
  return new Promise((resolve, reject) => {
    database
      .collection(`places`)
      .doc(placeId)
      .update({ noteIds: firebase.firestore.FieldValue.arrayUnion(noteId) })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const removePlaceNotes = (placeId, noteId) => {
  return new Promise((resolve, reject) => {
    database
      .collection(`places`)
      .doc(placeId)
      .update({ noteIds: firebase.firestore.FieldValue.arrayRemove(noteId) })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

//</editor-fold>
