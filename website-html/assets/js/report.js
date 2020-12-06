async function submitReport() {
    console.log("submitCommunityReport() called!");
    if (document.getElementById("server_type") == null) return;

    var fbRef = `Report/${document.getElementById("server_type").value}`;

    await firebase
        .database()
        .ref(fbRef)
        .push()
        .set({
            communityOrClassName: document.getElementById("reportServerName").value,
            discordLink: document.getElementById("reportDiscordLink").value,
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
    alert("Successfully submitted! Thank you for your report!");
}
