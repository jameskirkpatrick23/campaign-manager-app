import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function OccupationsReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Occupations.SET_OCCUPATIONS_LIST:
      return Object.assign({}, state, {
        all: action.occupations
      });
    case constants.Occupations.UPDATE_OCCUPATION_LIST:
      return Object.assign({}, state, {
        all: action.occupations
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
