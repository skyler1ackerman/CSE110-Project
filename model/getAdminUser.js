const db = require("../server/db_config");

module.exports = function getAdminUser() {
    return db.ref("AdminUser/").once('value')
    .then(snapshot => snapshot.val())
    .catch(error => console.log(error));
}
