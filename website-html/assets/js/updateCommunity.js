async function submitUpdateCommunity() {
    console.log("submitUpdateCommunity() called!");
    if (
        document.getElementById("reportContactEmail") == null ||
        document.getElementById("user-displayname") == null
    ) {
        console.error(`Missing server_type, reportContactEmail, or displayname`);
    }

    if (
        localStorage.getItem('isCommunitySelected') == null ||
        localStorage.getItem("communityOrClassNameSelected") == null ||
        localStorage.getItem("communityOrClassDiscordServerSelected") == null
    ) {
        console.error(`Missing communityOrClassNameSelected or communityOrClassDiscordServerSelected`);
    }

    let server_type = localStorage.getItem('isCommunitySelected') === "True" ? 'Community' : 'Class';
    var fbRef = `Report/${server_type}`;

    try {
        await firebase
            .database()
            .ref(fbRef)
            .push()
            .set({
                communityOrClassName: localStorage.getItem("communityOrClassNameSelected"),
                discordLink: localStorage.getItem("communityOrClassDiscordServerSelected"),
                email: document.getElementById("reportContactEmail").value,
                fullname: localStorage.getItem("user-displayname"),
                reason: document.getElementById("reportReason").value,
                time: Date(Date.now()).toString(),
            });

        await firebase
            .database()
            .ref(fbRef)
            .once("child_added")
            .then(function () {
                window.location.href = "afterlogin.html";

                console.log("Back to the home page!");
            });
    } catch (err) {
        throw err;
    }

    alert("Successfully submitted! Thank you for your report!");
}
