import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function RacesReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Races.SET_RACES_LIST:
      return Object.assign({}, state, {
        all: action.races
      });
    case constants.Races.UPDATE_RACE_LIST:
      return Object.assign({}, state, {
        all: action.races
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
