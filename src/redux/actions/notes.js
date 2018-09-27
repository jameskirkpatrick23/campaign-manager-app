import * as constants from '../constants';
import database from '../../firebase';
import * as PlaceActions from './places';
import firebase from 'firebase';

export const updateNotesList = note => (dispatch, getState) => {
  const updatedState = { ...getState().notes.all };
  updatedState[note.id] = { ...note, createdAt: note.createdAt.toDate() };
  dispatch({ type: constants.Note.UPDATE_NOTE_LIST, notes: updatedState });
};

const updateNoteParent = completedNote => {
  switch (completedNote.type) {
    case 'place':
      PlaceActions.updatePlaceNotes(completedNote.id, completedNote.typeId);
      return;
    default:
      return true;
  }
};

export const createNote = noteData => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    database
      .collection(`notes`)
      .add({
        title: noteData.title,
        description: noteData.description,
        creatorId: getState().login.user.uid,
        createdAt: firebase.firestore.Timestamp.now(),
        updatedAt: firebase.firestore.Timestamp.now(),
        type: noteData.type,
        typeId: noteData.typeId
      })
      .then(res => {
        resolve(res);
        updateNoteParent({ ...noteData, id: res.id });
      })
      .catch(error => {
        reject('Error writing document: ', error);
      });
  });
};

export const updateNote = noteData => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    database
      .collection('notes')
      .doc(noteData.noteId)
      .update({
        title: noteData.title,
        description: noteData.description,
        updatedAt: firebase.firestore.Timestamp.now()
      })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject('Error writing document: ', error);
      });
  });
};
