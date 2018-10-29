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

const removeNoteFromParent = (parentId, type, noteId) => {
  switch (type) {
    case 'place':
      PlaceActions.removePlaceNotes(parentId, noteId);
      return;
    default:
      return true;
  }
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
  dispatch({ type: constants.Note.CREATING_NOTE, note: noteData });
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
        reject('Error writing document: ', error.message);
      });
  });
};

export const updateNote = noteData => (dispatch, getState) => {
  dispatch({ type: constants.Note.UPDATING_NOTE, note: noteData });
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
        reject('Error writing document: ', error.message);
      });
  });
};

export const deleteNote = note => (dispatch, getState) => {
  dispatch({ type: constants.Note.DELETING_NOTE, note });

  const foundNote = { ...note }; //we want a copy because we are going to delete the redux stores
  return new Promise((resolve, reject) => {
    database
      .collection('notes')
      .doc(foundNote.id)
      .delete()
      .then(res => {
        resolve(res);
        dispatch(
          removeNoteFromParent(foundNote.typeId, foundNote.type, foundNote.id)
        );
        dispatch(removeNoteFromList(foundNote.id));
      })
      .catch(error => {
        reject('Error writing document: ', error.message);
      });
  });
};
