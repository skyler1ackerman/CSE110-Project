const db = require("../server/db_config");

module.exports = function getUserClasses(uid) {
    return db.ref("userProfiles").child(uid).child("courseList").once('value')
    .then(snapshot => snapshot.val())
    .catch(error => console.log(error));
}