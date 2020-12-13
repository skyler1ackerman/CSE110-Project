const db = require("../server/db_config");

module.exports = async function getCommunityByCat(category) {
    var catRef = "clubs/".concat(category);
    var resultsString = {str: ""};
    var ref = db.ref(catRef);
    await ref.once("value", function (snap) {
        //This loop iterates over the clubs associated with the category
        snap.forEach(function (childNodes) {
            resultsString.str += "<li class='community'>";
            resultsString.str += `<button class=\"collapsible\">${childNodes.key}</button>`;
            resultsString.str += '<div class="content">';
            resultsString.str += "<p></p>";
          
            if (childNodes.val().status !== "") {
                resultsString.str += `<p><b>Status: </b>${childNodes.val().status}</p>`;
            }
            if (childNodes.val().org_type !== "") {
                resultsString.str += `<p><b>Type: </b>${childNodes.val().org_type}</p>`;
            }
            if (childNodes.val().contact !== "") {
                resultsString.str += `<p><b>Contact: </b>${childNodes.val().contact}</p>`;
            }

            if (childNodes.val().description !== "") {
                resultsString.str += `<p><b>Description: </b>${childNodes.val().description}</p>`;
            }
            if (childNodes.val().social_media !== "") {
                resultsString.str += `<p><b>Social Media: </b>${childNodes.val().social_media}</p>`;
            }
            if (childNodes.val().inviteLink !== "") {
                resultsString.str += `<div style='display: flex;'><a href=\"${
                    childNodes.val().inviteLink
                }\" target="_blank" class="button primary" style="text-align: center;">Join Discord</a>`;
                resultsString.str += `<button id="update_community_btn" style='margin-left: auto; font-family: inherit;' class=\"button\" style="text-align: center;" onClick=\"goToUpdateCommunityPage('${
                    childNodes.key
                }', '${childNodes.val().contact}', '${
                    childNodes.val().inviteLink
                }', '${childNodes.val().description.replace(/"/g, "'").replace(/'/g, "\\'")}', '${
                    childNodes.val().org_type
                }', '${childNodes.val().social_media}', '${
                    childNodes.ref.parent.key
                }');\">Update</button></div>`;
            } else {
                resultsString.str += `<button id="update_community_btn" style='margin-left: 10px; margin-bottom: 10px; float: right; font-family: inherit; text-align: center;' class=\"button\" onClick=\"goToUpdateCommunityPage('${
                    childNodes.key
                }', '${childNodes.val().contact}', '${
                    childNodes.val().inviteLink
                }', '${childNodes.val().description.replace(/"/g, "'").replace(/'/g, "\\'")}', '${
                    childNodes.val().org_type
                }', '${childNodes.val().social_media}', '${
                    childNodes.ref.parent.key
                }');\">Update</button>`;
            }

            resultsString.str += "<p></p>";
            resultsString.str += "</div>";
            resultsString.str += "</li>";
        });
    });
    return resultsString.str;
};
