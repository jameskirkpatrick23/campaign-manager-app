import * as constants from '../constants';

export const updateQuestsList = quest => (dispatch, getState) => {
  const updatedState = { ...getState().quests.all };
  updatedState[quest.id] = quest;
  dispatch({ type: constants.Quest.UPDATE_QUEST_LIST, quests: updatedState });
};
