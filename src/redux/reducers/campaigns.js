import * as constants from '../constants';
const initialState = {
  all: {},
  currentCampaign: {}
};
export default function CampaignReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Campaign.UPDATE_CAMPAIGN_LIST:
      return Object.assign({}, state, {
        all: action.campaigns
      });
    case constants.Campaign.SET_CURRENT_CAMPAIGN:
      return Object.assign({}, state, {
        currentCampaign: action.campaign
      });
    case constants.Campaign.SET_CAMPAIGN_LIST:
      return Object.assign({}, state, {
        all: action.campaigns
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
