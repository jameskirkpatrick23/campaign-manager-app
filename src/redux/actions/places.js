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
      const currentUpload = collection[key];
      const uploadRef = storageRef.child(
        `${uid}/places/${type}/${currentUpload.name}`
      );
      uploadRef
        .put(currentUpload)
        .then(snapshot => {
          snapshot.ref
            .getDownloadURL()
            .then(url => {
              resolve({ downloadUrl: url, fileName: currentUpload.name });
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  });
};

export const updatePlace = placeData => (dispatch, getState) => {};

export const createPlace = placeData => (dispatch, getState) => {
  const userUid = getState().login.user.uid;
  const currentCampaign = getState().campaigns.currentCampaign;

  //take each uploaded image and each attached file. loop through them and make a promise for each.
  //run a promise.all with that promise array, and upload each to the specific storage ref
  //when that completes then get the download URLs for each thing
  //attach those urls to the place you are about to save
  //then finally save the place

  const imagePromiseArray = generatePromiseArray(
    placeData.images,
    userUid,
    'images'
  );
  const attachedFilePromiseArray = generatePromiseArray(
    placeData.attachedFiles,
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
