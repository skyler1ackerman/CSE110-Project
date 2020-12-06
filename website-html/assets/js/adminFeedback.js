function retrieveFeedbackVerified() {
    console.log("retrieveFeedbackVerified() called :)");

    let feedbackVerifiedElement = document.querySelector('#feedbackVerified');
    var ResolvedRef="Feedback/ResolvedVerified";
    var refVerified = "Feedback/Verified";


    firebase.database().ref(refVerified).on("value", function(snapshot) {
        if(feedbackVerifiedElement != null){
            while(feedbackVerifiedElement.hasChildNodes()){
                feedbackVerifiedElement.removeChild(feedbackVerifiedElement.lastChild);
            }
        }
        snapshot.forEach(function(childSnapshot) {
            var feedback = childSnapshot.val();
            let newFeedbackBoxElement = document.createElement('div')
            newFeedbackBoxElement.setAttribute("id", childSnapshot.key);
            newFeedbackBoxElement.style.border = "gainsboro"
            newFeedbackBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = feedback.time || 'N/A'
            time.rows =1
            time.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = feedback.email || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = feedback.fullname || 'N/A'
            fullname.rows =1
            fullname.readOnly=true

            // Issue Type

            let issue_type = document.createElement('textarea')
            issue_type.innerText = feedback.issue_type || 'N/A'
            issue_type.rows =1
            issue_type.readOnly=true


            // Explanation
            let explanation = document.createElement('textarea')
            explanation.innerHTML ="Explanation: \n\t"+(feedback.explanation || 'N/A')
            explanation.readOnly=true



            let resolved = document.createElement('button')
            resolved.innerText = "Resolved"
            resolved.addEventListener("click",function(){
                firebase.database().ref(ResolvedRef).child(newFeedbackBoxElement.id).set({
                    email: feedback.email,
                    fullname: feedback.fullname,
                    issue_type: feedback.issue_type,
                    explanation: feedback.explanation,
                    time: feedback.time
                })
                firebase.database().ref(refVerified).child(newFeedbackBoxElement.id).remove();
            });

            newFeedbackBoxElement.appendChild(time)
            newFeedbackBoxElement.appendChild(email)
            newFeedbackBoxElement.appendChild(fullname)
            newFeedbackBoxElement.appendChild(issue_type)
            newFeedbackBoxElement.appendChild(explanation)
            newFeedbackBoxElement.appendChild(resolved)

            feedbackVerifiedArr.push(feedback);
            if(feedbackVerifiedElement != null) {
                feedbackVerifiedElement.append(newFeedbackBoxElement)
            }


        });
    });

    console.log("feedbackVerifiedArr:! ", feedbackVerifiedArr);
}
function retrieveResolvedVerified() {
    console.log("retrieveResolvedVerified() called :)");
    var ref=firebase.database().ref("Feedback/ResolvedVerified");
    var UnresolvedRef = firebase.database().ref("Feedback/Verified");
    let resolvedVerifiedElement = document.querySelector('#resolvedVerified')


    ref.on("value", function(snapshot) {
        if(resolvedVerifiedElement != null){
            while(resolvedVerifiedElement.hasChildNodes()){
                resolvedVerifiedElement.removeChild(resolvedVerifiedElement.lastChild);
            }
        }
        snapshot.forEach(function(childSnapshot) {
            var feedback = childSnapshot.val();

            let newFeedbackBoxElement = document.createElement('div')
            newFeedbackBoxElement.setAttribute("id", childSnapshot.key);
            newFeedbackBoxElement.style.border = "gainsboro"
            newFeedbackBoxElement.style.marginBottom = "10px"

            //Time
            let time = document.createElement('textarea')
            time.innerText = feedback.time || 'N/A'
            time.rows =1
            time.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = feedback.email || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = feedback.fullname || 'N/A'
            fullname.rows =1
            fullname.readOnly=true

            // Issue Type

            let issue_type = document.createElement('textarea')
            issue_type.innerText = feedback.issue_type || 'N/A'
            issue_type.rows =1
            issue_type.readOnly=true


            // Explanation
            let explanation = document.createElement('textarea')
            explanation.innerHTML ="Explanation: \n\t"+(feedback.explanation || 'N/A')
            explanation.readOnly=true

            let unresolved = document.createElement('button')
            unresolved.innerText = "Unresolved"
            unresolved.addEventListener("click",function(){
                UnresolvedRef.child(newFeedbackBoxElement.id).set({
                    email: feedback.email,
                    fullname: feedback.fullname,
                    issue_type: feedback.issue_type,
                    explanation: feedback.explanation,
                    time: feedback.time
                })
                ref.child(newFeedbackBoxElement.id).remove();
            });

            let removed = document.createElement('button')
            removed.innerText = "Removed"
            removed.addEventListener("click",function(){
                ref.child(newFeedbackBoxElement.id).remove();
            });
            newFeedbackBoxElement.appendChild(time)
            newFeedbackBoxElement.appendChild(email)
            newFeedbackBoxElement.appendChild(fullname)
            newFeedbackBoxElement.appendChild(issue_type)
            newFeedbackBoxElement.appendChild(explanation)
            newFeedbackBoxElement.appendChild(unresolved)
            newFeedbackBoxElement.appendChild(removed)

            if(resolvedVerifiedElement != null){
                resolvedVerifiedElement.append(newFeedbackBoxElement)
            }

            resolvedVerifiedArr.push(feedback);
        });
});
    console.log("resolvedVerifiedArr:! ", resolvedVerifiedArr);
}

function retrieveFeedbackUnverified() {
    console.log("retrieveFeedbackUnverified() called :)");
    var ResolvedRef=firebase.database().ref("Feedback/ResolvedUnverified");
    var ref = firebase.database().ref("Feedback/Unverified");
    let feedbackUnverifiedElement = document.querySelector('#feedbackUnverified')


    ref.on("value", function(snapshot) {
        if(feedbackUnverifiedElement != null){
            while(feedbackUnverifiedElement.hasChildNodes()){
                feedbackUnverifiedElement.removeChild(feedbackUnverifiedElement.lastChild);
            }
        }
        snapshot.forEach(function(childSnapshot) {
            var feedback = childSnapshot.val();

            let newFeedbackBoxElement = document.createElement('div')
            newFeedbackBoxElement.setAttribute("id", childSnapshot.key);
            newFeedbackBoxElement.style.border = "gainsboro"
            newFeedbackBoxElement.style.marginBottom = "10px"

            //Time
            let time = document.createElement('textarea')
            time.innerText = feedback.time || 'N/A'
            time.rows =1
            time.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = feedback.email || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = feedback.fullname || 'N/A'
            fullname.rows =1
            fullname.readOnly=true

            // Issue Type

            let issue_type = document.createElement('textarea')
            issue_type.innerText = feedback.issue_type || 'N/A'
            issue_type.rows =1
            issue_type.readOnly=true


            // Explanation
            let explanation = document.createElement('textarea')
            explanation.innerHTML ="Explanation: \n\t"+(feedback.explanation || 'N/A')
            explanation.readOnly=true

            let resolved = document.createElement('button')
            resolved.innerText = "Resolved"
            resolved.addEventListener("click",function(){
                ResolvedRef.child(newFeedbackBoxElement.id).set({
                    email: feedback.email,
                    fullname: feedback.fullname,
                    issue_type: feedback.issue_type,
                    explanation: feedback.explanation,
                    time: feedback.time
                })
                ref.child(newFeedbackBoxElement.id).remove();
            });
            newFeedbackBoxElement.appendChild(time)
            newFeedbackBoxElement.appendChild(email)
            newFeedbackBoxElement.appendChild(fullname)
            newFeedbackBoxElement.appendChild(issue_type)
            newFeedbackBoxElement.appendChild(explanation)
            newFeedbackBoxElement.appendChild(resolved)

            if(feedbackUnverifiedElement != null) {
                feedbackUnverifiedElement.append(newFeedbackBoxElement)
            }

            feedbackUnverifiedArr.push(feedback);
        });
    });
    console.log("feedbackUnverifiedArr:! ", feedbackUnverifiedArr);
}


function retrieveResolvedUnverified() {
    console.log("retrieveResolvedUnverified() called :)");
    var ref=firebase.database().ref("Feedback/ResolvedUnverified");
    var UnresolvedRef = firebase.database().ref("Feedback/Unverified");
    let resolvedUnverifiedElement = document.querySelector('#resolvedUnverified')


    ref.on("value", function(snapshot) {
        if(resolvedUnverifiedElement != null){
            while(resolvedUnverifiedElement.hasChildNodes()){
                resolvedUnverifiedElement.removeChild(resolvedUnverifiedElement.lastChild);
            }
        }
        snapshot.forEach(function(childSnapshot) {
            var feedback = childSnapshot.val();


            let newFeedbackBoxElement = document.createElement('div')
            newFeedbackBoxElement.setAttribute("id", childSnapshot.key);
            newFeedbackBoxElement.style.border = "gainsboro"
            newFeedbackBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = feedback.time || 'N/A'
            time.rows =1
            time.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = feedback.email || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = feedback.fullname || 'N/A'
            fullname.rows =1
            fullname.readOnly=true

            // Issue Type

            let issue_type = document.createElement('textarea')
            issue_type.innerText = feedback.issue_type || 'N/A'
            issue_type.rows =1
            issue_type.readOnly=true


            // Explanation
            let explanation = document.createElement('textarea')
            explanation.innerHTML ="Explanation: \n\t"+(feedback.explanation || 'N/A')
            explanation.readOnly=true

            let unresolved = document.createElement('button')
            unresolved.innerText = "Unresolved"
            unresolved.addEventListener("click",function(){
                UnresolvedRef.child(newFeedbackBoxElement.id).set({
                    email: feedback.email,
                    fullname: feedback.fullname,
                    issue_type: feedback.issue_type,
                    explanation: feedback.explanation,
                    time: feedback.time
                })
                ref.child(newFeedbackBoxElement.id).remove();
            });

            let removed = document.createElement('button')
            removed.innerText = "Removed"
            removed.addEventListener("click",function(){
                ref.child(newFeedbackBoxElement.id).remove();
            });
            newFeedbackBoxElement.appendChild(time)
            newFeedbackBoxElement.appendChild(email)
            newFeedbackBoxElement.appendChild(fullname)
            newFeedbackBoxElement.appendChild(issue_type)
            newFeedbackBoxElement.appendChild(explanation)
            newFeedbackBoxElement.appendChild(unresolved)
            newFeedbackBoxElement.appendChild(removed)

            if(resolvedUnverifiedElement != null){
                resolvedUnverifiedElement.append(newFeedbackBoxElement)
            }

            resolvedUnverifiedArr.push(feedback);
        });
    });
    console.log("resolvedUnverifiedArr:! ", resolvedUnverifiedArr);
}

function feedbackVerifiedSelected(){
    console.log("feedbackVerifiedSelected() called");
    document.getElementById("feedbackUnverified").style.display = "none";
    document.getElementById("feedbackVerified").style.display = "block";
    document.getElementById("resolvedUnverified").style.display = "none";
    document.getElementById("resolvedVerified").style.display = "none";
}

function feedbackUnverifiedSelected(){
    console.log("feedbackUnverifiedSelected() called");
    document.getElementById("feedbackUnverified").style.display = "block";;
    document.getElementById("feedbackVerified").style.display = "none";
    document.getElementById("resolvedUnverified").style.display = "none";
    document.getElementById("resolvedVerified").style.display = "none";

}

function resolvedVerifiedSelected(){
    console.log("ResolvedVerifiedSelected() called");
    document.getElementById("feedbackUnverified").style.display = "none";
    document.getElementById("feedbackVerified").style.display = "none";
    document.getElementById("resolvedUnverified").style.display = "none";
    document.getElementById("resolvedVerified").style.display = "block";
}

function resolvedUnverifiedSelected(){
    console.log("ResolvedUnverifiedSelected() called");
    document.getElementById("feedbackUnverified").style.display = "none";
    document.getElementById("feedbackVerified").style.display = "none";
    document.getElementById("resolvedUnverified").style.display = "block";
    document.getElementById("resolvedVerified").style.display = "none";

}

feedbackVerifiedArr = []
feedbackUnverifiedArr = []
resolvedVerifiedArr = []
resolvedUnverifiedArr = []

retrieveFeedbackVerified()
retrieveFeedbackUnverified()
retrieveResolvedUnverified()
retrieveResolvedVerified()
