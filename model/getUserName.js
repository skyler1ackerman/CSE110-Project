const db = require("../server/db_config");

module.exports = function getUserName(uid) {
    return db.ref("userProfiles").child(uid).child("fullname").once('value')
    .then(snapshot => snapshot.val())
    .catch(error => console.log(error));
}