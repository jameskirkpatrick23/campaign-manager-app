import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function AlignmentsReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Alignment.SET_ALIGNMENTS_LIST:
      return Object.assign({}, state, {
        all: action.alignments
      });
    case constants.Alignment.UPDATE_ALIGNMENT_LIST:
      return Object.assign({}, state, {
        all: action.alignments
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
