const getFeedbackSnapshot=(path)=>{
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getFeedbackSnapshot?path=' + path, config)
        .then(response => response.json())
        .catch(error => console.log(error));
}



const moveFeedback =(from,to,id,email,fullname,issue_type,explanation,time)=>{
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from,
            to,
            id,
            email,
            fullname,
            issue_type,
            explanation,
            time
        })
    };
    fetch('http://localhost:8000/moveFeedback',config)
        .catch(error => config.log(error));

}

const removeData =(reference,id)=>{
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            reference,
            id
        })
    };
    fetch('http://localhost:8000/removeData',config)
        .catch(error => config.log(error));

}

function retrieveFeedbackVerified() {
    console.log("retrieveFeedbackVerified() called :)");

    let feedbackVerifiedElement = document.querySelector('#feedbackVerified');
    var ResolvedRef="Feedback/ResolvedVerified";
    var refVerified = "Feedback/Verified";
    var feedbackSnapshot;
    getFeedbackSnapshot(refVerified).then(snapshot=>{
        feedbackSnapshot=snapshot;
        if(feedbackVerifiedElement != null){
            while(feedbackVerifiedElement.hasChildNodes()){
                feedbackVerifiedElement.removeChild(feedbackVerifiedElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No feedback submitted in this section at this time.";

        if(Object.keys(feedbackSnapshot).length==0){
            feedbackVerifiedElement.append(emptyMessage);
        }
        for(var key in feedbackSnapshot){
                var id = key;
                var feedback = feedbackSnapshot[key];
                let newFeedbackBoxElement = document.createElement('div')
                newFeedbackBoxElement.setAttribute("id", id);
                newFeedbackBoxElement.style.border = "gainsboro"
                newFeedbackBoxElement.style.marginBottom = "10px"
                //Time
                let time = document.createElement('textarea')
                time.innerText = feedback["time"] || 'N/A'
                time.rows =1
                time.readOnly=true

                // Email
                let email = document.createElement('textarea')
                email.innerText = feedback["email"] || 'N/A'
                email.rows =1
                email.readOnly=true

                // Fullname
                let fullname = document.createElement('textarea')
                fullname.innerText = feedback["fullname"] || 'N/A'
                fullname.rows =1
                fullname.readOnly=true

                // Issue Type

                let issue_type = document.createElement('textarea')
                issue_type.innerText = feedback["issue_type"] || 'N/A'
                issue_type.rows =1
                issue_type.readOnly=true


                // Explanation
                let explanation = document.createElement('textarea')
                explanation.innerHTML ="Explanation: \n\t"+(feedback["explanation"] || 'N/A')
                explanation.readOnly=true



                let resolved = document.createElement('button')
                resolved.innerText = "Resolved"
                resolved.addEventListener("click",function(feedback){
                    moveFeedback(refVerified,ResolvedRef,newFeedbackBoxElement.id,feedback["email"],feedback["fullname"],
                        feedback["issue_type"],feedback["explanation"],feedback["time"])
                    // this.parentNode.parentNode.removeChild(this.parentNode);
                    retrieveFeedbackVerified();
                }.bind(resolved,feedback));

                newFeedbackBoxElement.appendChild(time)
                newFeedbackBoxElement.appendChild(email)
                newFeedbackBoxElement.appendChild(fullname)
                newFeedbackBoxElement.appendChild(issue_type)
                newFeedbackBoxElement.appendChild(explanation)
                newFeedbackBoxElement.appendChild(resolved)
                if(feedbackVerifiedElement != null) {
                    feedbackVerifiedElement.append(newFeedbackBoxElement)
                }
        }
    });
}
function retrieveResolvedVerified() {
    console.log("retrieveResolvedVerified() called :)");
    var ResolvedRef="Feedback/ResolvedVerified";
    var UnresolvedRef = "Feedback/Verified";
    let resolvedVerifiedElement = document.querySelector('#resolvedVerified')
    var feedbackSnapshot;
    getFeedbackSnapshot(ResolvedRef).then(snapshot=>{
        feedbackSnapshot=snapshot;
        if(resolvedVerifiedElement != null){
            while(resolvedVerifiedElement.hasChildNodes()){
                resolvedVerifiedElement.removeChild(resolvedVerifiedElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No feedback submitted in this section at this time.";
        if(Object.keys(feedbackSnapshot).length==0){
            resolvedVerifiedElement.append(emptyMessage);
        }

        for(var key in feedbackSnapshot){
            var id = key;
            var feedback = feedbackSnapshot[key];
            let newFeedbackBoxElement = document.createElement('div')
            newFeedbackBoxElement.setAttribute("id", id);
            newFeedbackBoxElement.style.border = "gainsboro"
            newFeedbackBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = feedback["time"] || 'N/A'
            time.rows =1
            time.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = feedback["email"] || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = feedback["fullname"] || 'N/A'
            fullname.rows =1
            fullname.readOnly=true

            // Issue Type

            let issue_type = document.createElement('textarea')
            issue_type.innerText = feedback["issue_type"] || 'N/A'
            issue_type.rows =1
            issue_type.readOnly=true


            // Explanation
            let explanation = document.createElement('textarea')
            explanation.innerHTML ="Explanation: \n\t"+(feedback["explanation"] || 'N/A')
            explanation.readOnly=true

            let unresolved = document.createElement('button')
            unresolved.innerText = "Unresolved"
            unresolved.addEventListener("click",function (feedback) {
                moveFeedback(ResolvedRef, UnresolvedRef,newFeedbackBoxElement.id, feedback["email"], feedback["fullname"],
                    feedback["issue_type"], feedback["explanation"], feedback["time"])
                //this.parentNode.parentNode.removeChild(this.parentNode);
                retrieveResolvedVerified();
            }.bind(unresolved,feedback));

            let remove = document.createElement('button')
            remove.innerText = "Remove"
            remove.addEventListener("click",function(){
                removeData(ResolvedRef,newFeedbackBoxElement.id);
                //this.parentNode.parentNode.removeChild(this.parentNode);
                retrieveResolvedVerified();
            }.bind(remove));
            newFeedbackBoxElement.appendChild(time)
            newFeedbackBoxElement.appendChild(email)
            newFeedbackBoxElement.appendChild(fullname)
            newFeedbackBoxElement.appendChild(issue_type)
            newFeedbackBoxElement.appendChild(explanation)
            newFeedbackBoxElement.appendChild(unresolved)
            newFeedbackBoxElement.appendChild(remove)

            if(resolvedVerifiedElement != null){
                resolvedVerifiedElement.append(newFeedbackBoxElement)
            }



        }

});
}

function retrieveFeedbackUnverified() {
    console.log("retrieveFeedbackUnverified() called :)");
    var ResolvedRef="Feedback/ResolvedUnverified";
    var ref = "Feedback/Unverified";
    let feedbackUnverifiedElement = document.querySelector('#feedbackUnverified')
    var feedbackSnapshot;
    getFeedbackSnapshot(ref).then(snapshot=>{
        feedbackSnapshot=snapshot;
        if(feedbackUnverifiedElement != null){
            while(feedbackUnverifiedElement.hasChildNodes()){
                feedbackUnverifiedElement.removeChild(feedbackUnverifiedElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No feedback submitted in this section at this time.";
        if(Object.keys(feedbackSnapshot).length==0){
            feedbackUnverifiedElement.append(emptyMessage);
        }
        for(var key in feedbackSnapshot){
            var id = key;
            var feedback = feedbackSnapshot[key];
            let newFeedbackBoxElement = document.createElement('div')
            newFeedbackBoxElement.setAttribute("id", id);
            newFeedbackBoxElement.style.border = "gainsboro"
            newFeedbackBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = feedback["time"] || 'N/A'
            time.rows =1
            time.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = feedback["email"] || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = feedback["fullname"] || 'N/A'
            fullname.rows =1
            fullname.readOnly=true

            // Issue Type

            let issue_type = document.createElement('textarea')
            issue_type.innerText = feedback["issue_type"] || 'N/A'
            issue_type.rows =1
            issue_type.readOnly=true


            // Explanation
            let explanation = document.createElement('textarea')
            explanation.innerHTML ="Explanation: \n\t"+(feedback["explanation"] || 'N/A')
            explanation.readOnly=true

            let resolved = document.createElement('button')
            resolved.innerText = "Resolved"
            resolved.addEventListener("click",function(feedback){
                moveFeedback(ref,ResolvedRef,newFeedbackBoxElement.id,feedback["email"],feedback["fullname"],
                    feedback["issue_type"],feedback["explanation"],feedback["time"])
                // this.parentNode.parentNode.removeChild(this.parentNode);
                retrieveFeedbackUnverified();
            }.bind(resolved,feedback));
            newFeedbackBoxElement.appendChild(time)
            newFeedbackBoxElement.appendChild(email)
            newFeedbackBoxElement.appendChild(fullname)
            newFeedbackBoxElement.appendChild(issue_type)
            newFeedbackBoxElement.appendChild(explanation)
            newFeedbackBoxElement.appendChild(resolved)

            if(feedbackUnverifiedElement != null) {
                feedbackUnverifiedElement.append(newFeedbackBoxElement)
            }

        }
    });
}


function retrieveResolvedUnverified() {
    console.log("retrieveResolvedUnverified() called :)");
    var ref="Feedback/ResolvedUnverified";
    var UnresolvedRef = "Feedback/Unverified";
    let resolvedUnverifiedElement = document.querySelector('#resolvedUnverified')
    var feedbackSnapshot;
    getFeedbackSnapshot(ref).then(snapshot=>{
        feedbackSnapshot=snapshot;
        if(resolvedUnverifiedElement != null){
            while(resolvedUnverifiedElement.hasChildNodes()){
                resolvedUnverifiedElement.removeChild(resolvedUnverifiedElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No feedback submitted in this section at this time.";
        if(Object.keys(feedbackSnapshot).length==0){
            resolvedUnverifiedElement.append(emptyMessage);
        }
        for(var key in feedbackSnapshot){
            var id = key;
            var feedback = feedbackSnapshot[key];
            let newFeedbackBoxElement = document.createElement('div')
            newFeedbackBoxElement.setAttribute("id", id);
            newFeedbackBoxElement.style.border = "gainsboro"
            newFeedbackBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = feedback["time"] || 'N/A'
            time.rows =1
            time.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = feedback["email"] || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = feedback["fullname"] || 'N/A'
            fullname.rows =1
            fullname.readOnly=true

            // Issue Type

            let issue_type = document.createElement('textarea')
            issue_type.innerText = feedback["issue_type"] || 'N/A'
            issue_type.rows =1
            issue_type.readOnly=true


            // Explanation
            let explanation = document.createElement('textarea')
            explanation.innerHTML ="Explanation: \n\t"+(feedback["explanation"] || 'N/A')
            explanation.readOnly=true

            let unresolved = document.createElement('button')
            unresolved.innerText = "Unresolved"
            unresolved.addEventListener("click",function(feedback){
                moveFeedback(ref, UnresolvedRef,newFeedbackBoxElement.id, feedback["email"], feedback["fullname"],
                    feedback["issue_type"], feedback["explanation"], feedback["time"])
                // this.parentNode.parentNode.removeChild(this.parentNode);
                retrieveResolvedUnverified();
            }.bind(unresolved,feedback));

            let remove = document.createElement('button')
            remove.innerText = "Remove"
            remove.addEventListener("click",function(){
                removeData(ref,newFeedbackBoxElement.id);
                // this.parentNode.parentNode.removeChild(this.parentNode);
                retrieveResolvedUnverified();
            }.bind(remove));
            newFeedbackBoxElement.appendChild(time)
            newFeedbackBoxElement.appendChild(email)
            newFeedbackBoxElement.appendChild(fullname)
            newFeedbackBoxElement.appendChild(issue_type)
            newFeedbackBoxElement.appendChild(explanation)
            newFeedbackBoxElement.appendChild(unresolved)
            newFeedbackBoxElement.appendChild(remove)

            if(resolvedUnverifiedElement != null){
                resolvedUnverifiedElement.append(newFeedbackBoxElement)
            }

        };
    });
}

function feedbackVerifiedSelected(){
    console.log("feedbackVerifiedSelected() called");
    retrieveFeedbackVerified()
    document.getElementById("feedbackUnverified").style.display = "none";
    document.getElementById("feedbackVerified").style.display = "block";
    document.getElementById("resolvedUnverified").style.display = "none";
    document.getElementById("resolvedVerified").style.display = "none";
}

function feedbackUnverifiedSelected(){
    retrieveFeedbackUnverified()
    console.log("feedbackUnverifiedSelected() called");
    document.getElementById("feedbackUnverified").style.display = "block";;
    document.getElementById("feedbackVerified").style.display = "none";
    document.getElementById("resolvedUnverified").style.display = "none";
    document.getElementById("resolvedVerified").style.display = "none";

}

function resolvedVerifiedSelected(){
    retrieveResolvedVerified()
    console.log("ResolvedVerifiedSelected() called");
    document.getElementById("feedbackUnverified").style.display = "none";
    document.getElementById("feedbackVerified").style.display = "none";
    document.getElementById("resolvedUnverified").style.display = "none";
    document.getElementById("resolvedVerified").style.display = "block";
}

function resolvedUnverifiedSelected(){
    retrieveResolvedUnverified()
    console.log("ResolvedUnverifiedSelected() called");
    document.getElementById("feedbackUnverified").style.display = "none";
    document.getElementById("feedbackVerified").style.display = "none";
    document.getElementById("resolvedUnverified").style.display = "block";
    document.getElementById("resolvedVerified").style.display = "none";

}

retrieveFeedbackVerified()




