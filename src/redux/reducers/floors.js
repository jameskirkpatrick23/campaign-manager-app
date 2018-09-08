import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function FloorReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Floor.UPDATE_FLOOR_LIST:
      return Object.assign({}, state, {
        all: action.floors
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
