const db = require("../server/db_config");
module.exports = function moveFeedback(from,to,id,email,fullname,issue_type,explanation,time){
    db.ref(to).child(id).set({
        email: email,
        fullname: fullname,
        issue_type: issue_type,
        explanation: explanation,
        time: time
    })
    db.ref(from).child(id).remove();
}