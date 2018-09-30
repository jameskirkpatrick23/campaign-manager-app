import * as constants from '../constants';
import database, { app } from '../../firebase';
import * as PlaceActions from './places';
import firebase from 'firebase';

export const updateFloorsList = floor => (dispatch, getState) => {
  const updatedState = { ...getState().floors.all };
  updatedState[floor.id] = floor;
  dispatch({ type: constants.Floor.UPDATE_FLOOR_LIST, floors: updatedState });
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

const uploadImage = (file, uid, floorId) => {
  const storageRef = app.storage().ref();

  return new Promise((resolve, reject) => {
    const currentUpload = file;
    const uploadRef = storageRef.child(
      `${uid}/tiles/${floorId}/${currentUpload.name}`
    );
    uploadRef
      .put(currentUpload)
      .then(snapshot => {
        snapshot.ref
          .getDownloadURL()
          .then(url => {
            resolve({ downloadUrl: url, fileName: currentUpload.name });
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};

export const createTile = tileData => (dispatch, getState) => {
  const floorCopy = { ...getState().floors.all[tileData.floorId] };

  return new Promise((resolve, reject) => {
    uploadImage(
      tileData.selectedFile,
      getState().login.user.uid,
      tileData.floorId
    )
      .then(imageInformation => {
        const tileDataCopy = { ...tileData };
        delete tileDataCopy.selectedFile;
        delete tileDataCopy.selectedFileUrl;

        floorCopy.tiles[tileDataCopy.id] = {
          ...floorCopy.tiles[tileDataCopy.id],
          ...imageInformation,
          ...tileDataCopy
        };

        database
          .collection('floors')
          .doc(tileData.floorId)
          .update({ ...floorCopy })
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            reject('Error writing document: ', error);
          });
      })
      .catch(err => {
        reject('Error writing document: ', err);
      });
  });
};
