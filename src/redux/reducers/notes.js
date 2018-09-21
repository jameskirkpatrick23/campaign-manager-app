import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function NoteReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Note.UPDATE_NOTE_LIST:
      return Object.assign({}, state, {
        all: action.notes
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
