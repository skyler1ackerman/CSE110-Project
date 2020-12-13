var clubsArr = []


const getCommunityName = () => {
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getCommunityName', config)
    .then(response => response.json())
    .catch(error => console.log(error));
}

const setCommunity = (contacEmail, category, serverName, desc, link, type, socialMedia) => {
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contacEmail, 
            category, 
            serverName, 
            desc, 
            link, 
            type, 
            socialMedia
        })
    };
    fetch('http://localhost:8000/setCommunityRequest', config)
    .catch(error => console.log(error));
}

getClubSnapshot();

function resetAddCommunity() {
    console.log("resetAddCommunity() called :)");
    document.getElementById("serverName").value = '';
    document.getElementById("comCategory").value = '';
    document.getElementById("discordLink").value = '';
    document.getElementById("type").value = '';
    document.getElementById("social_media").value = '';
    document.getElementById("description").value = '';
    document.getElementById("contact_email").value = '';
}

// Get all the class names and populat clubsArr
function getClubSnapshot() {
    console.log("getClassSnapshot() called :)");
    // TODO: check the child tree (do the names match?)

    // getCommunityName().then(snapshot => {
    //     console.log(snapshot);
    //     snapshot.forEach(function (childSnapshot) {
    //         childSnapshot.forEach(function (child2Snapshot) {
    //             var clubName = child2Snapshot.key;
    //             clubsArr.push(clubName);
    //         });
    //     });
    // });

    getCommunityName().then(snapshot => {
        // console.log(snapshot);
        Object.keys(snapshot).forEach(function (club_category) {
            // console.log(snapshot[club_category]);
            Object.keys(snapshot[club_category]).forEach(function (club_name) {
                var clubName = club_name;
                clubsArr.push(clubName);
            });
        });
    });
}

//  twe want to check if the community already exists inhe database
// we do this by comparing community name
async function submit_community() {
    //field variables
    var serverName = document.getElementById("serverName").value;
    var link = document.getElementById("discordLink").value;
    var socialMedia = document.getElementById("social_media").value;
    var category = document.getElementById("comCategory").value;
    var type = document.getElementById("type").value;
    var desc = document.getElementById("description").value;
    var contacEmail = document.getElementById("contact_email").value;
    
    if (!serverName) {
        alert("Please enter the club discord server name.")
        return;
    }

    // if contact is not filled, it will take user's login email as it value
    if (!contacEmail){
        contacEmail = localStorage.getItem("user-email");
    }

    //check if filled out then populate array
    if (serverName && type && desc && category) {
        //if not in database submit, else raise alert
        if (clubsArr.includes(serverName)) {
            alert("The community already exists. Try using the search communities page");
        } else {
            setCommunity(contacEmail, category, serverName, desc, link, type, socialMedia);
            alert("Successfully submitted! Thank you for adding the community!");
        }
        resetAddCommunity();
    } else {
        alert("Fill all required fields.");
    }
}
