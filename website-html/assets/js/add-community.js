var clubsArr = []
getClubSnapshot();

async function resetAddCommunity() {
    console.log("resetAddCommunity() called :)");
    document.getElementById("serverName").value = '';
    document.getElementById("comCategory").value = '';
    document.getElementById("discordLink").value = '';
    document.getElementById("type").value = '';
    document.getElementById("email").value = '';
    document.getElementById("description").value = '';
}

// Get all the class names and populat clubsArr
async function getClubSnapshot() {
    console.log("getClassSnapshot() called :)");
    // TODO: check the child tree (do the names match?)
    var ref = firebase.database().ref("clubs");
    ref.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            childSnapshot.forEach(function (child2Snapshot) {
                var clubName = child2Snapshot.key;
                clubsArr.push(clubName);
            });
        });
    });
}

// we want to check if the community already exists in the database
// we do this by comparing community name
async function submit_community() {
    //field variables
    var serverName = document.getElementById("serverName").value;
    var category = document.getElementById("comCategory").value;
    var link = document.getElementById("discordLink").value;
    var type = document.getElementById("type").value;
    var email = document.getElementById("email").value;
    var desc = document.getElementById("description").value;

    //check if filled out then populate array
    if (![serverName, category, type, email, desc].every(Boolean)) {
        //if not in database submit, else raise alert
        if (clubsArr.includes(serverName)) {
            alert("The community already exists. Try using the search communities page");
        } else {
            var fbRef = "DiscordServerRequests/";
            firebase.database().ref(fbRef).child("Communities").push().set({
                email: localStorage.getItem("user-email"),
                className: localStorage.getItem("classinput"),
                inviteURL: discordUrl,
                profName: instructor,
                quarter: quarter,
                year: year,
                time: Date(Date.now()).toString()
            });

            alert("Successfully submitted! Thank you for your contribution!");
        }
        resetAddCommunity();
    } else {
        alert("Fill all required fields.");
    }
}


// why is it white, why is it pink??
// drop down
// nav bar
// 