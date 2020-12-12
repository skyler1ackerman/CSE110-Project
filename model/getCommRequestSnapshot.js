const db = require("../server/db_config");

module.exports = async function getCommRequestSnapshot(path) {
    var results = {};
    await  db.ref(path).once("value",function(snapshot){
        snapshot.forEach(function (snapshot){
            var id =snapshot.key;
            var time = snapshot.val().time;
            var name = snapshot.val().name;
            var contact = snapshot.val().contact;
            var inviteLink = snapshot.val().inviteLink;
            var org_type = snapshot.val().org_type;
            var category = snapshot.val().category;
            var social_media = snapshot.val().social_media;
            var description = snapshot.val().description;
            results[id] = [];
            var Info = { "time":time,"name":name, "contact":contact,"inviteLink":inviteLink, "org_type":org_type,"category": category,"social_media": social_media, "description":description};
            results[id]=Info;
        }) ;
    });
    return results;
}