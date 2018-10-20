import * as constants from '../constants';
import database, { app } from '../../firebase';
import * as PlaceActions from './places';
import firebase from 'firebase';
import * as TileActions from './tiles';

export const updateFloorsList = floor => (dispatch, getState) => {
  const updatedState = { ...getState().floors.all };
  updatedState[floor.id] = floor;
  dispatch({ type: constants.Floor.UPDATE_FLOOR_LIST, floors: updatedState });
};

const removeFloorFromList = floorId => (dispatch, getState) => {
  const updatedState = { ...getState().floors.all };
  delete updatedState[floorId];
  dispatch({
    type: constants.Floor.UPDATE_FLOOR_LIST,
    floors: updatedState
  });
};

export const updateTiles = (floor, newTiles) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    database
      .collection(`floors`)
      .doc(floor.id)
      .update({
        updatedAt: firebase.firestore.Timestamp.now(),
        tiles: newTiles //{11: {}, 12: {}, 21: {} } USE FLOOR THEN COL FOR ID OF OBJECT SO YOU CAN DO 'floor.tiles[`${row}${col}`]'
      })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject('Error writing document: ', error);
      });
  });
};

export const updateFloor = floorData => (dispatch, getState) => {
  const currentFloorCopy = getState().floors.all[floorData.floorId];
  const tiles = { ...currentFloorCopy.tiles };
  const newTiles = {};
  for (let i = 0; i < floorData.numRows; i++) {
    for (let j = 0; j < floorData.numCols; j++) {
      if (tiles[`${i}${j}`] === undefined) {
        //for instance you have added a row or column
        newTiles[`${i}${j}`] = {};
      } else {
        //otherwise use the old data as the new one
        newTiles[`${i}${j}`] = { ...tiles[`${i}${j}`] };
      }
    }
  }

  return new Promise((resolve, reject) => {
    database
      .collection(`floors`)
      .doc(floorData.floorId)
      .update({
        cols: floorData.numCols,
        rows: floorData.numRows,
        description: floorData.description,
        questIds: [],
        updatedAt: firebase.firestore.Timestamp.now(),
        name: floorData.name,
        tiles: newTiles //{11: {}, 12: {}, 21: {} } USE FLOOR THEN COL FOR ID OF OBJECT SO YOU CAN DO 'floor.tiles[`${row}${col}`]'
      })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject('Error writing document: ', error);
      });
  });
};

export const createFloor = floorData => (dispatch, getState) => {
  const userUid = getState().login.user.uid;
  const tiles = {};
  for (let i = 0; i < floorData.numRows; i++) {
    for (let j = 0; j < floorData.numCols; j++) {
      tiles[`${i}${j}`] = {};
    }
  }
  return new Promise((resolve, reject) => {
    database
      .collection(`floors`)
      .add({
        placeId: floorData.placeId,
        cols: floorData.numCols,
        rows: floorData.numRows,
        description: floorData.description,
        questIds: [],
        createdAt: firebase.firestore.Timestamp.now(),
        name: floorData.name,
        tiles, //{11: {}, 12: {}, 21: {} } USE FLOOR THEN COL FOR ID OF OBJECT SO YOU CAN DO 'floor.tiles[`${row}${col}`]'
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
        reject('Error writing document: ', error);
      });
  });
};

const removeFloorFromPlace = (floorId, placeId) => {
  return new Promise((resolve, reject) => {
    database
      .collection('places')
      .doc(placeId)
      .update({
        floorIds: firebase.firestore.FieldValue.arrayRemove(floorId)
      })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(`Unable to remove floor from place ${error}`);
      });
  });
};

const getUsedTiles = (floor, allTiles) => {
  const tiles = [];
  const rows = Array.from(Array(floor.rows).keys());
  const cols = Array.from(Array(floor.cols).keys());
  rows.forEach(row => {
    cols.forEach(col => {
      let floorTile = floor.tiles[`${row}${col}`];
      if (floorTile && floorTile.id) tiles.push({ ...allTiles[floorTile.id] });
    });
  });
  return tiles;
};

export const deleteFloor = floorId => (dispatch, getState) => {
  const usedFloor = { ...getState().floors.all[floorId] };
  const allTiles = getState().tiles.all;
  const usedTiles = getUsedTiles(usedFloor, allTiles);
  const deletePromises = generateDeleteTilePromises(usedTiles, dispatch);
  return new Promise((resolve, reject) => {
    Promise.all(deletePromises)
      .then(allPromRes => {
        database
          .collection('floors')
          .doc(floorId)
          .delete()
          .then(response => {
            removeFloorFromPlace(floorId, usedFloor.placeId)
              .then(re => {
                dispatch(removeFloorFromList(floorId));
                resolve(response);
              })
              .catch(er => {
                reject(
                  `Something went wrong removing the floor from the place ${er}`
                );
              });
          })
          .catch(error => {
            reject(`Something went wrong while deleting the floor ${error}`);
          });
      })
      .catch(allPromErr => {
        reject(`Something went wrong deleting the tiles ${allPromErr}`);
      });
  });
};

const generateDeleteTilePromises = (tiles, dispatch) => {
  return tiles.map(tile => {
    return dispatch(TileActions.deleteTile(tile));
  });
};

export const removeTiles = (tile, floorId) => (dispatch, getState) => {
  const usedFloor = getState().floors.all[floorId];
  return new Promise((resolve, reject) => {
    database
      .collection(`floors`)
      .doc(floorId)
      .update({
        tiles: {
          ...usedFloor.tiles,
          [`${tile.row}${tile.col}`]: {}
        }
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
