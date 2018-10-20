import * as constants from '../constants';
import database, { app } from '../../firebase';
import * as FloorActions from './floors';
import firebase from 'firebase';

export const updateTileList = tile => (dispatch, getState) => {
  const updatedState = { ...getState().tiles.all };
  updatedState[tile.id] = { ...tile, createdAt: tile.createdAt.toDate() };
  dispatch({ type: constants.Tile.UPDATE_TILE_LIST, tiles: updatedState });
};

const updateTileParent = (tileData, res, resolve) => (dispatch, getState) => {
  const usedFloor = getState().floors.all[tileData.floorId];
  database
    .collection(`floors`)
    .doc(tileData.floorId)
    .update({
      tiles: {
        ...usedFloor.tiles,
        [`${tileData.row}${tileData.col}`]: { id: res.id }
      }
    })
    .then(re => {
      resolve(res);
    })
    .catch(err => {});
};

const removeTileFromParent = (tile, floorId) => dispatch => {
  dispatch(FloorActions.removeTiles(tile, floorId));
};

const removeTileFromList = tileId => (dispatch, getState) => {
  const updatedState = { ...getState().tiles.all };
  delete updatedState[tileId];
  dispatch({
    type: constants.Tile.UPDATE_TILE_LIST,
    tiles: updatedState
  });
};

export const createTile = tileData => (dispatch, getState) => {
  dispatch({ type: constants.Tile.CREATING_TILE, tile: tileData });
  return new Promise((resolve, reject) => {
    uploadImage(
      tileData.selectedFile,
      getState().login.user.uid,
      tileData.floorId,
      tileData
    ).then(imageInformation => {
      const tileDataCopy = { ...tileData };
      delete tileDataCopy.selectedFile;
      delete tileDataCopy.selectedFileUrl;
      database
        .collection(`tiles`)
        .add({
          floorId: tileData.floorId,
          image: imageInformation,
          creatorId: getState().login.user.uid,
          createdAt: firebase.firestore.Timestamp.now(),
          updatedAt: firebase.firestore.Timestamp.now(),
          legend: tileData.legend,
          description: tileData.description,
          loot: tileData.loot,
          skillChecks: tileData.skillChecks,
          other: tileData.other,
          objectiveIds: tileData.objectiveIds
        })
        .then(res => {
          dispatch(updateTileParent({ ...tileData, id: res.id }, res, resolve));
        })
        .catch(error => {
          reject('Error writing document: ', error);
        });
    });
  });
};

export const updateTile = tileData => (dispatch, getState) => {
  dispatch({ type: constants.Tile.UPDATING_TILE, tile: tileData });
  const currentTile = getState().tiles.all[tileData.id];
  return new Promise((resolve, reject) => {
    uploadImage(
      tileData.selectedFile,
      getState().login.user.uid,
      tileData.floorId,
      currentTile
    ).then(imageInformation => {
      const tileDataCopy = { ...tileData };
      delete tileDataCopy.selectedFile;
      delete tileDataCopy.selectedFileUrl;
      let usedImageInfo = imageInformation;
      if (!Object.keys(imageInformation).length) {
        usedImageInfo = { ...getState().tiles.all[tileData.id].image };
      }
      database
        .collection('tiles')
        .doc(currentTile.id)
        .update({
          image: usedImageInfo,
          updatedAt: firebase.firestore.Timestamp.now(),
          legend: tileData.legend,
          description: tileData.description,
          loot: tileData.loot,
          skillChecks: tileData.skillChecks,
          other: tileData.other,
          objectiveIds: tileData.objectiveIds
        })
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject('Error writing document: ', error);
        });
    });
  });
};

export const deleteTile = tile => (dispatch, getState) => {
  dispatch({ type: constants.Tile.DELETING_TILE, tile });
  const storageRef = app.storage().ref();
  const foundTile = { ...tile }; //we want a copy because we are going to delete the redux stores
  const foundFloor = getState().floors.all[foundTile.floorId];
  const floorHasTile =
    foundFloor &&
    Object.keys(foundFloor.tiles).find(tile => tile.id === foundTile.id);
  //we want a copy because we are going to delete the redux stores
  return new Promise((resolve, reject) => {
    database
      .collection('tiles')
      .doc(foundTile.id)
      .delete()
      .then(res => {
        storageRef
          .child(foundTile.image.storageRef)
          .delete()
          .then(deleteRes => {
            if (floorHasTile) {
              dispatch(removeTileFromParent(foundTile, foundTile.floorId));
            }
            dispatch(removeTileFromList(foundTile.id));
            resolve(deleteRes);
          })
          .catch(deleteError => {
            reject('Error deleting image from tile', deleteError);
          });
      })
      .catch(error => {
        reject('Error writing document: ', error);
      });
  });
};

const uploadImage = (file, uid, floorId, tile) => {
  const storageRef = app.storage().ref();
  return new Promise((resolve, reject) => {
    //if you are not changing the file, just let it go
    if (!file) resolve({});
    const ref = `${Date.now()}`;
    const refString = `${uid}/floors/${floorId}/tiles/${ref}`;
    const uploadRef = storageRef.child(refString);
    if (tile && tile.image && tile.image.storageRef) {
      storageRef
        .child(tile.image.storageRef)
        .delete()
        .then(() => {
          uploadRef
            .put(file)
            .then(snapshot => {
              snapshot.ref
                .getDownloadURL()
                .then(url => {
                  resolve({
                    downloadUrl: url,
                    fileName: file.name,
                    storageRef: refString
                  });
                })
                .catch(err => {
                  reject(err);
                });
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    } else {
      uploadRef
        .put(file)
        .then(snapshot => {
          snapshot.ref
            .getDownloadURL()
            .then(url => {
              resolve({
                downloadUrl: url,
                fileName: file.name,
                storageRef: refString
              });
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    }
  });
};
