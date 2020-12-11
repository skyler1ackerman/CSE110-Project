const db = require("../server/db_config");

module.exports = function setCommunity(contacEmail, category, serverName, desc, link, type, socialMedia) {
    db.ref("DiscordServerRequests/").child("Communities/").push().set({
        contact: contacEmail,
        category: category,
        name: serverName,
        description: desc,
        inviteLink: link,
        org_type: type,
        social_media: socialMedia,
        time: Date(Date.now()).toString()
    });
}
