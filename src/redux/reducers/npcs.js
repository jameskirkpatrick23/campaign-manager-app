import * as constants from '../constants';
const initialState = {
  all: {},
  updating: false
};
export default function NPCReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Npc.UPDATE_NPC_LIST:
      return Object.assign({}, state, {
        all: action.npcs,
        updating: false
      });
    case constants.Npc.UPDATE_NPCS:
      return Object.assign({}, state, {
        updating: true
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
