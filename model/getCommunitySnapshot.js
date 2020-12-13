const db = require("../server/db_config");

module.exports = async function getCommunitySnapshot() {
    var ref = db.ref("clubs");
    var communitiesArr = [];
    await ref.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            childSnapshot.forEach(function(clubSnapshot){
                var communityName = clubSnapshot.key;
                communitiesArr.push(communityName);
            });
        });
    });
    return JSON.stringify({'result': communitiesArr});
}
