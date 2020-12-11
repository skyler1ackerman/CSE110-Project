const db = require("../server/db_config");

module.exports = async function getClassSnapshot() {
    var ref = db.ref("classes");
    var classesArr = []
    await ref.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var className = childSnapshot.key;
            classesArr.push(className);
        });
    });
    return JSON.stringify({'result': classesArr});
};