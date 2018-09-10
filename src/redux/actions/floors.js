import * as constants from '../constants';
import database from '../../firebase';
import * as PlaceActions from './places';

export const updateFloorsList = floor => (dispatch, getState) => {
  const updatedState = { ...getState().floors.all };
  updatedState[floor.id] = floor;
  dispatch({ type: constants.Floor.UPDATE_FLOOR_LIST, floors: updatedState });
};

export const createFloor = floorData => (dispatch, getState) => {
  const userUid = getState().login.user.uid;
  return new Promise((resolve, reject) => {
    database
      .collection(`floors`)
      .add({
        placeId: floorData.placeId,
        cols: floorData.numCols,
        rows: floorData.numRows,
        description: floorData.description,
        name: floorData.name,
        tileIds: [],
        creatorId: userUid,
        collaboratorIds: []
      })
      .then(res => {
        PlaceActions.updatePlaceFloors(floorData.placeId, res.id, dispatch)
          .then(placeResolve => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(error => {
        console.error('how do i fix thisssss');
        reject('Error writing document: ', error);
      });
  });
};
