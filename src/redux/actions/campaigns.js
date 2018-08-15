import constants from '../constants';
import database, { app } from '../../firebase';
import * as PlacesActions from './places';
import * as NPCActions from './npcs';
import * as QuestActions from './quests';
import campaigns from '../../pages/campaigns';

const setListenerFor = (ref, callback, dispatch) => {
  ref.onSnapshot(snapshot => {
    snapshot.forEach(doc => {
      dispatch(callback({ ...doc.data(), id: doc.id }));
    });
  });
};

const setListeners = campaignId => dispatch => {
  let npcRef = database.collection(`campaigns/${campaignId}/npcs`);
  dispatch({ type: constants.SET_NPCS_LISTENER, id: campaignId });
  setListenerFor(npcRef, NPCActions.updateNPCsList, dispatch);
  let placesRef = database.collection(`campaigns/${campaignId}/places`);
  dispatch({ type: constants.SET_PLACES_LISTENER, id: campaignId });
  setListenerFor(placesRef, PlacesActions.updatePlacesList, dispatch);
  let questsRef = database.collection(`campaigns/${campaignId}/quests`);
  dispatch({ type: constants.SET_QUESTS_LISTENER, id: campaignId });
  setListenerFor(questsRef, QuestActions.updateQuestsList, dispatch);
};

export const setCurrentCampaign = campaign => dispatch => {
  dispatch(setListeners(campaign.id));
  return dispatch({ type: constants.SET_CURRENT_CAMPAIGN, campaign });
};

const updateCampaignList = campaign => (dispatch, getState) => {
  const updatedState = { ...getState().campaigns.all };
  updatedState[campaign.id] = campaign;
  dispatch({ type: constants.UPDATE_CAMPAIGN_LIST, campaigns: updatedState });
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
  dispatch({ type: constants.SET_CAMPAIGN_LIST, campaigns });
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
  dispatch({ type: constants.UPDATE_CAMPAIGN_LIST, campaigns: updatedState });
};

export const deleteCampaign = campaign => dispatch => {
  dispatch({ type: constants.DELETING_CAMPAIGN, id: campaign.id });
  return new Promise((resolve, reject) => {
    database
      .collection('campaigns')
      .doc(`${campaign.id}`)
      .delete()
      .then(res => {
        dispatch(removeCampaignFromList(campaign.id));
        resolve(res);
        console.log('Campaign deleted successfully');
      })
      .catch(err => {
        console.error('Something went wrong while trying to delete:', err);
        reject(err);
      });
  });
};

export const createCampaign = campaignData => (dispatch, getState) => {
  const storageRef = app.storage().ref();
  const imagesRef = storageRef.child(`campaigns/${campaignData.image.name}`);
  dispatch({ type: constants.CREATING_CAMPAIGN, data: campaignData });
  return new Promise((resolve, reject) => {
    imagesRef.put(campaignData.image).then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        database
          .collection('campaigns')
          .add({
            name: campaignData.name,
            creatorId: getState().login.user.uid,
            description: campaignData.description,
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
