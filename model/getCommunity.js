const db = require("../server/db_config");

module.exports = async function getCommunity(communityName) {
    var resultsString = { str : "" };
    var ref = db.ref("clubs");
     await ref.once("value", function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.forEach(function(clubSnapshot){
                    if(clubSnapshot.key === communityName){
                        resultsString.str += "<li class='community'>";
                        resultsString.str += "<div>";
                        resultsString.str += "<p></p>";
                        if(clubSnapshot.val().status !== "") {
                            resultsString.str +=   `<p><b>Status: </b>${clubSnapshot.val().status}</p>`;
                        };
                        if(clubSnapshot.val().org_type !== "") {
                            resultsString.str +=   `<p><b>Type: </b>${clubSnapshot.val().org_type}</p>`;
                        };
                        if(clubSnapshot.val().contact !== ""){
                            resultsString.str +=   `<p><b>Contact: </b>${clubSnapshot.val().contact}</p>`;
                        };
                        if(clubSnapshot.val().description !== "") {
                            resultsString.str +=   `<p><b>Description: </b>${clubSnapshot.val().description}</p>`;
                        };
                        if(clubSnapshot.val().social_media !== "") {
                            resultsString.str +=   `<p><b>Social Media: </b>${clubSnapshot.val().social_media}</p>`;
                        };
                        if(clubSnapshot.val().inviteLink !== "") {
                            resultsString.str +=   `<div style='display: flex;'><a href=\"${clubSnapshot.val().inviteLink}\" target="_blank" class="button primary" style="text-align: center;">Join Discord</a>`;
                            resultsString.str +=   `<button class=\"button\" style="margin-left: 10px; text-align: center; font-family: inherit;" onClick=\"goToReportPageFromCommunity('${clubSnapshot.key}', '${clubSnapshot.val().inviteLink}');\">Report</button>`;
                            resultsString.str +=   `<button id="update_community_btn" style='margin-left: auto; font-family: inherit;' class=\"button\" style="text-align: center;" onClick=\"goToUpdateCommunityPage('${clubSnapshot.key}', '${clubSnapshot.val().inviteLink}');\">Update</button></div>`;

                        }
                        else{
                            resultsString.str +=   `<button id="update_community_btn" style='margin-left: 10px; float: right; font-family: inherit;' class=\"button\" style="text-align: center;" onClick=\"goToUpdateCommunityPage('${clubSnapshot.key}', '${clubSnapshot.val().inviteLink}');\">Update</button>`;
                        };
                        resultsString.str += "<p></p>";
                        resultsString.str += "</div>";
                        resultsString.str += "</li>";

                    }
                });
            });
        });
    return resultsString.str;
}
