import * as constants from '../constants';
import { Event } from '../constants';
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

export const loadAllEvents = events => (dispatch, getState) => {
  const updatedState = { ...getState().events.all };
  Object.keys(events).forEach(eventKey => {
    updatedState[eventKey] = events[eventKey];
  });
  dispatch({ type: Event.UPDATE_EVENT_LIST, events: updatedState });
};

export const updateEventsList = event => (dispatch, getState) => {
  const updatedState = { ...getState().events.all };
  updatedState[event.id] = event;
  dispatch({ type: Event.UPDATE_EVENT_LIST, events: updatedState });
};

const removeEventFromList = eventId => (dispatch, getState) => {
  const updatedState = { ...getState().events.all };
  delete updatedState[eventId];
  dispatch({ type: Event.UPDATE_EVENT, events: updatedState });
};

export const editEvent = eventData => (dispatch, getState) => {
  ReactGA.event({
    category: 'Events',
    action: 'Edit Event'
  });
  dispatch({ type: Event.UPDATE_EVENT, data: eventData });
  const userUid = getState().login.user.uid;
  const currentEvent = getState().events.all[eventData.id];

  const batch = database.batch();
  const usedRef = database.collection('events').doc(currentEvent.id);
  conditionallyUpdateConnected(currentEvent, eventData, batch);
  const usedData = { ...eventData };
  stripExcessData(usedData);
  const fileChanges = handleFileChanges(eventData, currentEvent, userUid);

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
                  campaignIds: currentEvent.campaignIds,
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
                    dispatch(updateEventsList(finalData));
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

export const createEvent = eventData => (dispatch, getState) => {
  ReactGA.event({
    category: 'Events',
    action: 'Create Event'
  });
  dispatch({ type: Event.CREATING_EVENT, data: eventData });
  const userUid = getState().login.user.uid;
  const currentCampaign = getState().campaigns.currentCampaign;

  const batch = database.batch();
  const usedRef = database.collection('events').doc();
  const usedData = { ...eventData, id: usedRef.id };

  updateConnected(usedData, 'eventIds', batch);

  const newFiles = generateImagePromises(eventData, userUid, 'events');

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
                dispatch(updateEventsList(finalData));
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

export const deleteEvent = event => dispatch => {
  ReactGA.event({
    category: 'Events',
    action: 'Delete Event'
  });
  dispatch({ type: Event.DELETING_EVENT, id: event.id });
  const batch = database.batch();
  const usedRef = database.collection('events').doc(event.id);
  batch.delete(usedRef);
  dispatch(deleteConnected(event, 'eventIds', batch));
  const filePromises = generateDeleteKeys(event);

  return new Promise((resolve, reject) => {
    Promise.all(filePromises)
      .then(() => {
        batch
          .commit()
          .then(res => {
            dispatch(removeEventFromList(event.id));
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
