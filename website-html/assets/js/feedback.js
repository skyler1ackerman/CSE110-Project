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

    if (!firebase.apps.length) {
      console.log("firebase app initlized!");
      firebase.initializeApp(firebaseConfig);
    }
  
    // var feedback_ref = firebase.database().ref("Feedbacks/");
    var counter = 1;
    firebase.database().ref("Feedbacks/").on("value", function(snapshot) {
      snapshot.forEach(function(snapshot) {
        counter++;
      });
    });

    var fbRef = "Feedback/UCSD";
    var childRef =  "feedback" + counter + "/";
    console.log(fbRef);
  
    firebase.database().ref(fbRef).child(childRef).set({
        email: localStorage.getItem("user-email"),
        fullname: localStorage.getItem("user-displayname"),
        issue_type: document.getElementById("Issue_type").value,
        explanation: document.getElementById("explanation").value,
    });

    alert("Successfully submitted! Thank you for your feedback!");
}

function getFeedbackOutside(){
  console.log("getFeedbackValues() called!");

  if (!firebase.apps.length) {
    console.log("firebase app initlized!");
    firebase.initializeApp(firebaseConfig);
  }

  var counter = 1;
  firebase.database().ref("Feedbacks/").on("value", function(snapshot) {
    snapshot.forEach(function(snapshot) {
      counter++;
    });
  });

  var fbRef = "Feedback/Outside";
  var childRef =  "feedback" + counter + "/";
  console.log(fbRef);

  firebase.database().ref(fbRef).child(childRef).set({
      email: document.getElementById("email").value,
      fullname: document.getElementById("fullname").value,
      issue_type: document.getElementById("Issue_type").value,
      explanation: document.getElementById("explanation").value,
  });

  alert("Successfully submitted! Thank you for your feedback!");
}