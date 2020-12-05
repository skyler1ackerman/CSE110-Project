var clubsArr = []

async function resetAddCommunity(){
    console.log("resetAddCommunity() called :)");
    document.getElementById("serverName").value =  '';
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
    if(![serverName, category, type, email, desc].every(Boolean)){
        getClubSnapshot();
    //if not in database submit, else raise alert
        if (clubsArr.includes(serverName)){
            alert("The community already exists. Try using the search communities page");
        } else {
            firebase.database().ref('clubs').child(category).child(serverName).set({
                inviteLink: link,
                org_type: type,
                contact: email,
                description: desc,
            });
            alert("Successful submission!");
        }
        resetAddCommunity();
    }else{
        alert("Fill all required fields.");
    }
}