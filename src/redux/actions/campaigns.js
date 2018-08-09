import constants from '../constants';
import database, { app } from '../../firebase';

export const setCurrentCampaign = campaign => {
  return { type: constants.SET_CURRENT_CAMPAIGN, campaign };
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
        console.warn('hello');
        dispatch(updateCampaignList({ ...doc.data(), id: doc.id }));
      });
    });
};
