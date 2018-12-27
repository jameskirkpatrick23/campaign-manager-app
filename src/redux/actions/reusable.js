import database, { app } from '../../firebaseDB';
import firebase from 'firebase';
import _ from 'lodash';
import ReactGA from 'react-ga';
import { deleteNote } from './notes';

export const generatePromiseArray = (collection, uid, type, subclass) => {
  const storageRef = app.storage().ref();
  return Object.keys(collection).map((key, index) => {
    return new Promise((resolve, reject) => {
      const ref = `${Date.now()}${index}`;
      const currentUpload = collection[key];
      const uploadRef = storageRef.child(`${uid}/${subclass}/${type}/${ref}`);
      uploadRef
        .put(currentUpload)
        .then(snapshot => {
          snapshot.ref
            .getDownloadURL()
            .then(url => {
              resolve({
                downloadUrl: url,
                fileName: currentUpload.name,
                storageRef: `${uid}/${subclass}/${type}/${ref}`
              });
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  });
};

export const generateFileDeletePromiseArray = (deleteKeys, currentArray) => {
  const storageRef = app.storage().ref();
  const promiseArray = [];
  for (let i = 0; i < deleteKeys.length; i++) {
    const newPromise = new Promise((resolve, reject) => {
      const uploadRef = storageRef.child(
        currentArray[parseInt(deleteKeys[i], 10)].storageRef
      );
      uploadRef
        .delete()
        .then(() => {
          resolve();
        })
        .catch(err => reject(err));
    });
    promiseArray.push(newPromise);
  }
  return promiseArray;
};

export const createAncillaryObject = (name, type, onCreateCallback) => (
  dispatch,
  getState
) => {
  ReactGA.event({
    category: `${_.capitalize(type)}s`,
    action: `Create ${_.capitalize(type)}`
  });
  return new Promise((resolve, reject) => {
    const myId = getState().login.user.uid;
    const ref = database.collection(`${type}s`);
    ref
      .where('name', '==', name)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          ref.doc(snapshot.docs[0].id).update({
            collaboratorIds: firebase.firestore.FieldValue.arrayUnion(myId)
          });
        } else {
          const data = {
            name: name,
            creatorId: myId,
            default: false,
            collaboratorIds: []
          };
          ref
            .add(data)
            .then(res => {
              dispatch({ type: `CREATED_${_.toUpper(type)}`, name });
              dispatch(onCreateCallback({ ...data, id: res.id }));
              resolve({ ...data, id: res.id });
            })
            .catch(error => {
              reject('Error writing document: ', error);
            });
        }
      });
  });
};

export const conditionallyUpdateConnected = (currentItem, dataItem, batch) => {
  const { arrayRemove, arrayUnion } = firebase.firestore.FieldValue;

  _.uniq([...currentItem.placeIds, ...dataItem.placeIds]).forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    if (!dataItem.placeIds.includes(placeId)) {
      batch.update(placeRef, { npcIds: arrayRemove(currentItem.id) });
    } else {
      batch.update(placeRef, { npcIds: arrayUnion(currentItem.id) });
    }
  });

  _.uniq([...currentItem.npcIds, ...dataItem.npcIds]).forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    if (!dataItem.npcIds.includes(npcId)) {
      batch.update(npcRef, { npcIds: arrayRemove(currentItem.id) });
    } else {
      batch.update(npcRef, { npcIds: arrayUnion(currentItem.id) });
    }
  });

  _.uniq([...currentItem.questIds, ...dataItem.questIds]).forEach(questId => {
    const questRef = database.collection('quests').doc(questId);
    if (!dataItem.questIds.includes(questId)) {
      batch.update(questRef, { npcIds: arrayRemove(currentItem.id) });
    } else {
      batch.update(questRef, { npcIds: arrayUnion(currentItem.id) });
    }
  });
};

export const updateConnected = (item, itemState, batch) => {
  const { arrayUnion } = firebase.firestore.FieldValue;
  item.placeIds.forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    batch.update(placeRef, { [itemState]: arrayUnion(item.id) });
  });
  item.npcIds.forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    batch.update(npcRef, { [itemState]: arrayUnion(item.id) });
  });
  item.questIds.forEach(questId => {
    const questRef = database.collection('quests').doc(questId);
    batch.update(questRef, { [itemState]: arrayUnion(item.id) });
  });
};

export const deleteConnected = (item, itemState, batch) => dispatch => {
  const { arrayRemove } = firebase.firestore.FieldValue;
  item.noteIds.forEach(noteId => {
    const noteRef = database.collection('notes').doc(noteId);
    batch.delete(noteRef);
    dispatch(deleteNote({ id: noteId }));
  });
  item.placeIds.forEach(placeId => {
    const placeRef = database.collection('places').doc(placeId);
    batch.update(placeRef, { [itemState]: arrayRemove(item.id) });
  });
  item.npcIds.forEach(npcId => {
    const npcRef = database.collection('npcs').doc(npcId);
    batch.update(npcRef, { [itemState]: arrayRemove(item.id) });
  });
  item.questIds.forEach(questId => {
    const npcRef = database.collection('quests').doc(questId);
    batch.update(npcRef, { [itemState]: arrayRemove(item.id) });
  });
};

export const generateDeleteKeys = item => {
  const allImageKeys = Array.from(new Array(item.images.length).keys());
  const imagePromise = generateFileDeletePromiseArray(
    allImageKeys,
    item.images
  );
  const allFileKeys = Array.from(new Array(item.attachedFiles.length).keys());
  const filePromise = generateFileDeletePromiseArray(
    allFileKeys,
    item.attachedFiles
  );
  return [...imagePromise, ...filePromise];
};

export const stripExcessData = object => {
  delete object.newImages;
  delete object.newAttachedFiles;
  delete object.deleteattachedFilesKeys;
  delete object.deleteimagesKeys;
  delete object.deletenewAttachedFilesKeys;
  delete object.deletenewImagesKeys;
};

export const generateImagePromises = (data, userUid, type) => {
  const returnObject = {};
  returnObject.imagePromiseArray = generatePromiseArray(
    data.newImages,
    userUid,
    'images',
    type
  );
  returnObject.attachedFilePromiseArray = generatePromiseArray(
    data.newAttachedFiles,
    userUid,
    'files',
    type
  );
  return returnObject;
};

export const handleFileChanges = (npcData, currentNPC, userUid) => {
  const {
    deleteimagesKeys,
    deleteattachedFilesKeys,
    newImages,
    newAttachedFiles,
    images,
    attachedFiles
  } = npcData;
  const returnObject = {};
  returnObject.deleteImageArray = generateFileDeletePromiseArray(
    deleteimagesKeys,
    currentNPC.images
  );
  returnObject.deleteAttachedArray = generateFileDeletePromiseArray(
    deleteattachedFilesKeys,
    currentNPC.attachedFiles
  );
  returnObject.newImagePromiseArray = generatePromiseArray(
    newImages,
    userUid,
    'images',
    'npcs'
  );
  returnObject.newAttachedFilePromiseArray = generatePromiseArray(
    newAttachedFiles,
    userUid,
    'attachedFiles',
    'npcs'
  );

  returnObject.currentImages = Object.keys(images).map(key => images[key]);
  returnObject.currentAttachedFiles = Object.keys(attachedFiles).map(
    key => attachedFiles[key]
  );
  return returnObject;
};
