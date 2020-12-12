const db = require("../server/db_config");

module.exports = async function getFeedbackSnapshot(path) {
    var results = {};
    await  db.ref("AdminUser/").once("value",function(snapshot){
        snapshot.forEach(function (snapshot){
            var id =snapshot.key;
            var email = snapshot.val().email;
            results[id] = [];
            results[id]=email;
        }) ;
    });
    return results;
}