import ReactGA from 'react-ga';
import * as constants from '../constants';
import database, { app } from '../../firebaseDB';
import firebase from 'firebase';

export const setCurrentCampaign = campaign => dispatch => {
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
