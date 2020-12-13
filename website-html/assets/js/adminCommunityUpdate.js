function retrieveCommunitiesUpdates() {
    let communityUpdatesElement = document.querySelector("#communitiesUpdates");
    var communityUpdatesRef = firebase.database().ref("UpdateCommunity/");
    communityUpdatesRef.on("value", function (snapshot) {
        while (communityUpdatesElement.hasChildNodes()) {
            communityUpdatesElement.removeChild(communityUpdatesElement.lastChild);
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No community update submitted in this section at this time.";
        if (!snapshot.hasChildren()) {
            communityUpdatesElement.append(emptyMessage);
        }
        snapshot.forEach(function (childSnapshot) {
            var communityUpdate = childSnapshot.val();
            let newCommunityUpdateBoxElement = document.createElement("div");
            newCommunityUpdateBoxElement.setAttribute("id", childSnapshot.key);
            newCommunityUpdateBoxElement.style.marginBottom = "5vh";

            // Time
            let time = document.createElement("textarea");
            time.innerText = communityUpdate.time || "N/A";
            time.rows = 1;
            time.readOnly = true;
            time.style.textAlign = "center";

            // Email
            let email = document.createElement("textarea");
            email.innerText = communityUpdate.email || "N/A";
            email.rows = 1;
            email.readOnly = true;
            email.style.textAlign = "center";

            // Fullname
            let fullname = document.createElement("textarea");
            fullname.innerText = communityUpdate.fullname || "N/A";
            fullname.rows = 1;
            fullname.readOnly = true;
            fullname.style.textAlign = "center";

            // Update Reason
            let communityUpdateReason = document.createElement("textarea");
            communityUpdateReason.innerText = "";
            communityUpdateReason.innerText += "Reason for updating: ";
            communityUpdateReason.innerText += communityUpdate.communityUpdateReason || "N/A";
            communityUpdateReason.rows = 5;
            communityUpdateReason.readOnly = true;
            communityUpdateReason.style.textAlign = "center";

            // Community name
            let communityName = document.createElement("textarea");
            communityName.innerText = communityUpdate.communityName || "N/A";
            communityName.rows = 1;
            communityName.readOnly = true;
            communityName.style.textAlign = "center";

            // Community Org Type
            let communityType = document.createElement("textarea");
            communityType.innerText = communityUpdate.communityType || "N/A";
            communityType.rows = 1;
            communityType.readOnly = true;
            communityType.style.textAlign = "center";

            // Community Contact
            let communityContact = document.createElement("textarea");
            communityContact.innerText = communityUpdate.communityContact || "N/A";
            communityContact.rows = 1;
            communityContact.readOnly = true;
            communityContact.style.textAlign = "center";

            // Community Invite URL
            let communityInviteLink = document.createElement("textarea");
            communityInviteLink.innerText = communityUpdate.communityInviteLink || "N/A";
            communityInviteLink.rows = 1;
            communityInviteLink.readOnly = true;
            communityInviteLink.style.textAlign = "center";

            // Community Social Media
            let communitySocialMedia = document.createElement("textarea");
            communitySocialMedia.innerText = communityUpdate.communitySocialMedia || "N/A";
            communitySocialMedia.rows = 1;
            communitySocialMedia.readOnly = true;
            communitySocialMedia.style.textAlign = "center";

            // Community Description
            let communityDescription = document.createElement("textarea");
            communityDescription.innerText = communityUpdate.communityDescription || "N/A";
            communityDescription.rows = 5;
            communityDescription.readOnly = true;
            communityDescription.style.textAlign = "center";

            let updateBtn = document.createElement("button");
            updateBtn.innerText = "Update";
            updateBtn.addEventListener("click", function () {
                // Delete previous community info
                if (
                    communityUpdate.previousCommunityCategory !== null ||
                    communityUpdate.previousCommunityCategory !== undefined ||
                    communityUpdate.previousCommunityCategory !== ""
                ) {
                    const clubToBeRemovedRef = firebase
                        .database()
                        .ref(`clubs/${communityUpdate.previousCommunityCategory}`);
                    clubToBeRemovedRef.child(communityUpdate.communityName).remove();
                }

                updateCommunitiesInfotoDBFromAdminPage(
                    communityUpdate.communityCategory,
                    communityUpdate.communityContact,
                    communityUpdate.communityName,
                    communityUpdate.communityType,
                    communityUpdate.communityInviteLink,
                    communityUpdate.communitySocialMedia,
                    communityUpdate.communityDescription
                );
                communityUpdatesRef.child(newCommunityUpdateBoxElement.id).remove();
            });

            let ignoreBtn = document.createElement("button");
            ignoreBtn.innerText = "Ignore";
            ignoreBtn.addEventListener("click", function () {
                communityUpdatesRef.child(newCommunityUpdateBoxElement.id).remove();
            });

            newCommunityUpdateBoxElement.appendChild(time);
            newCommunityUpdateBoxElement.appendChild(email);
            newCommunityUpdateBoxElement.appendChild(fullname);
            newCommunityUpdateBoxElement.appendChild(communityUpdateReason);
            newCommunityUpdateBoxElement.appendChild(communityContact);
            newCommunityUpdateBoxElement.appendChild(communityName);
            newCommunityUpdateBoxElement.appendChild(communityType);
            newCommunityUpdateBoxElement.appendChild(communityType);
            newCommunityUpdateBoxElement.appendChild(communityInviteLink);
            newCommunityUpdateBoxElement.appendChild(communitySocialMedia);
            newCommunityUpdateBoxElement.appendChild(communityDescription);
            newCommunityUpdateBoxElement.appendChild(updateBtn);
            newCommunityUpdateBoxElement.appendChild(ignoreBtn);
            CommunitiesUpdateArr.push(communityUpdate);
            communityUpdatesElement.append(newCommunityUpdateBoxElement);
        });
    });

    console.log("communityUpdateArr:! ", CommunitiesUpdateArr);
}

function updateCommunitiesInfotoDBFromAdminPage(
    communityCategory,
    communityContact,
    communityName,
    communityType,
    communityInviteLink,
    communitySocialMedia,
    communityDescription
    ) {
    //First, count number of children in the class
    var Ref = `clubs/${communityCategory}`;

    firebase.database().ref(Ref).child(communityName).set({
        contact: communityContact,
        description: communityDescription,
        org_type: communityType,
        inviteLink: communityInviteLink,
        social_media: communitySocialMedia,
        status: "Current",
    });
}

CommunitiesUpdateArr = [];
retrieveCommunitiesUpdates();
