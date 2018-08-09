import constants from '../constants';
const initialState = {
  all: {},
  currentCampaign: {}
};
export default function CampaignReducer(state = initialState, action) {
  switch (action.type) {
    case constants.UPDATE_CAMPAIGN_LIST:
      return Object.assign({}, state, {
        all: action.campaigns
      });
    case constants.SET_CURRENT_CAMPAIGN:
      return Object.assign({}, state, {
        currentCampaign: action.campaign
      });
    default:
      return state;
  }
}
