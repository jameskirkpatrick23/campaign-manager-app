import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function TagReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Tag.UPDATE_TAG_LIST:
      return Object.assign({}, state, {
        all: action.tags
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
