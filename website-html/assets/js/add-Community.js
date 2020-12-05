var clubsArr = []

// Get all the 
function getClubSnapshot() {
    console.log("getClassSnapshot() called :)");
    // TODO: check the child tree (do the names match?)
    var ref = firebase.database().ref("clubs");
    ref.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var clubName = childSnapshot.key;
            clubsArr.push(clubName);
        });
    });
}

// we want to check if the community already exists in the database
// we do this by comparing community name
async function submit_community() {
    if (!clubsArr){
        getClubSnapshot();
    }
    var serverName = document.getElementById("serverName").value;
    var category = document.getElementById("comCategory").value;

    if (clubsArr.includes(serverName)){
        alert("The community already exists. Try using the search communities page :)");
    } else {
        firebase.database().ref('clubs').child(category).child(serverName).set({
        inviteLink: document.getElementById("discordLink").value,
        org_type: document.getElementById("type").value,
        contact: document.getElementById("email").value,
        description: document.getElementById("description").value,
        status: "",
        social_media: ""
        });
    }
}