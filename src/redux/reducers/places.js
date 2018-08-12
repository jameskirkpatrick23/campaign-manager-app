import constants from '../constants';
const initialState = {
  all: {}
};
export default function PlaceReducer(state = initialState, action) {
  switch (action.type) {
    case constants.UPDATE_PLACE_LIST:
      return Object.assign({}, state, {
        all: action.places
      });
    default:
      return state;
  }
}
