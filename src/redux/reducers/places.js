import * as constants from '../constants';

const initialState = {
  all: {},
  types: {},
  updating: true
};

export default function PlaceReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Place.UPDATE_PLACE_LIST:
      return Object.assign({}, state, {
        all: action.places,
        updating: false
      });
    case constants.Place.UPDATE_PLACES:
      return Object.assign({}, state, {
        updating: true
      });
    case constants.Place.SET_PLACE_TYPES_LIST:
      return Object.assign({}, state, {
        types: action.types
      });
    case constants.Place.UPDATE_PLACE_TYPES:
      return Object.assign({}, state, {
        types: action.types
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
