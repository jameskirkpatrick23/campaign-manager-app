import * as constants from '../constants';
import database, { app } from '../../firebase';
import firebase from 'firebase';
import { generatePromiseArray } from './reusable';

export const updateNPCsList = npc => (dispatch, getState) => {
  const updatedState = { ...getState().npcs.all };
  updatedState[npc.id] = npc;
  dispatch({ type: constants.Npc.UPDATE_NPC_LIST, npcs: updatedState });
};

export const createNpc = npcData => (dispatch, getState) => {
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
