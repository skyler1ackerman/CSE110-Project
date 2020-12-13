var classesArr = []

const setClassServerRequest = (user_email, class_name, invite_URL, prof_Name, quarter, year) => {
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_email, 
            class_name, 
            invite_URL, 
            prof_Name, 
            quarter, 
            year
        })
    };
    fetch('http://localhost:8000/setClassServerRequest', config)
    .catch(error => console.log(error));
}

async function resetAddClass() {
    document.getElementById("invitelink").value = '';
    document.getElementById("professor").value = '';
    document.getElementById("quarter").value = '';
    document.getElementById("year").value = '';
}

// we want to check if the community already exists in the database
// we do this by comparing community name
function submitClass() {
    //field variables
    var user_email = localStorage.getItem("user-email");
    var class_name = localStorage.getItem("classinput");
    var invite_URL = document.getElementById("invitelink").value;
    var prof_Name = document.getElementById("professor").value;
    var quarter = document.getElementById("quarter").value;
    var year = document.getElementById("year").value;

    //check if filled out then populate array
    if ([invite_URL, prof_Name, quarter, year].every(Boolean)) {
        //if not in database submit, else raise alert
        // just pasted it here coz there is no export in the original file
        setClassServerRequest(user_email, class_name, invite_URL, prof_Name, quarter, year);        
        alert("Successfully submitted! Thank you for adding the class!");
        resetAddClass();
    } else {
        alert("Fill all required fields.");
    }
}