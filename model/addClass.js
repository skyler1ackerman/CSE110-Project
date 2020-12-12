const db = require("../server/db_config");

module.exports = function addClass(className, inviteURL, profName, quarter, year) {
    var classRef = "classes/".concat(className);

    db.ref(classRef).push().set({
        inviteURL: inviteURL,
        profName: profName,
        quarter: quarter,
        year: year,
    });
}