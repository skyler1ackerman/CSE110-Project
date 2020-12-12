const db = require("../server/db_config");
module.exports = function addCommunity(contact, name, inviteLink, org_type, category, social_media, description) {
    var Ref = "clubs/" + category;
    var childRef = name;

    db.ref(Ref).child(name).set({
        contact: contact,
        description: description,
        inviteLink: inviteLink,
        org_type: org_type,
        social_media: social_media,
        status: "Current"
    });
}