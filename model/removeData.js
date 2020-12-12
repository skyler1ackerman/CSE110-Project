const db = require("../server/db_config");
module.exports = function removeData(reference,id){
    db.ref(reference).child(id).remove();
}