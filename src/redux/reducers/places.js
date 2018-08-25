import * as constants from '../constants';

const initialState = {
  all: {},
  types: []
};
export default function PlaceReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Place.UPDATE_PLACE_LIST:
      return Object.assign({}, state, {
        all: action.places
      });
    case constants.Place.UPDATE_PLACE_TYPES:
      return Object.assign({}, state, {
        types: action.types
      });
    default:
      return state;
  }
}
