import * as constants from '../constants';
import { Quest } from '../constants';
import firebase from 'firebase';
import ReactGA from 'react-ga';
import database from '../../firebaseDB';
import {
  deleteConnected,
  handleFileChanges,
  generateImagePromises,
  generateDeleteKeys,
  stripExcessData,
  updateConnected,
  conditionallyUpdateConnected
} from './reusable';

export const loadAllQuests = quests => (dispatch, getState) => {
  const updatedState = { ...getState().quests.all };
  Object.keys(quests).forEach(questKey => {
    updatedState[questKey] = quests[questKey];
  });
  dispatch({ type: constants.Quest.UPDATE_QUEST_LIST, quests: updatedState });
};

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
  conditionallyUpdateConnected(currentQuest, questData, batch);
  const usedData = { ...questData };
  stripExcessData(usedData);
  const fileChanges = handleFileChanges(questData, currentQuest, userUid);

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
                const finalData = {
                  ...usedData,
                  updatedAt: firebase.firestore.Timestamp.now(),
                  images: fileChanges.currentImages.concat(resolvedImages),
                  attachedFiles: fileChanges.currentAttachedFiles.concat(
                    resolvedFiles
                  )
                };
                batch.update(usedRef, finalData);
                batch
                  .commit()
                  .then(res => {
                    dispatch(updateQuestsList(finalData));
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
  const usedData = { ...questData, id: usedRef.id };

  updateConnected(usedData, 'questIds', batch);

  const newFiles = generateImagePromises(questData, userUid, 'quests');

  return new Promise((resolve, reject) => {
    stripExcessData(usedData);
    return Promise.all(newFiles.imagePromiseArray)
      .then(resolvedImages => {
        Promise.all(newFiles.attachedFilePromiseArray)
          .then(resolvedFiles => {
            const finalData = {
              ...usedData,
              createdAt: firebase.firestore.Timestamp.now(),
              updatedAt: firebase.firestore.Timestamp.now(),
              noteIds: [],
              campaignIds: [currentCampaign.id],
              images: resolvedImages,
              attachedFiles: resolvedFiles,
              creatorId: userUid,
              collaboratorIds: []
            };
            batch.set(usedRef, finalData);
            batch
              .commit()
              .then(res => {
                dispatch(updateQuestsList(finalData));
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
  const batch = database.batch();
  const usedRef = database.collection('quests').doc(quest.id);
  batch.delete(usedRef);
  dispatch(deleteConnected(quest, 'questIds', batch));
  const filePromises = generateDeleteKeys(quest);

  return new Promise((resolve, reject) => {
    Promise.all(filePromises)
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
