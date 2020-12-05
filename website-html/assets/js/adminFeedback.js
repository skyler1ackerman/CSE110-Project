function retrieveFeedbackUCSD() {
    console.log("retrieveFeedbackUCSD() called :)");

    let feedbackUCSDElement = document.querySelector('#feedbackUCSD');
    var ResolvedRef="Feedback/ResolvedUCSD";
    var refUCSD = "Feedback/UCSD";


    firebase.database().ref(refUCSD).on("value", function(snapshot) {
        if(feedbackUCSDElement != null){
            while(feedbackUCSDElement.hasChildNodes()){
                feedbackUCSDElement.removeChild(feedbackUCSDElement.lastChild);
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
                firebase.database().ref(refUCSD).child(newFeedbackBoxElement.id).remove();
            });

            newFeedbackBoxElement.appendChild(time)
            newFeedbackBoxElement.appendChild(email)
            newFeedbackBoxElement.appendChild(fullname)
            newFeedbackBoxElement.appendChild(issue_type)
            newFeedbackBoxElement.appendChild(explanation)
            newFeedbackBoxElement.appendChild(resolved)

            feedbackUCSDArr.push(feedback);
            if(feedbackUCSDElement != null) {
                feedbackUCSDElement.append(newFeedbackBoxElement)
            }


        });
    });

    console.log("feedbackUCSDArr:! ", feedbackUCSDArr);
}
function retrieveResolvedUCSD() {
    console.log("retrieveResolvedUCSD() called :)");
    var ref=firebase.database().ref("Feedback/ResolvedUCSD");
    var UnresolvedRef = firebase.database().ref("Feedback/UCSD");
    let resolvedUCSDElement = document.querySelector('#resolvedUCSD')


    ref.on("value", function(snapshot) {
        if(resolvedUCSDElement != null){
            while(resolvedUCSDElement.hasChildNodes()){
                resolvedUCSDElement.removeChild(resolvedUCSDElement.lastChild);
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

            if(resolvedUCSDElement != null){
                resolvedUCSDElement.append(newFeedbackBoxElement)
            }

            resolvedUCSDArr.push(feedback);
        });
    });
    console.log("resolvedUCSDArr:! ", resolvedUCSDArr);
}

function retrieveFeedbackOutside() {
    console.log("retrieveFeedbackOutside() called :)");
    var ResolvedRef=firebase.database().ref("Feedback/ResolvedOutside");
    var ref = firebase.database().ref("Feedback/Outside");
    let feedbackOutsideElement = document.querySelector('#feedbackOutside')


    ref.on("value", function(snapshot) {
        if(feedbackOutsideElement != null){
            while(feedbackOutsideElement.hasChildNodes()){
                feedbackOutsideElement.removeChild(feedbackOutsideElement.lastChild);
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

            if(feedbackOutsideElement != null) {
                feedbackOutsideElement.append(newFeedbackBoxElement)
            }

            feedbackOutsideArr.push(feedback);
        });
    });
    console.log("feedbackOutsideArr:! ", feedbackOutsideArr);
}


function retrieveResolvedOutside() {
    console.log("retrieveResolvedOutside() called :)");
    var ref=firebase.database().ref("Feedback/ResolvedOutside");
    var UnresolvedRef = firebase.database().ref("Feedback/Outside");
    let resolvedOutsideElement = document.querySelector('#resolvedOutside')


    ref.on("value", function(snapshot) {
        if(resolvedOutsideElement != null){
            while(resolvedOutsideElement.hasChildNodes()){
                resolvedOutsideElement.removeChild(resolvedOutsideElement.lastChild);
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

            if(resolvedOutsideElement != null){
                resolvedOutsideElement.append(newFeedbackBoxElement)
            }

            resolvedOutsideArr.push(feedback);
        });
    });
    console.log("resolvedOutsideArr:! ", resolvedOutsideArr);
}

function feedbackUCSDSelected(){
    console.log("feedbackUCSDSelected() called");
    document.getElementById("feedbackOutside").style.display = "none";
    document.getElementById("feedbackUCSD").style.display = "block";
    document.getElementById("resolvedOutside").style.display = "none";
    document.getElementById("resolvedUCSD").style.display = "none";
}

function feedbackOutsideSelected(){
    console.log("feedbackOutsideSelected() called");
    document.getElementById("feedbackOutside").style.display = "block";;
    document.getElementById("feedbackUCSD").style.display = "none";
    document.getElementById("resolvedOutside").style.display = "none";
    document.getElementById("resolvedUCSD").style.display = "none";

}

function resolvedUCSDSelected(){
    console.log("ResolvedUCSDSelected() called");
    document.getElementById("feedbackOutside").style.display = "none";
    document.getElementById("feedbackUCSD").style.display = "none";
    document.getElementById("resolvedOutside").style.display = "none";
    document.getElementById("resolvedUCSD").style.display = "block";
}

function resolvedOutsideSelected(){
    console.log("ResolvedOutsideSelected() called");
    document.getElementById("feedbackOutside").style.display = "none";
    document.getElementById("feedbackUCSD").style.display = "none";
    document.getElementById("resolvedOutside").style.display = "block";
    document.getElementById("resolvedUCSD").style.display = "none";

}

feedbackUCSDArr = []
feedbackOutsideArr = []
resolvedUCSDArr = []
resolvedOutsideArr = []

retrieveFeedbackUCSD()
retrieveFeedbackOutside()
retrieveResolvedOutside()
retrieveResolvedUCSD()