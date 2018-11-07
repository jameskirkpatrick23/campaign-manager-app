import { Npc } from '../constants';
import database from '../../firebase';
import firebase from 'firebase';
import _ from 'lodash';
import {
  generatePromiseArray,
  generateFileDeletePromiseArray
} from './reusable';
import { deleteNote } from './notes';

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
  dispatch({ type: Npc.UPDATE_NPC, data: npcData });
  const userUid = getState().login.user.uid;
  const currentNPC = getState().npcs.all[npcData.npcId];

  const batch = database.batch();
  const usedRef = database.collection('npcs').doc(currentNPC.id);
  const { arrayRemove, arrayUnion } = firebase.firestore.FieldValue;

  _.uniq([...currentNPC.placeIds, ...npcData.placeIds]).forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    if (!npcData.placeIds.includes(placeId)) {
      // delete if newData !include oldId
      batch.update(placeRef, { npcIds: arrayRemove(currentNPC.id) });
    } else {
      batch.update(placeRef, { npcIds: arrayUnion(currentNPC.id) });
    }
  });

  _.uniq([...currentNPC.npcIds, ...npcData.npcIds]).forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    if (!npcData.npcIds.includes(npcId)) {
      // delete if newData !include oldId
      batch.update(npcRef, { npcIds: arrayRemove(currentNPC.id) });
    } else {
      batch.update(npcRef, { npcIds: arrayUnion(currentNPC.id) });
    }
  });

  const {
    deleteimagesKeys,
    deleteattachedFilesKeys,
    newImages,
    newAttachedFiles,
    images,
    attachedFiles
  } = npcData;

  const deleteImageArray = generateFileDeletePromiseArray(
    deleteimagesKeys,
    currentNPC.images
  );
  const deleteAttachedArray = generateFileDeletePromiseArray(
    deleteattachedFilesKeys,
    currentNPC.attachedFiles
  );
  const newImagePromiseArray = generatePromiseArray(
    newImages,
    userUid,
    'images',
    'npcs'
  );
  const newAttachedFilePromiseArray = generatePromiseArray(
    newAttachedFiles,
    userUid,
    'attachedFiles',
    'npcs'
  );

  let currentImages = Object.keys(images).map(key => images[key]);
  let currentAttachedFiles = Object.keys(attachedFiles).map(
    key => attachedFiles[key]
  );

  return new Promise((resolve, reject) => {
    // make all the new images
    return Promise.all(newImagePromiseArray)
      .then(resolvedImages => {
        Promise.all(newAttachedFilePromiseArray)
          .then(resolvedFiles => {
            Promise.all([...deleteImageArray, ...deleteAttachedArray])
              .then(() => {
                currentImages = currentImages.concat(resolvedImages);
                currentAttachedFiles = currentAttachedFiles.concat(
                  resolvedFiles
                );
                batch.update(usedRef, {
                  ...npcData,
                  updatedAt: firebase.firestore.Timestamp.now(),
                  images: currentImages,
                  attachedFiles: currentAttachedFiles
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
  dispatch({ type: Npc.CREATING_NPC, data: npcData });
  const userUid = getState().login.user.uid;
  const currentCampaign = getState().campaigns.currentCampaign;

  const batch = database.batch();
  const usedRef = database.collection('npcs').doc();
  const usedId = usedRef.id;
  const { arrayUnion } = firebase.firestore.FieldValue;

  npcData.placeIds.forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    batch.update(placeRef, { npdIds: arrayUnion(usedId) });
  });
  npcData.npcIds.forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    batch.update(npcRef, { npdIds: arrayUnion(usedId) });
  });

  const imagePromiseArray = generatePromiseArray(
    npcData.newImages,
    userUid,
    'images',
    'npcs'
  );
  const attachedFilePromiseArray = generatePromiseArray(
    npcData.newAttachedFiles,
    userUid,
    'files',
    'npcs'
  );

  return new Promise((resolve, reject) => {
    return Promise.all(imagePromiseArray)
      .then(resolvedImages => {
        Promise.all(attachedFilePromiseArray)
          .then(resolvedFiles => {
            batch.set(usedRef, {
              ...npcData,
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
  dispatch({ type: Npc.DELETING_NPC, id: npc.id });
  const { arrayRemove, arrayUnion } = firebase.firestore.FieldValue;
  const batch = database.batch();
  const usedRef = database.collection('npcs').doc(npc.id);
  batch.delete(usedRef);
  npc.noteIds.forEach(noteId => {
    const noteRef = database.collection('notes').doc(noteId);
    batch.delete(noteRef);
    dispatch(deleteNote({ id: noteId }));
  });
  npc.placeIds.forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    batch.update(placeRef, { npcIds: arrayRemove(npc.id) });
  });
  npc.npcIds.forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    batch.update(npcRef, { npdIds: arrayUnion(npc.id) });
  });

  const allImageKeys = Array.from(new Array(npc.images.length).keys());
  const imagePromise = generateFileDeletePromiseArray(allImageKeys, npc.images);
  const allFileKeys = Array.from(new Array(npc.attachedFiles.length).keys());
  const filePromise = generateFileDeletePromiseArray(
    allFileKeys,
    npc.attachedFiles
  );

  return new Promise((resolve, reject) => {
    Promise.all([...imagePromise, ...filePromise])
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
