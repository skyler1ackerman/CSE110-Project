// function getFeedbackValues(){
//     var a = document.getElementById("email").value;
//     var b = document.getElementById("fullname").value;
//     var c = document.getElementById("Issue_type").value;
//     var d = document.getElementById("explanation").value;
//     var msg = a.concat(b.concat(c.concat(d)));
//     alert(msg);
// }
function getFeedbackValues(){
    console.log("getFeedbackValues() called!");

    // var feedback_ref = firebase.database().ref("Feedbacks/");
    var fbRef = "Feedback/Verified";
    firebase.database().ref(fbRef).push().set({
        email: document.getElementById("email").value,
        fullname: document.getElementById("fullname").value,
        issue_type: document.getElementById("Issue_type").value,
        explanation: document.getElementById("explanation").value,
        time:Date(Date.now()).toString()
    });

    firebase.database().ref(fbRef).once("child_added").then(function (){
        document.getElementById("Issue_type").value='';
        document.getElementById("explanation").value='';
        console.log("Output clear")

    });

    alert("Successfully submitted! Thank you for your feedback!");
}

function getFeedbackUnverified(){
  console.log("getFeedbackUnverified() called!");


  var fbRef = "Feedback/Unverified";
  firebase.database().ref(fbRef).push().set({
      email: document.getElementById("email").value,
      fullname: document.getElementById("fullname").value,
      issue_type: document.getElementById("Issue_type").value,
      explanation: document.getElementById("explanation").value,
      time:Date(Date.now()).toString()
  });



  firebase.database().ref(fbRef).once("child_added").then(function (){
          document.getElementById("email").value='';
          document.getElementById("fullname").value='';
          document.getElementById("Issue_type").value='';
          document.getElementById("explanation").value='';
        console.log("Output clear")
  });

  alert("Successfully submitted! Thank you for your feedback!");
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

