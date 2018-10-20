import * as constants from '../constants';
const initialState = {
  all: {}
};
export default function TileReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Tile.UPDATE_TILE_LIST:
      return Object.assign({}, state, {
        all: action.tiles
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
