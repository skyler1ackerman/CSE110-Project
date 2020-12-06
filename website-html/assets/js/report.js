async function submitCommunityReport() {
    console.log("submitCommunityReport() called!");
    var fbRef = "Reports/Community";

    await firebase
        .database()
        .ref(fbRef)
        .push()
        .set({
            communityName: document.getElementById("reportServerName").value,
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
            window.location.href = "browse-community.html";

            console.log("Output clear");
        });
    alert("Successfully submitted! Thank you for your report!");
}

async function submitClassServerReport() {
    console.log("submitClassServerReport() called!");

    var fbRef = "Reports/Class";
    await firebase
        .database()
        .ref(fbRef)
        .push()
        .set({
            communityName: document.getElementById("reportServerName").value,
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
            window.location.href = "browse-class.html";

            console.log("Output clear");
        });

    alert("Successfully submitted! Thank you for your report!");
}
