function sendFeedbackVerifed(){
    sendFeedbackVerifedHelper(document.getElementById("email").value, 
        document.getElementById("fullname").value, 
        document.getElementById("Issue_type").value, 
        document.getElementById("explanation").value, 
        Date(Date.now()).toString());
    document.getElementById("Issue_type").value='';
    document.getElementById("explanation").value='';
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
    sendFeedbackUnverifedHelper(document.getElementById("email").value, 
        document.getElementById("fullname").value, 
        document.getElementById("Issue_type").value, 
        document.getElementById("explanation").value, 
        Date(Date.now()).toString());
    document.getElementById("email").value='';
    document.getElementById("fullname").value='';
    document.getElementById("Issue_type").value='';
    document.getElementById("explanation").value='';
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
