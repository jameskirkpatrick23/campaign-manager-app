import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function QuirksReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Quirks.SET_QUIRKS_LIST:
      return Object.assign({}, state, {
        all: action.quirks
      });
    case constants.Quirks.UPDATE_QUIRK_LIST:
      return Object.assign({}, state, {
        all: action.quirks
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
