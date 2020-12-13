const firebase = require('firebase');
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBE4-bTw9_r8GOf1iPwLniOYd9Q6BcANdI",
    authDomain: "tritongroups-c26fa.firebaseapp.com",
    databaseURL: "https://tritongroups-c26fa.firebaseio.com",
    projectId: "tritongroups-c26fa",
    storageBucket: "tritongroups-c26fa.appspot.com",
    messagingSenderId: "89265426122",
    appId: "1:89265426122:web:8d44ef01d34059f03f6e33",
    measurementId: "G-Z0TXVP3WVY"
};
var firebaseApp = firebase.initializeApp(firebaseConfig);
var db = firebaseApp.database();
module.exports = db;