import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function ValuesReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Value.SET_VALUES_LIST:
      return Object.assign({}, state, {
        all: action.values
      });
    case constants.Value.UPDATE_VALUES_LIST:
      return Object.assign({}, state, {
        all: action.values
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
