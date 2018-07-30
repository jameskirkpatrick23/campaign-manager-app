import firebase from 'firebase';
require('firebase/firestore');
const config = {
  apiKey: 'AIzaSyAsTfIcft-nL2QMlprQ5F6NuNKQP8Mf2qE',
  authDomain: 'campaign-tracker-5e.firebaseapp.com',
  databaseURL: 'https://campaign-tracker-5e.firebaseio.com',
  projectId: 'campaign-tracker-5e',
  storageBucket: 'campaign-tracker-5e.appspot.com',
  messagingSenderId: '983240050895'
};
export const app = firebase.initializeApp(config);
const database = app.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
database.settings(settings);
export default database;
