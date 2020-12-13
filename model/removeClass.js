const db = require("../server/db_config");

module.exports = function removeClass(className, bid){
    var classRef = "classes/".concat(className);
    db.ref(classRef).child(bid).remove();
}