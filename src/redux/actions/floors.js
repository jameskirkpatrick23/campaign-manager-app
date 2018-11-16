import ReactGA from 'react-ga';
import * as constants from '../constants';
import database from '../../firebaseDB';
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

export const updateTiles = (floor, newTiles) => () => {
  ReactGA.event({
    category: 'Floors',
    action: 'Rearrange Tiles'
  });
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
        reject('Error writing document: ', error.message);
      });
  });
};

export const updateFloor = floorData => (dispatch, getState) => {
  ReactGA.event({
    category: 'Floors',
    action: 'Update Floor'
  });
  const currentFloorCopy = getState().floors.all[floorData.floorId];
  const allTiles = getState().tiles.all;
  const tiles = { ...currentFloorCopy.tiles };
  const newTiles = {};
  const makingRowsSmaller = currentFloorCopy.rows > floorData.numRows;
  const makingColsSmaller = currentFloorCopy.cols > floorData.numCols;
  let usedRows = makingRowsSmaller ? currentFloorCopy.rows : floorData.numRows;
  let usedCols = makingColsSmaller ? currentFloorCopy.cols : floorData.numCols;

  for (let i = 0; i < usedRows; i++) {
    for (let j = 0; j < usedCols; j++) {
      let findableTile = tiles[`${i}${j}`];
      if (
        (makingRowsSmaller && i + 1 > floorData.numRows) ||
        (makingColsSmaller && j + 1 > floorData.numCols)
      ) {
        if (findableTile && findableTile.id && allTiles[findableTile.id]) {
          dispatch(TileActions.deleteTile(allTiles[findableTile.id]));
        }
        newTiles[`${i}${j}`] = {};
      } else {
        newTiles[`${i}${j}`] = findableTile ? { ...findableTile } : {};
      }
    }
  }

  return new Promise((resolve, reject) => {
    database
      .collection(`floors`)
      .doc(floorData.floorId)
      .update({
        ...floorData,
        questIds: [],
        updatedAt: firebase.firestore.Timestamp.now(),
        tiles: newTiles //{11: {}, 12: {}, 21: {} } USE FLOOR THEN COL FOR ID OF OBJECT SO YOU CAN DO 'floor.tiles[`${row}${col}`]'
      })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject('Error writing document: ', error.message);
      });
  });
};

export const createFloor = floorData => (dispatch, getState) => {
  ReactGA.event({
    category: 'Floors',
    action: 'Create Floor'
  });
  const userUid = getState().login.user.uid;
  const tiles = {};
  for (let i = 0; i < floorData.numRows; i++) {
    for (let j = 0; j < floorData.numCols; j++) {
      tiles[`${i}${j}`] = {};
    }
  }
  const { arrayUnion } = firebase.firestore.FieldValue;
  const batch = database.batch();
  const usedRef = database.collection('floors').doc();
  const usedId = usedRef.id;
  batch.set({
    ...floorData,
    questIds: [],
    createdAt: firebase.firestore.Timestamp.now(),
    tiles, //{11: {}, 12: {}, 21: {} } USE FLOOR THEN COL FOR ID OF OBJECT SO YOU CAN DO 'floor.tiles[`${row}${col}`]'
    creatorId: userUid,
    collaboratorIds: []
  });
  const placeRef = database.collection('places').doc(usedId);
  batch.update(placeRef, { floorIds: arrayUnion(usedId) });
  return new Promise((resolve, reject) => {
    batch
      .commit()
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject('Error writing document: ', error.message);
      });
  });
};

const getUsedTiles = (floor, allTiles) => {
  const tiles = [];
  const rows = Array.from(new Array(floor.rows).keys());
  const cols = Array.from(new Array(floor.cols).keys());
  rows.forEach(row => {
    cols.forEach(col => {
      let floorTile = floor.tiles[`${row}${col}`];
      if (floorTile && floorTile.id) tiles.push({ ...allTiles[floorTile.id] });
    });
  });
  return tiles;
};

export const deleteFloor = floorId => (dispatch, getState) => {
  ReactGA.event({
    category: 'Floors',
    action: 'Delete Floor'
  });
  const usedFloor = { ...getState().floors.all[floorId] };
  const allTiles = getState().tiles.all;
  const usedTiles = getUsedTiles(usedFloor, allTiles);
  const deletePromises = generateDeleteTilePromises(usedTiles, dispatch);
  const { arrayRemove } = firebase.firestore.FieldValue;
  const batch = database.batch();
  const floorRef = database.collection('floors').doc(floorId);
  batch.delete(floorRef);
  if (getState().places.all[usedFloor.placeId]) {
    const placeRef = database.collection('places').doc(usedFloor.placeId);
    batch.update(placeRef, { floorIds: arrayRemove(usedFloor.id) });
  }
  return new Promise((resolve, reject) => {
    Promise.all(deletePromises)
      .then(() => {
        batch
          .commit()
          .then(response => {
            dispatch(removeFloorFromList(floorId));
            resolve(response);
          })
          .catch(er => {
            reject(
              `Something went wrong removing the floor from the place ${
                er.message
              }`
            );
          });
      })
      .catch(error => {
        reject(
          `Something went wrong while deleting the floor ${error.message}`
        );
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
