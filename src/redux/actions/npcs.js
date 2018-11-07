import * as constants from '../constants';
import database, { app } from '../../firebase';
import firebase from 'firebase';
import {
  generatePromiseArray,
  generateFileDeletePromiseArray
} from './reusable';
import { deleteNote } from './notes';

export const updateNPCsList = npc => (dispatch, getState) => {
  const updatedState = { ...getState().npcs.all };
  updatedState[npc.id] = npc;
  dispatch({ type: constants.Npc.UPDATE_NPC_LIST, npcs: updatedState });
};

const removeNPCFromList = npcId => (dispatch, getState) => {
  const updatedState = { ...getState().npcs.all };
  delete updatedState[npcId];
  dispatch({ type: constants.Npc.UPDATE_NPC_LIST, npcs: updatedState });
};

const setNPCList = npcs => dispatch => {
  dispatch({ type: constants.Npc.SET_NPC_LIST, npcs });
};

export const editNPC = npcData => (dispatch, getState) => {
  const userUid = getState().login.user.uid;
  const currentNPC = getState().npcs.all[npcData.npcId];

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
  dispatch({ type: constants.Npc.UPDATE_NPC, data: npcData });

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
                new Promise(() => {
                  database
                    .collection(`npcs`)
                    .doc(npcData.npcId)
                    .update({
                      name: npcData.name,
                      physDescription: npcData.physDescription,
                      backstory: npcData.backstory,
                      height: npcData.height,
                      weight: npcData.weight,
                      alignment: npcData.alignment,
                      race: npcData.race,
                      gender: npcData.gender,
                      occupation: npcData.occupation,
                      quirks: npcData.quirks,
                      values: npcData.values,
                      tagIds: npcData.tagIds,
                      npcIds: npcData.npcIds,
                      questIds: npcData.questIds,
                      placeIds: npcData.placeIds,
                      updatedAt: firebase.firestore.Timestamp.now(),
                      noteIds: npcData.noteIds,
                      eventIds: npcData.eventIds,
                      images: currentImages,
                      attachedFiles: currentAttachedFiles
                    })
                    .then(res => {
                      resolve(res);
                    })
                    .catch(error => {
                      reject('Error writing document: ', error.message);
                    });
                }).catch(err => {
                  reject(err.message);
                });
              })
              .catch(err => {
                reject(
                  'Something went wrong while trying upload files:',
                  err.message
                );
              });
          })
          .catch(err => {
            reject(
              'Something went wrong while trying upload images:',
              err.message
            );
          });
      })
      .catch(err => {
        reject(
          'Something went wrong while trying upload images and files:',
          err.message
        );
      });
  });
};

export const createNPC = npcData => (dispatch, getState) => {
  const userUid = getState().login.user.uid;
  const currentCampaign = getState().campaigns.currentCampaign;

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

  const batch = database.batch();
  const usedRef = database.collection('npcs').doc();
  const usedId = usedRef.id;
  npcData.placeIds.forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    batch.update(placeRef, {
      npdIds: firebase.firestore.FieldValue.arrayUnion(usedId)
    });
  });
  npcData.npcIds.forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    batch.update(npcRef, {
      npdIds: firebase.firestore.FieldValue.arrayUnion(usedId)
    });
  });

  dispatch({ type: constants.Npc.CREATING_NPC, data: npcData });
  return new Promise((resolve, reject) => {
    return Promise.all(imagePromiseArray)
      .then(resolvedImages => {
        Promise.all(attachedFilePromiseArray)
          .then(resolvedFiles => {
            batch.set(usedRef, {
              name: npcData.name,
              physDescription: npcData.physDescription,
              backstory: npcData.backstory,
              height: npcData.height,
              weight: npcData.weight,
              alignment: npcData.alignment,
              race: npcData.race,
              gender: npcData.gender,
              occupation: npcData.occupation,
              quirks: npcData.quirks,
              values: npcData.values,
              tagIds: npcData.tagIds,
              questIds: npcData.questIds,
              npcIds: npcData.npcIds,
              placeIds: npcData.placeIds,
              createdAt: firebase.firestore.Timestamp.now(),
              updatedAt: firebase.firestore.Timestamp.now(),
              noteIds: [],
              eventIds: npcData.eventIds,
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
  dispatch({ type: constants.Npc.DELETING_NPC, id: npc.id });
  const allImageKeys = Array.from(new Array(npc.images.length).keys());
  const imagePromise = generateFileDeletePromiseArray(allImageKeys, npc.images);
  const allFileKeys = Array.from(new Array(npc.attachedFiles.length).keys());
  const filePromise = generateFileDeletePromiseArray(
    allFileKeys,
    npc.attachedFiles
  );

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
    batch.update(placeRef, {
      npcIds: firebase.firestore.FieldValue.arrayRemove(npc.id)
    });
  });
  npc.npcIds.forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    batch.update(npcRef, {
      npdIds: firebase.firestore.FieldValue.arrayUnion(npc.id)
    });
  });

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
