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
    var fbRef = "Feedback/UCSD";
    firebase.database().ref(fbRef).once("value").then(function (snapshot){
        counter=snapshot.numChildren()+1;
        console.log(fbRef);
        var childRef =  "feedback" + counter + "/";
        firebase.database().ref(fbRef).child(childRef).set({
            email: document.getElementById("email").value,
            fullname: document.getElementById("fullname").value,
            issue_type: document.getElementById("Issue_type").value,
            explanation: document.getElementById("explanation").value,
        });

        console.log(counter)

    });
    firebase.database().ref(fbRef).once("child_added").then(function (){
        document.getElementById("Issue_type").value='';
        document.getElementById("explanation").value='';
        console.log("Output clear")
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
  var fbRef = "Feedback/Outside";
  firebase.database().ref(fbRef).once("value").then(function (snapshot){
      counter=snapshot.numChildren()+1;
      console.log(fbRef);
      var childRef =  "feedback" + counter + "/";
      firebase.database().ref(fbRef).child(childRef).set({
          email: document.getElementById("email").value,
          fullname: document.getElementById("fullname").value,
          issue_type: document.getElementById("Issue_type").value,
          explanation: document.getElementById("explanation").value,
      });

      console.log(counter)

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

