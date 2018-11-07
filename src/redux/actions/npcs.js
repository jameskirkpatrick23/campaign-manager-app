import * as constants from '../constants';
import database, { app } from '../../firebase';
import firebase from 'firebase';
import {
  generatePromiseArray,
  generateFileDeletePromiseArray,
  deleteNotes
} from './reusable';

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

  dispatch({ type: constants.Npc.CREATING_NPC, data: npcData });
  return new Promise((resolve, reject) => {
    return Promise.all(imagePromiseArray)
      .then(resolvedImages => {
        const uploadedImages = resolvedImages;
        Promise.all(attachedFilePromiseArray)
          .then(resolvedFiles => {
            const uploadedFiles = resolvedFiles;
            new Promise(() => {
              database
                .collection(`npcs`)
                .add({
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
                  createdAt: firebase.firestore.Timestamp.now(),
                  updatedAt: firebase.firestore.Timestamp.now(),
                  noteIds: [],
                  eventIds: npcData.eventIds,
                  campaignIds: [currentCampaign.id],
                  images: uploadedImages,
                  attachedFiles: uploadedFiles,
                  creatorId: userUid,
                  collaboratorIds: []
                })
                .then(res => {
                  resolve(res);
                })
                .catch(error => {
                  reject('Error writing document: ', error.message);
                });
            }).catch(err => {
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
        reject('Something went wrong while trying upload images:', err.message);
      });
  });
};

export const deleteNPC = npc => dispatch => {
  const allImageKeys = Array.from(Array(npc.images.length).keys());
  const imagePromise = generateFileDeletePromiseArray(allImageKeys, npc.images);
  const allFileKeys = Array.from(Array(npc.attachedFiles.length).keys());
  const filePromise = generateFileDeletePromiseArray(
    allFileKeys,
    npc.attachedFiles
  );
  dispatch({ type: constants.Npc.DELETING_NPC, id: npc.id });
  return new Promise((resolve, reject) => {
    Promise.all([...imagePromise, ...filePromise])
      .then(() => {
        dispatch(deleteNotes(npc.noteIds));
        dispatch(removeNPCFromList(npc.id));
        database
          .collection(`places`)
          .doc(`${npc.id}`)
          .delete()
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(
              `Something went wrong while trying to delete: ${err.message}`
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

export const updateNPCNotes = (noteId, npcId) => {
  return new Promise((resolve, reject) => {
    database
      .collection(`npcs`)
      .doc(npcId)
      .update({ noteIds: firebase.firestore.FieldValue.arrayUnion(noteId) })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const removeNPCNotes = (npcId, noteId) => {
  return new Promise((resolve, reject) => {
    database
      .collection(`npcs`)
      .doc(npcId)
      .update({ noteIds: firebase.firestore.FieldValue.arrayRemove(noteId) })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
