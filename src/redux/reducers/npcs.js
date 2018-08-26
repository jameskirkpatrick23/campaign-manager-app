import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function NPCReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Npc.UPDATE_NPC_LIST:
      return Object.assign({}, state, {
        all: action.npcs
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
