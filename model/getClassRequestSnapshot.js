const db = require("../server/db_config");

module.exports = async function getClassRequestSnapshot(path) {
    var results = {};
    await  db.ref(path).once("value",function(snapshot){
        snapshot.forEach(function (snapshot){
            var id =snapshot.key;
            var time = snapshot.val().time;
            var email = snapshot.val().email;
            var className = snapshot.val().className;
            var inviteURL = snapshot.val().inviteURL;
            var profName = snapshot.val().profName;
            var quarter = snapshot.val().quarter;
            var year = snapshot.val().year;
            results[id] = [];
            var Info = { "time":time,"email":email, "className":className,"inviteURL":inviteURL, "profName":profName,"quarter": quarter,"year": year};
            results[id]=Info;
        }) ;
    });
    return results;
}