const db = require("../server/db_config");

module.exports = async function getReportSnapshot(path) {
    var results = {};
    await  db.ref(path).once("value",function(snapshot){
        snapshot.forEach(function (snapshot){
            var id =snapshot.key;
            var time = snapshot.val().time;
            var communityOrClassName = snapshot.val().communityOrClassName;
            var discordLink = snapshot.val().discordLink;
            var email = snapshot.val().communityOrClassName;
            var fullname = snapshot.val().fullname;
            var reason = snapshot.val().reason;


            results[id] = [];
            var feedbackInfo = {"time":time,"communityOrClassName":communityOrClassName,"discordLink":discordLink,"email":email,"fullname":fullname,"reason":reason};
            results[id]=feedbackInfo;
        }) ;
    });
    return results;
}