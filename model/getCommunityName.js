const db = require("../server/db_config");

module.exports = function getCommunityName() {
    return db.ref("clubs").once('value')
    .then(snapshot => snapshot.val())
    .catch(error => console.log(error));
}
