import * as constants from '../constants';
import { Quest } from '../constants';
import database from '../../firebaseDB';
import firebase from 'firebase';
import _ from 'lodash';
import ReactGA from 'react-ga';
import {
  generateFileDeletePromiseArray,
  generatePromiseArray
} from './reusable';
import { deleteNote } from './notes';

export const updateQuestsList = quest => (dispatch, getState) => {
  const updatedState = { ...getState().quests.all };
  updatedState[quest.id] = quest;
  dispatch({ type: constants.Quest.UPDATE_QUEST_LIST, quests: updatedState });
};

const removeQuestFromList = questId => (dispatch, getState) => {
  const updatedState = { ...getState().quests.all };
  delete updatedState[questId];
  dispatch({ type: Quest.UPDATE_QUEST, quests: updatedState });
};

export const editQuest = questData => (dispatch, getState) => {
  ReactGA.event({
    category: 'Quests',
    action: 'Edit Quest'
  });
  dispatch({ type: Quest.UPDATE_QUEST, data: questData });
  const userUid = getState().login.user.uid;
  const currentQuest = getState().quests.all[questData.questId];

  const batch = database.batch();
  const usedRef = database.collection('quests').doc(currentQuest.id);
  const { arrayRemove, arrayUnion } = firebase.firestore.FieldValue;

  _.uniq([...currentQuest.placeIds, ...questData.placeIds]).forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    if (!questData.placeIds.includes(placeId)) {
      // delete if newData !include oldId
      batch.update(placeRef, { questIds: arrayRemove(currentQuest.id) });
    } else {
      batch.update(placeRef, { questIds: arrayUnion(currentQuest.id) });
    }
  });

  _.uniq([...currentQuest.npcIds, ...questData.npcIds]).forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    if (!questData.npcIds.includes(npcId)) {
      // delete if newData !include oldId
      batch.update(npcRef, { questIds: arrayRemove(currentQuest.id) });
    } else {
      batch.update(npcRef, { questIds: arrayUnion(currentQuest.id) });
    }
  });

  _.uniq([...currentQuest.questIds, ...questData.questIds]).forEach(questId => {
    const questRef = database.collection('quests').doc(questId);
    if (!questData.questIds.includes(questId)) {
      // delete if newData !include oldId
      batch.update(questRef, { questIds: arrayRemove(currentQuest.id) });
    } else {
      batch.update(questRef, { questIds: arrayUnion(currentQuest.id) });
    }
  });

  const {
    deleteimagesKeys,
    deleteattachedFilesKeys,
    newImages,
    newAttachedFiles,
    images,
    attachedFiles
  } = questData;

  const deleteImageArray = generateFileDeletePromiseArray(
    deleteimagesKeys,
    currentQuest.images
  );
  const deleteAttachedArray = generateFileDeletePromiseArray(
    deleteattachedFilesKeys,
    currentQuest.attachedFiles
  );
  const newImagePromiseArray = generatePromiseArray(
    newImages,
    userUid,
    'images',
    'quests'
  );
  const newAttachedFilePromiseArray = generatePromiseArray(
    newAttachedFiles,
    userUid,
    'attachedFiles',
    'quests'
  );

  let currentImages = Object.keys(images).map(key => images[key]);
  let currentAttachedFiles = Object.keys(attachedFiles).map(
    key => attachedFiles[key]
  );
  const usedData = { ...questData };
  delete usedData.newImages;
  delete usedData.newAttachedFiles;
  delete usedData.deleteattachedFilesKeys;
  delete usedData.deleteimagesKeys;
  delete usedData.deletenewAttachedFilesKeys;
  delete usedData.deletenewImagesKeys;

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
                  ...usedData,
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

export const createQuest = questData => (dispatch, getState) => {
  ReactGA.event({
    category: 'Quests',
    action: 'Create Quest'
  });
  dispatch({ type: Quest.CREATING_QUEST, data: questData });
  const userUid = getState().login.user.uid;
  const currentCampaign = getState().campaigns.currentCampaign;

  const batch = database.batch();
  const usedRef = database.collection('quests').doc();
  const usedId = usedRef.id;
  const { arrayUnion } = firebase.firestore.FieldValue;
  const usedData = { ...questData };

  questData.placeIds.forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    batch.update(placeRef, { questIds: arrayUnion(usedId) });
  });
  questData.questIds.forEach(questId => {
    const npcRef = database.collection('quests').doc(questId);
    batch.update(npcRef, { questIds: arrayUnion(usedId) });
  });
  questData.npcIds.forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    batch.update(npcRef, { npcIds: arrayUnion(usedId) });
  });

  const imagePromiseArray = generatePromiseArray(
    questData.newImages,
    userUid,
    'images',
    'quests'
  );
  const attachedFilePromiseArray = generatePromiseArray(
    questData.newAttachedFiles,
    userUid,
    'files',
    'quests'
  );

  return new Promise((resolve, reject) => {
    delete usedData.newImages;
    delete usedData.newAttachedFiles;
    delete usedData.deleteattachedFilesKeys;
    delete usedData.deleteimagesKeys;
    delete usedData.deletenewAttachedFilesKeys;
    delete usedData.deletenewImagesKeys;
    return Promise.all(imagePromiseArray)
      .then(resolvedImages => {
        Promise.all(attachedFilePromiseArray)
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

export const deleteQuest = quest => dispatch => {
  ReactGA.event({
    category: 'Quests',
    action: 'Delete Quest'
  });
  dispatch({ type: Quest.DELETING_QUEST, id: quest.id });
  const { arrayRemove, arrayUnion } = firebase.firestore.FieldValue;
  const batch = database.batch();
  const usedRef = database.collection('quests').doc(quest.id);
  batch.delete(usedRef);
  quest.noteIds.forEach(noteId => {
    const noteRef = database.collection('notes').doc(noteId);
    batch.delete(noteRef);
    dispatch(deleteNote({ id: noteId }));
  });
  quest.placeIds.forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    batch.update(placeRef, { questIds: arrayRemove(quest.id) });
  });
  quest.questIds.forEach(questId => {
    const questRef = database.collection('quests').doc(questId);
    batch.update(questRef, { questIds: arrayUnion(quest.id) });
  });
  quest.npcIds.forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    batch.update(npcRef, { questIds: arrayUnion(quest.id) });
  });
  const allImageKeys = Array.from(new Array(quest.images.length).keys());
  const imagePromise = generateFileDeletePromiseArray(
    allImageKeys,
    quest.images
  );
  const allFileKeys = Array.from(new Array(quest.attachedFiles.length).keys());
  const filePromise = generateFileDeletePromiseArray(
    allFileKeys,
    quest.attachedFiles
  );

  return new Promise((resolve, reject) => {
    Promise.all([...imagePromise, ...filePromise])
      .then(() => {
        batch
          .commit()
          .then(res => {
            dispatch(removeQuestFromList(quest.id));
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
