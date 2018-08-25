import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function QuestReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Quest.UPDATE_QUEST_LIST:
      return Object.assign({}, state, {
        all: action.quests
      });
    default:
      return state;
  }
}
