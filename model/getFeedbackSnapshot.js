const db = require("../server/db_config");

module.exports = async function getFeedbackSnapshot(path) {
    var results = {};
    await  db.ref(path).once("value",function(snapshot){
       snapshot.forEach(function (snapshot){
           var id =snapshot.key;
           var time = snapshot.val().time;
           var email = snapshot.val().email;
           var fullname = snapshot.val().fullname;
           var issue_type = snapshot.val().issue_type;
           var explanation = snapshot.val().explanation;
           results[id] = [];
           var feedbackInfo = {"time":time,"email":email,"fullname":fullname,"issue_type":issue_type,"explanation":explanation};
           results[id]=feedbackInfo;
       }) ;
    });
    return results;
}

