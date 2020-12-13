// function getFeedbackValues(){
//     var a = document.getElementById("email").value;
//     var b = document.getElementById("fullname").value;
//     var c = document.getElementById("Issue_type").value;
//     var d = document.getElementById("explanation").value;
//     var msg = a.concat(b.concat(c.concat(d)));
//     alert(msg);
// }
function sendFeedbackVerifed(){
    console.log("sendFeedbackVerifed() called!");
    sendFeedbackVerifedHelper(document.getElementById("email").value, 
        document.getElementById("fullname").value, 
        document.getElementById("Issue_type").value, 
        document.getElementById("explanation").value, 
        Date(Date.now()).toString());
    document.getElementById("Issue_type").value='';
    document.getElementById("explanation").value='';
    console.log("Output clear");
    alert("Successfully submitted! Thank you for your feedback!");
}

const sendFeedbackVerifedHelper = (email, fullname, issue_type, explanation, 
    time) => {
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            fullname,
            issue_type,
            explanation,
            time
        })
    };
    fetch('http://localhost:8000/sendFeedbackVerifed', config)
    .catch(error => console.log(error));
}

function sendFeedbackUnverifed(){
    console.log("sendFeedbackUnverifed() called!");
    sendFeedbackUnverifedHelper(document.getElementById("email").value, 
        document.getElementById("fullname").value, 
        document.getElementById("Issue_type").value, 
        document.getElementById("explanation").value, 
        Date(Date.now()).toString());
    document.getElementById("email").value='';
    document.getElementById("fullname").value='';
    document.getElementById("Issue_type").value='';
    document.getElementById("explanation").value='';
    console.log("Output clear")
    alert("Successfully submitted! Thank you for your feedback!");
}

const sendFeedbackUnverifedHelper = (email, fullname, issue_type, explanation, 
    time) => {
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            fullname,
            issue_type,
            explanation,
            time
        })
    };
    fetch('http://localhost:8000/sendFeedbackUnverifed', config)
    .catch(error => console.log(error));
}

function getDiscordRequests(){
    console.log("getDiscordRequests() called :)");
    console.log(firebase)
    var fbRef = "DiscordServerRequests/";
    firebase.database().ref(fbRef).push().set({
        email: localStorage.getItem("user-email"),
        className: localStorage.getItem("classinput"),
        inviteURL: document.getElementById("invitelink").value,
        profName: document.getElementById("professor").value,
        quarter : document.getElementById("quarter").value,
        year: document.getElementById("year").value,
        time: Date(Date.now()).toString()
    });

    alert("Successfully submitted! Thank you for your contribution!");
}

