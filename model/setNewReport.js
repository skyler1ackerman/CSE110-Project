const db = require("../server/db_config");

module.exports = function setClassServerRequest(reportRef, community_or_class_name, discord_link, report_contact_email, user_fullname, report_reason) {
    
    db.ref(reportRef).push().set({
        communityOrClassName: community_or_class_name,
        discordLink: discord_link,
        email: report_contact_email,
        fullname: user_fullname,
        reason: report_reason,
        time: Date(Date.now()).toString(),
    });
}
