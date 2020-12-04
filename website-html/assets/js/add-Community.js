function writeNewCommunityData() {
    // TODO: check the child tree (do the names match?)
    firebase.database().ref("Clubs/Category").set({
        comName = document.getElementById("serverName").value,
        discordLink = document.getElementById("discordLink").value,
        type = document.getElementById("type").value,
        category = document.getElementById("comCategory").value,
        email = document.getElementById("email").value,
        description = document.getElementById("description").value
    });
}

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
function submit_community() {
    if (!clubsArr){
        getClubSnapshot();
    }
    var serverName = document.getElementById("serverName").value;

    if (clubsArr.includes(serverName)){
        alert("The community already exists. Try using the search communities page :)");
    }
    else {
        firebase.database().ref("Clubs/Category").set({
            comName = document.getElementById("serverName").value,
            discordLink = document.getElementById("discordLink").value,
            type = document.getElementById("type").value,
            category = document.getElementById("comCategory").value,
            email = document.getElementById("email").value,
            description = document.getElementById("description").value
            
            // TODO: add notification that submission was successful.
        });
    }
}

var clubsArr = []