const db = require("../server/db_config");

module.exports = function sendFeedbackUnverified(email, fullname, 
    issue_type, explanation, time){
    var fbRef = "Feedback/Unverified";
    db.ref(fbRef).push().set({
        email: email,
        fullname: fullname,
        issue_type: issue_type,
        explanation: explanation,
        time: time,
    });   
    
}