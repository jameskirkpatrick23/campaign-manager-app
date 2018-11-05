import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function GendersReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Genders.SET_GENDERS_LIST:
      return Object.assign({}, state, {
        all: action.genders
      });
    case constants.Genders.UPDATE_GENDER_LIST:
      return Object.assign({}, state, {
        all: action.genders
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
