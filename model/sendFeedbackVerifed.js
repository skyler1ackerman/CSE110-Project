const db = require("../server/db_config");

module.exports = function sendFeedbackVerifed(email, fullname, 
    issue_type, explanation, time){
    var fbRef = "Feedback/Verified";
    db.ref(fbRef).push().set({
        email: email,
        fullname: fullname,
        issue_type: issue_type,
        explanation: explanation,
        time: time,
    });   
    
}