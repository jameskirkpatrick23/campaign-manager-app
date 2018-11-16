import ReactGA from 'react-ga';
import { Npc } from '../constants';
import database from '../../firebaseDB';
import firebase from 'firebase';
import {
  generateImagePromises,
  handleFileChanges,
  deleteConnected,
  generateDeleteKeys,
  stripExcessData,
  updateConnected,
  conditionallyUpdateConnected
} from './reusable';

export const updateNPCsList = npc => (dispatch, getState) => {
  const updatedState = { ...getState().npcs.all };
  updatedState[npc.id] = npc;
  dispatch({ type: Npc.UPDATE_NPC_LIST, npcs: updatedState });
};

const removeNPCFromList = npcId => (dispatch, getState) => {
  const updatedState = { ...getState().npcs.all };
  delete updatedState[npcId];
  dispatch({ type: Npc.UPDATE_NPC_LIST, npcs: updatedState });
};

export const editNPC = npcData => (dispatch, getState) => {
  ReactGA.event({
    category: 'NPCs',
    action: 'Edit NPC'
  });
  dispatch({ type: Npc.UPDATE_NPC, data: npcData });
  const userUid = getState().login.user.uid;
  const currentNPC = getState().npcs.all[npcData.npcId];

  const batch = database.batch();
  const usedRef = database.collection('npcs').doc(npcData.npcId);
  conditionallyUpdateConnected(currentNPC, npcData, batch);
  const usedData = { ...npcData };
  stripExcessData(usedData);
  const fileChanges = handleFileChanges(npcData, currentNPC, userUid);

  return new Promise((resolve, reject) => {
    // make all the new images
    return Promise.all(fileChanges.newImagePromiseArray)
      .then(resolvedImages => {
        Promise.all(fileChanges.newAttachedFilePromiseArray)
          .then(resolvedFiles => {
            Promise.all([
              ...fileChanges.deleteImageArray,
              ...fileChanges.deleteAttachedArray
            ])
              .then(() => {
                batch.update(usedRef, {
                  ...usedData,
                  updatedAt: firebase.firestore.Timestamp.now(),
                  images: fileChanges.currentImages.concat(resolvedImages),
                  attachedFiles: fileChanges.currentAttachedFiles.concat(
                    resolvedFiles
                  )
                });
                batch
                  .commit()
                  .then(res => {
                    resolve(res);
                  })
                  .catch(error => {
                    reject(`Error writing document: ${error.message}`);
                  });
              })
              .catch(err => {
                reject(
                  `Something went wrong while trying upload files: ${
                    err.message
                  }`
                );
              });
          })
          .catch(err => {
            reject(
              `Something went wrong while trying upload images: ${err.message}`
            );
          });
      })
      .catch(err => {
        reject(
          `Something went wrong while trying upload images and files: ${
            err.message
          }`
        );
      });
  });
};

export const createNPC = npcData => (dispatch, getState) => {
  ReactGA.event({
    category: 'NPCs',
    action: 'Create NPC'
  });
  dispatch({ type: Npc.CREATING_NPC, data: npcData });
  const userUid = getState().login.user.uid;
  const currentCampaign = getState().campaigns.currentCampaign;

  const batch = database.batch();
  const usedRef = database.collection('npcs').doc();
  const usedData = { ...npcData, id: usedRef.id };

  updateConnected(usedData, 'npcIds', batch);

  const newFiles = generateImagePromises(npcData, userUid, 'npcs');

  return new Promise((resolve, reject) => {
    stripExcessData(usedData);
    return Promise.all(newFiles.imagePromiseArray)
      .then(resolvedImages => {
        Promise.all(newFiles.attachedFilePromiseArray)
          .then(resolvedFiles => {
            batch.set(usedRef, {
              ...usedData,
              createdAt: firebase.firestore.Timestamp.now(),
              updatedAt: firebase.firestore.Timestamp.now(),
              noteIds: [],
              campaignIds: [currentCampaign.id],
              images: resolvedImages,
              attachedFiles: resolvedFiles,
              creatorId: userUid,
              collaboratorIds: []
            });
            batch
              .commit()
              .then(res => {
                resolve(res);
              })
              .catch(error => {
                reject(`Error writing document: ${error.message}`);
              });
          })
          .catch(err => {
            reject(
              `Something went wrong while trying upload files: ${err.message}`
            );
          });
      })
      .catch(err => {
        reject(
          `Something went wrong while trying upload images: ${err.message}`
        );
      });
  });
};

export const deleteNPC = npc => dispatch => {
  ReactGA.event({
    category: 'NPCs',
    action: 'Delete NPC'
  });
  dispatch({ type: Npc.DELETING_NPC, id: npc.id });
  const batch = database.batch();
  const usedRef = database.collection('npcs').doc(npc.id);
  batch.delete(usedRef);
  dispatch(deleteConnected(npc, 'npcIds', batch));
  const filePromises = generateDeleteKeys(npc);

  return new Promise((resolve, reject) => {
    Promise.all(filePromises)
      .then(() => {
        batch
          .commit()
          .then(res => {
            dispatch(removeNPCFromList(npc.id));
            resolve(res);
          })
          .catch(error => {
            reject(
              `Something went wrong while trying to delete: ${error.message}`
            );
          });
      })
      .catch(err => {
        reject(
          `Failed to delete all the images and files for place ${err.message}`
        );
      });
  });
};
