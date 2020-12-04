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

function checkIfExists() {
    comName = document.getElementById("serverName").value,
    discordLink = document.getElementById("discordLink").value,
    type = document.getElementById("type").value,
    category = document.getElementById("comCategory").value,
    email = document.getElementById("email").value,
    description = document.getElementById("description").value

     
}