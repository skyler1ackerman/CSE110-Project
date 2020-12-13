const db = require("../server/db_config");

module.exports = function getUserMajor(uid) {
    return db.ref("userProfiles").child(uid).child("major").once('value')
    .then(snapshot => snapshot.val())
    .catch(error => console.log(error));
}