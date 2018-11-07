import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function AlignmentsReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Alignments.SET_ALIGNMENTS_LIST:
      return Object.assign({}, state, {
        all: action.alignments
      });
    case constants.Alignments.UPDATE_ALIGNMENT_LIST:
      return Object.assign({}, state, {
        all: action.alignments
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
