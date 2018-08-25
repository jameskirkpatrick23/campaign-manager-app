import * as constants from '../constants';

export const updateNPCsList = npc => (dispatch, getState) => {
  const updatedState = { ...getState().npcs.all };
  updatedState[npc.id] = npc;
  dispatch({ type: constants.Npc.UPDATE_NPC_LIST, npcs: updatedState });
};
