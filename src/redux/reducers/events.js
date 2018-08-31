import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function EventReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Event.UPDATE_EVENT_LIST:
      return Object.assign({}, state, {
        all: action.events
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
