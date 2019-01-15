import * as constants from '../constants';
const initialState = {
  all: {},
  updating: true
};
export default function QuestReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Quest.UPDATE_QUEST_LIST:
      return Object.assign({}, state, {
        all: action.quests,
        updating: false
      });
    case constants.Quest.UPDATE_QUESTS:
      return Object.assign({}, state, {
        updating: true
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
