const db = require("../server/db_config");

module.exports = function getAdminEmail(mail) {
    db.ref("AdminUser/").push().set({
        email: mail
    });
}