const db = require("../server/db_config");

module.exports = function setClassServerRequest(user_email, class_name, invite_URL, prof_Name, quarter, year) {
    
    db.ref("DiscordServerRequests/").child("Classes").push().set({
        email: user_email,
        className: class_name,
        inviteURL: invite_URL,
        profName: prof_Name,
        quarter: quarter,
        year: year,
        time: Date(Date.now()).toString()
    });
}
