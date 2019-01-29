import * as constants from '../constants';
const initialState = {
  all: {},
  updating: true
};
export default function EventReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Event.UPDATE_EVENT_LIST:
      return Object.assign({}, state, {
        all: action.events
      });
    case constants.Event.UPDATE_EVENT:
      return Object.assign({}, state, {
        updating: true
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
