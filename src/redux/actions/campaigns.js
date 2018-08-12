import constants from '../constants';
import database from '../../firebase';
import * as PlacesActions from './places';
import * as NPCActions from './npcs';
import * as QuestActions from './quests';

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
      snapshot.forEach(doc => {
        dispatch(updateCampaignList({ ...doc.data(), id: doc.id }));
      });
    });
};
