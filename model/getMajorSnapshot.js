const db = require("../server/db_config");

module.exports = async function getMajorSnapshot() {
    var ref = db.ref("majors");
    var majorArr = []
    await ref.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var majorName = childSnapshot.key;
            majorArr.push(majorName);
        });
    });
    return JSON.stringify({'result': majorArr});
};