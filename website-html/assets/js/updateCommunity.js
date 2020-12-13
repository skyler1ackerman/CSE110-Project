async function submitUpdateCommunity() {

    if (
        localStorage.getItem("communityName") == null ||
        localStorage.getItem("user-displayname") == null ||
        localStorage.getItem("user-email") == null
    ) {
        console.error(`Missing communityName, displayname, or user-email`);
    }

    var fbRef = `UpdateCommunity/`;

    try {
        await firebase
            .database()
            .ref(fbRef)
            .push()
            .set({
                communityName: localStorage.getItem("communityName"),
                communityType: document.getElementById("communityType").value,
                communityCategory: document.getElementById("communityCategory").value,
                previousCommunityCategory:  localStorage.getItem("previousCommunityCategory"),
                communityInviteLink: document.getElementById("communityDiscordLink").value,
                communityContact: document.getElementById("communityContact").value,
                communityDescription: document.getElementById("communityDescription").value,
                communitySocialMedia: document.getElementById("communitySocialMedia").value,
                communityUpdateReason: document.getElementById("communityUpdateReason").value,
                fullname: localStorage.getItem("user-displayname"),
                email: localStorage.getItem("user-email"),
                time: Date(Date.now()).toString(),
            });
        // reason: document.getElementById("reportReason").value, For Later!

        await firebase
            .database()
            .ref(fbRef)
            .once("child_added")
            .then(function () {
                window.location.href = "afterlogin.html";
            });
    } catch (err) {
        throw err;
    }

    alert("Successfully submitted! Thank you for your update!");
}
