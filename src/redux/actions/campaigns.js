import ReactGA from 'react-ga';
import * as constants from '../constants';
import database, { app } from '../../firebaseDB';
import * as PlacesActions from './places';
import * as TagActions from './tags';
import * as NPCActions from './npcs';
import * as QuestActions from './quests';
import * as FloorActions from './floors';
import * as TileActions from './tiles';
import * as NoteActions from './notes';
import * as RaceActions from './races';
import * as OccupationActions from './occupations';
import * as ValueActions from './values';
import * as QuirkActions from './quirks';
import firebase from 'firebase';

const setListenerFor = (ref, callback, dispatch) => {
  ref.onSnapshot(snapshot => {
    snapshot.forEach(doc => {
      dispatch(callback({ ...doc.data(), id: doc.id }));
    });
  });
};

const setGenericListeners = uid => dispatch => {
  const types = [
    {
      type: 'placeTypes',
      constant: constants.Place.SET_PLACE_TYPES_LISTENER,
      action: PlacesActions.updatePlaceTypesList
    },
    {
      type: 'tags',
      constant: constants.Tag.SET_TAGS_LISTENER,
      action: TagActions.updateTagList
    },
    {
      type: 'quirks',
      constant: constants.Quirk.SET_QUIRKS_LISTENER,
      action: QuirkActions.updateQuirksList
    },
    {
      type: 'values',
      constant: constants.Value.SET_VALUES_LISTENER,
      action: ValueActions.updateValuesList
    },
    {
      type: 'races',
      constant: constants.Race.SET_RACES_LISTENER,
      action: RaceActions.updateRacesList
    },
    {
      type: 'occupations',
      constant: constants.Occupation.SET_OCCUPATIONS_LISTENER,
      action: OccupationActions.updateOccupationsList
    }
  ];
  types.forEach(genericType => {
    const ref = database.collection(genericType.type);
    const whereDefault = ref.where('default', '==', true);
    const whereCreator = ref.where('creatorId', '==', uid);
    const whereCollaborator = ref.where(
      'collaboratorIds',
      'array-contains',
      uid
    );
    dispatch({ type: genericType.constant });
    setListenerFor(whereDefault, genericType.action, dispatch);
    setListenerFor(whereCreator, genericType.action, dispatch);
    setListenerFor(whereCollaborator, genericType.action, dispatch);
  });
};

export const setListeners = () => (dispatch, getState) => {
  const userUid = getState().login.user.uid;
  let npcRef = database.collection(`npcs`).where('creatorId', '==', userUid);
  dispatch({ type: constants.Npc.SET_NPCS_LISTENER });
  setListenerFor(npcRef, NPCActions.updateNPCsList, dispatch);
  let placesRef = database
    .collection(`places`)
    .where('creatorId', '==', userUid);
  dispatch({ type: constants.Place.SET_PLACES_LISTENER });
  setListenerFor(placesRef, PlacesActions.updatePlacesList, dispatch);
  let floorsRef = database
    .collection(`floors`)
    .where('creatorId', '==', userUid);
  dispatch({ type: constants.Floor.SET_FLOORS_LISTENER });
  setListenerFor(floorsRef, FloorActions.updateFloorsList, dispatch);
  let questsRef = database
    .collection(`quests`)
    .where('creatorId', '==', userUid);
  dispatch({ type: constants.Quest.SET_QUESTS_LISTENER });
  setListenerFor(questsRef, QuestActions.updateQuestsList, dispatch);
  let notesRef = database.collection(`notes`).where('creatorId', '==', userUid);
  dispatch({ type: constants.Note.SET_NOTES_LISTENER });
  setListenerFor(notesRef, NoteActions.updateNotesList, dispatch);
  let tilesRef = database.collection(`tiles`).where('creatorId', '==', userUid);
  dispatch({ type: constants.Tile.SET_TILES_LISTENER });
  setListenerFor(tilesRef, TileActions.updateTileList, dispatch);
  dispatch(setGenericListeners(userUid));
};

export const setCurrentCampaign = campaign => dispatch => {
  dispatch(setListeners(campaign.id));
  return dispatch({ type: constants.Campaign.SET_CURRENT_CAMPAIGN, campaign });
};

const updateCampaignList = campaign => (dispatch, getState) => {
  const updatedState = { ...getState().campaigns.all };
  updatedState[campaign.id] = campaign;
  dispatch({
    type: constants.Campaign.UPDATE_CAMPAIGN_LIST,
    campaigns: updatedState
  });
};

export const setCampaignListener = currentUser => dispatch => {
  let campaignsRef = database.collection('campaigns');
  campaignsRef
    .where('creatorId', '==', currentUser.uid)
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(function(change) {
        if (change.type === 'added') {
          dispatch(
            updateCampaignList({ ...change.doc.data(), id: change.doc.id })
          );
        }
        if (change.type === 'modified') {
          dispatch(
            updateCampaignList({ ...change.doc.data(), id: change.doc.id })
          );
        }
        if (change.type === 'removed') {
          dispatch(removeCampaignFromList(change.doc.id));
        }
      });
    });
};

const setCampaignList = campaigns => dispatch => {
  dispatch({ type: constants.Campaign.SET_CAMPAIGN_LIST, campaigns });
};

export const fetchCampaigns = currentUser => dispatch => {
  let campaignsRef = database.collection('campaigns');
  return new Promise((resolve, reject) => {
    campaignsRef
      .where('creatorId', '==', currentUser.uid)
      .get()
      .then(querySnapshot => {
        let campaigns = {};
        querySnapshot.forEach(doc => {
          campaigns[doc.id] = { ...doc.data(), id: doc.id };
        });
        dispatch(setCampaignList(campaigns));
        resolve(campaigns);
      })
      .catch(err => reject(err));
  });
};

const removeCampaignFromList = campaignId => (dispatch, getState) => {
  const updatedState = { ...getState().campaigns.all };
  delete updatedState[campaignId];
  dispatch({
    type: constants.Campaign.UPDATE_CAMPAIGN_LIST,
    campaigns: updatedState
  });
};

export const deleteCampaign = campaign => dispatch => {
  dispatch({ type: constants.Campaign.DELETING_CAMPAIGN, id: campaign.id });
  ReactGA.event({
    category: 'Campaigns',
    action: 'Delete Campaign'
  });
  return new Promise((resolve, reject) => {
    database
      .collection('campaigns')
      .doc(`${campaign.id}`)
      .delete()
      .then(res => {
        dispatch(removeCampaignFromList(campaign.id));
        resolve(res);
      })
      .catch(err => {
        console.error('Something went wrong while trying to delete:', err);
        reject(err);
      });
  });
};

export const createCampaign = campaignData => (dispatch, getState) => {
  const storageRef = app.storage().ref();
  dispatch({ type: constants.Campaign.CREATING_CAMPAIGN, data: campaignData });
  ReactGA.event({
    category: 'Campaigns',
    action: 'Create Campaign'
  });
  return new Promise((resolve, reject) => {
    if (campaignData.image) {
      const imagesRef = storageRef.child(
        `${getState().login.user.uid}/campaigns/${campaignData.image.name}`
      );
      imagesRef.put(campaignData.image).then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
          const ref = `${Date.now()}`;
          database
            .collection('campaigns')
            .add({
              name: campaignData.name,
              creatorId: getState().login.user.uid,
              collaboratorIds: [],
              createdAt: firebase.firestore.Timestamp.now(),
              updatedAt: firebase.firestore.Timestamp.now(),
              description: campaignData.description,
              image: {
                downloadUrl: url,
                fileName: campaignData.image.name,
                storageRef: `${getState().login.user.uid}/campaigns/${ref}`
              }
            })
            .then(res => {
              resolve(res);
            })
            .catch(function(error) {
              reject('Error writing document: ', error);
            });
        });
      });
    } else {
      database
        .collection('campaigns')
        .add({
          name: campaignData.name,
          creatorId: getState().login.user.uid,
          collaboratorIds: [],
          createdAt: firebase.firestore.Timestamp.now(),
          updatedAt: firebase.firestore.Timestamp.now(),
          description: campaignData.description,
          image: {}
        })
        .then(res => {
          resolve(res);
        })
        .catch(function(error) {
          reject('Error writing document: ', error);
        });
    }
  });
};
