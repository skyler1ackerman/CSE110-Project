const db = require("../server/db_config");

module.exports = function saveUserProfile(uid, courses, major, email, name) {
    db.ref("userProfiles").child(uid).set({
        email: email,
        fullname: name,
        major: major,
        courseList: courses,
    });
}