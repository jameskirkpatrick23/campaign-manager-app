import * as constants from '../constants';
import database, { app } from '../../firebase';

//<editor-fold Types>

export const updatePlaceTypesList = type => (dispatch, getState) => {
  const updatedState = { ...getState().places.types };
  updatedState[type.id] = { ...type };
  dispatch({ type: constants.Place.UPDATE_PLACE_TYPES, types: updatedState });
};

export const createPlaceType = typeName => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    database
      .collection(`users/${getState().login.user.uid}/placeTypes`)
      .add({
        name: typeName
      })
      .then(res => {
        dispatch(updatePlaceTypesList(res));
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
  const currentCampaign = getState().campaigns.currentCampaign;
  return new Promise((resolve, reject) => {
    database
      .collection(`/campaigns/${currentCampaign.id}/places`)
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

export const createPlace = placeData => (dispatch, getState) => {
  const storageRef = app.storage().ref();
  const currentCampaign = getState().campaigns.currentCampaign;
  const imagesRef = storageRef.child(
    `places/${getState().login.user.uid}/${placeData.image.name}`
  );
  dispatch({ type: constants.Place.CREATING_PLACE, data: placeData });
  return new Promise((resolve, reject) => {
    imagesRef.put(placeData.image).then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        database
          .collection('places')
          .add({
            name: placeData.name,
            type: placeData.type,
            npcIds: placeData.npcIds,
            questIds: placeData.questIds,
            placeIds: placeData.placeIds,
            history: placeData.history,
            campaignIds: [currentCampaign.id],
            description: placeData.description,
            creatorId: getState().login.user.uid,
            imageRef: url
          })
          .then(res => {
            resolve(res);
          })
          .catch(function(error) {
            reject('Error writing document: ', error);
          });
      });
    });
  });
};

//</editor-fold>
