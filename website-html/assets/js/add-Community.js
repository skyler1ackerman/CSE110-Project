/*function writeNewCommunityData() {
    // TODO: check the child tree (do the names match?)
    firebase.database().ref("Clubs/Category").set({
        comName: document.getElementById("serverName").value,
        discordLink: document.getElementById("discordLink").value,
        type: document.getElementById("type").value,
        category: document.getElementById("comCategory").value,
        email: document.getElementById("email").value,
        description: document.getElementById("description").value
    });
}*/

// Get all the 
/*function getClubSnapshot() {
    console.log("getClassSnapshot() called :)");
    // TODO: check the child tree (do the names match?)
    var ref = firebase.database().ref("clubs");
    ref.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var clubName = childSnapshot.key;
            clubsArr.push(clubName);
        });
    });
}*/

// we want to check if the community already exists in the database
// we do this by comparing community name
async function submit_community() {
    /*    if (!clubsArr){
            getClubSnapshot();
        }
        var serverName = document.getElementById("serverName").value;
    
        if (clubsArr.includes(serverName)){
            alert("The community already exists. Try using the search communities page :)");
        } else {*/
            /*var serverName = document.getElementById("serverName").value;
            var categoryName = document.getElementById("comCategory").value;
            var link = document.getElementById("discordLink").value;
            var type = document.getElementById("type").value;
            var email = document.getElementById("email").value;
            var desc = document.getElementById("description").value;
    
            firebase.database().ref('clubs/'+categoryName+'/'+serverName).update({
                inviteLink: link,
                org_type: type,
                contact: email,
                description: desc,
            });
        }*/
        var serverName = document.getElementById("serverName").value;
        console.log("variable initialization");
        var categoryName = document.getElementById("comCategory").value;
        var link = document.getElementById("discordLink").value;
        var type = document.getElementById("type").value;
        var email = document.getElementById("email").value;
        var desc = document.getElementById("description").value;
    
        console.log("post variable initialization");
        firebase.database().ref('clubTemporary/').child(categoryName).child(serverName).update({
            inviteLink: link,
            org_type: type,
            contact: email,
            description: desc,
            status: "",
            social_media: ""
          });
          console.log("post firebase call");
    }
    
    //var clubsArr = []