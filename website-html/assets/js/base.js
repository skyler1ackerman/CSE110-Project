import firebase from 'firebase';


const db = firebase.initializeApp({
    apiKey: "AIzaSyC47moODeJGTOyy1b8f6Qoqtvko24x-t9I",
    authDomain: "cse110firebase-dcbd8.firebaseapp.com",
    databaseURL: "https://cse110firebase-dcbd8.firebaseio.com",
    projectId: "cse110firebase-dcbd8",
    storageBucket: "cse110firebase-dcbd8.appspot.com",
    messagingSenderId: "862370930174",
    appId: "1:862370930174:web:ba79ab10a41bd005ef34af"
});

export default db;
export const provider2 = new firebase.auth.GoogleAuthProvider()