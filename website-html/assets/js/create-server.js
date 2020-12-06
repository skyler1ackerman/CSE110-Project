var classesArr = []
getClassSnapshot();

async function resetAddClass() {
    console.log("resetAddClass() called :)");
    document.getElementById("deptCode").value = '';
    document.getElementById("courseNum").value = '';
    document.getElementById("instructor").value = '';
    document.getElementById("quarter").value = '';
    document.getElementById("discordUrl").value = '';
}


async function getClassSnapshot() {
    console.log("getClassSnapshot() called :)");
    var ref = firebase.database().ref("classes");
    ref.on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var className = childSnapshot.key;
            classesArr.push(className);
        });
    });
}


// we want to check if the community already exists in the database
// we do this by comparing community name
async function submitClass() {
    //field variables
    var deptCode = document.getElementById("deptCode").value;
    var courseNum = document.getElementById("courseNum").value;
    var instructor = document.getElementById("instructor").value;
    var quarter= document.getElementById("quarter").value;
    var discordUrl= document.getElementById("discordUrl").value;
    var year = document.getElementById("year").value;

    //check if filled out then populate array
    if ([deptCode, courseNum, instructor, quarter, discordUrl].every(Boolean)) {
        // getClassSnapshot();
        //if not in database submit, else raise alert
        if (!classesArr.includes(deptCode + courseNum)) {
            alert(deptCode + courseNum + " course doesn't exist.");
        } else {
            // just pasted it here coz there is no export in the original file
            var fbRef = "DiscordServerRequests/";
            firebase.database().ref(fbRef).child("Classes").push().set({
                email: localStorage.getItem("user-email"),
                className: localStorage.getItem("classinput"),
                inviteURL: discordUrl,
                profName: instructor,
                quarter: quarter,
                year: year,
                time: Date(Date.now()).toString()
            });

            alert("Successfully submitted! Thank you for your contribution!");

            // firebase.database().ref('clubs').child(category).child(serverName).set({
            //     inviteLink: link,
            //     org_type: type,
            //     contact: email,
            //     description: desc,
            // });
            // alert("Successful submission!");
        }
        resetAddClass();
    } else {
        alert("Fill all required fields.");
    }
}