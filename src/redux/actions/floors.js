import * as constants from '../constants';

export const updateFloorsList = floor => (dispatch, getState) => {
  const updatedState = { ...getState().floors.all };
  updatedState[floor.id] = floor;
  dispatch({ type: constants.Floor.UPDATE_FLOOR_LIST, floors: updatedState });
};

export const createFloor = floor => (dispatch, getState) => {
  console.warn(floor);
};
