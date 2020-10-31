import firebase from 'firebase';


const db = firebase.initializeApp({
    apiKey: "AIzaSyBE4-bTw9_r8GOf1iPwLniOYd9Q6BcANdI",
    authDomain: "tritongroups-c26fa.firebaseapp.com",
    databaseURL: "https://tritongroups-c26fa.firebaseio.com",
    projectId: "tritongroups-c26fa",
    storageBucket: "tritongroups-c26fa.appspot.com",
    messagingSenderId: "89265426122",
    appId: "1:89265426122:web:8d44ef01d34059f03f6e33",
    measurementId: "G-Z0TXVP3WVY"
});

export default db;
export const provider2 = new firebase.auth.GoogleAuthProvider()