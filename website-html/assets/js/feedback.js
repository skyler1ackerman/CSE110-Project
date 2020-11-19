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

function retrieveFeedbackUCSD() {
    console.log("retrieveFeedbackUCSD() called :)");

    let feedbackUCSDElement = document.querySelector('#feedbackUCSD')

    var ref = firebase.database().ref("Feedback/UCSD");
    var counter = 1
    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            counter += 1
            var feedback = childSnapshot.val();

            let newFeedbackBoxElement = document.createElement('div')
            newFeedbackBoxElement.setAttribute("id", "feedback-UCSD-box");
            newFeedbackBoxElement.style.border = "solid #FFFFFF"
            newFeedbackBoxElement.style.marginBottom = "10px"

            // Email
            let emailLabel = document.createElement('label')
            emailLabel.innerText = "email"

            let email = document.createElement('span')
            email.innerText = feedback.email || 'N/A'


            // Fullname
            let fullnameLabel = document.createElement('label')
            fullnameLabel.innerText = "fullname"

            let fullname = document.createElement('span')
            fullname.innerText = feedback.fullname || 'N/A'

            // Issue Type
            let issueTypeLabel = document.createElement('label')
            issueTypeLabel.innerText = "Issue Type"

            let issue_type = document.createElement('span')
            issue_type.innerText = feedback.issue_type || 'N/A'

            // Explanation
            let explanationLabel = document.createElement('label')
            explanationLabel.innerText = "Explanation"

            let explanation = document.createElement('span')
            explanation.innerText = feedback.explanation || 'N/A'

            newFeedbackBoxElement.appendChild(emailLabel)
            newFeedbackBoxElement.appendChild(email)
            newFeedbackBoxElement.appendChild(fullnameLabel)
            newFeedbackBoxElement.appendChild(fullname)
            newFeedbackBoxElement.appendChild(issueTypeLabel)
            newFeedbackBoxElement.appendChild(issue_type)
            newFeedbackBoxElement.appendChild(explanationLabel)
            newFeedbackBoxElement.appendChild(explanation)

            feedbackUCSDArr.push(feedback);

            feedbackUCSDElement.append(newFeedbackBoxElement)
        });
    });

    console.log("feedbackUCSDArr:! ", feedbackUCSDArr);
}

function retrieveFeedbackOutside() {
    console.log("retrieveFeedbackOutside() called :)");

    var ref = firebase.database().ref("Feedback/Outside");
    let feedbackOutsideElement = document.querySelector('#feedbackOutside')
    counter = 1

    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var feedback = childSnapshot.val();
            counter += 1

            let newFeedbackBoxElement = document.createElement('div')
            newFeedbackBoxElement.setAttribute("id", "feedback-Outside-box");
            newFeedbackBoxElement.style.border = "solid #FFFFFF"
            newFeedbackBoxElement.style.marginBottom = "10px"

            // Email
            let emailLabel = document.createElement('label')
            emailLabel.innerText = "email"

            let email = document.createElement('span')
            email.innerText = feedback.email || 'N/A'


            // Fullname
            let fullnameLabel = document.createElement('label')
            fullnameLabel.innerText = "fullname"

            let fullname = document.createElement('span')
            fullname.innerText = feedback.fullname || 'N/A'

            // Issue Type
            let issueTypeLabel = document.createElement('label')
            issueTypeLabel.innerText = "Issue Type"

            let issue_type = document.createElement('span')
            issue_type.innerText = feedback.issue_type || 'N/A'

            // Explanation
            let explanationLabel = document.createElement('label')
            explanationLabel.innerText = "Explanation"

            let explanation = document.createElement('span')
            explanation.innerText = feedback.explanation || 'N/A'

            newFeedbackBoxElement.appendChild(emailLabel)
            newFeedbackBoxElement.appendChild(email)
            newFeedbackBoxElement.appendChild(fullnameLabel)
            newFeedbackBoxElement.appendChild(fullname)
            newFeedbackBoxElement.appendChild(issueTypeLabel)
            newFeedbackBoxElement.appendChild(issue_type)
            newFeedbackBoxElement.appendChild(explanationLabel)
            newFeedbackBoxElement.appendChild(explanation)

            feedbackOutsideElement.append(newFeedbackBoxElement)

            feedbackOutsideArr.push(feedback);
        });
    });
    console.log("feedbackOutsideArr:! ", feedbackOutsideArr);
}

function feedbackUCSDSelected(){
    console.log("feedbackUCSDSelected() called");
    document.getElementById("feedbackOutside").style.display = "none";
    document.getElementById("feedbackUCSD").style.display = "block";
}

function feedbackOutsideSelected(){
    console.log("feedbackOutsideSelected() called");
    document.getElementById("feedbackUCSD").style.display = "none";
    document.getElementById("feedbackOutside").style.display = "block";
}

feedbackUCSDArr = []
feedbackOutsideArr = []
retrieveFeedbackUCSD()
retrieveFeedbackOutside()