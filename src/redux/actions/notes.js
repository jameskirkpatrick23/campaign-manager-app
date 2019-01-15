import * as constants from '../constants';
import database from '../../firebaseDB';
import firebase from 'firebase';
import _ from 'lodash';
import ReactGA from 'react-ga';
import { updateNpcsList } from './npcs';
import { updateQuestsList } from './quests';
import { updatePlacesList } from './places';

export const loadAllNotes = notes => (dispatch, getState) => {
  const updatedState = { ...getState().notes.all };
  Object.keys(notes).forEach(noteKey => {
    updatedState[noteKey] = notes[noteKey];
  });
  dispatch({ type: constants.Note.UPDATE_NOTE_LIST, notes: updatedState });
};

export const updateNotesList = note => (dispatch, getState) => {
  const updatedState = { ...getState().notes.all };
  updatedState[note.id] = { ...note, createdAt: note.createdAt.toDate() };
  dispatch({ type: constants.Note.UPDATE_NOTE_LIST, notes: updatedState });
};

const removeNoteFromList = noteId => (dispatch, getState) => {
  const updatedState = { ...getState().notes.all };
  delete updatedState[noteId];
  dispatch({
    type: constants.Note.UPDATE_NOTE_LIST,
    notes: updatedState
  });
};

export const createNote = noteData => (dispatch, getState) => {
  const { npcs, places, quests } = getState();
  ReactGA.event({
    category: 'Notes',
    action: 'Create Note'
  });
  dispatch({ type: constants.Note.CREATING_NOTE, note: noteData });
  const batch = database.batch();
  const ref = database.collection('notes').doc();
  const myId = ref.id;
  const parentRef = database.collection(noteData.type).doc(noteData.typeId);
  const finalData = {
    id: myId,
    ...noteData,
    creatorId: getState().login.user.uid,
    createdAt: firebase.firestore.Timestamp.now(),
    updatedAt: firebase.firestore.Timestamp.now()
  };
  batch.set(ref, finalData);
  batch.update(parentRef, {
    noteIds: firebase.firestore.FieldValue.arrayUnion(myId)
  });
  return new Promise((resolve, reject) => {
    batch
      .commit()
      .then(res => {
        dispatch(updateNotesList(finalData));
        const used = { ...getState()[noteData.type].all[noteData.typeId] };
        if (!used.noteIds.find(noteId => noteId === myId))
          used.noteIds.push(myId);
        // _.capitalize()
        dispatch({ type: `UPDATE_${noteData.type.toUpperCase()}` });
        switch (noteData.type) {
          case 'npcs':
            dispatch(updateNpcsList(used));
            break;
          case 'places':
            dispatch(updatePlacesList(used));
            break;
          case 'quests':
            dispatch(updateQuestsList(used));
            break;
        }
        resolve(res);
      })
      .catch(error => {
        reject(`Error writing document: ${error.message}`);
      });
  });
};

export const updateNote = noteData => dispatch => {
  ReactGA.event({
    category: 'Notes',
    action: 'Update Note'
  });
  dispatch({ type: constants.Note.UPDATING_NOTE, note: noteData });
  return new Promise((resolve, reject) => {
    const finalData = {
      ...noteData,
      updatedAt: firebase.firestore.Timestamp.now()
    };
    database
      .collection('notes')
      .doc(noteData.id)
      .update(finalData)
      .then(res => {
        dispatch(updateNotesList(finalData));
        resolve(res);
      })
      .catch(error => {
        reject('Error writing document: ', error.message);
      });
  });
};

export const deleteNote = note => dispatch => {
  ReactGA.event({
    category: 'Notes',
    action: 'Delete Note'
  });
  dispatch({ type: constants.Note.DELETING_NOTE, note });
  const foundNote = { ...note }; //we want a copy because we are going to delete the redux stores
  const batch = database.batch();
  const noteRef = database.collection('notes').doc(foundNote.id);
  batch.delete(noteRef);
  const parentRef = database.collection(foundNote.type).doc(foundNote.typeId);
  batch.update(parentRef, {
    noteIds: firebase.firestore.FieldValue.arrayRemove(foundNote.id)
  });

  return new Promise((resolve, reject) => {
    batch
      .commit()
      .then(res => {
        dispatch(removeNoteFromList(foundNote.id));
        resolve(res);
      })
      .catch(error => {
        reject('Error writing document: ', error.message);
      });
  });
};
