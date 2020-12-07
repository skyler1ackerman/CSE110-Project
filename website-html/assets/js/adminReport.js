function retrieveReportCommunity() {
    console.log("retrieveReportCommunity() called :)");

    let reportCommunityElement = document.querySelector('#reportCommunity');
    var ResolvedRef="Report/ResolvedCommunity";
    var refCommunity = "Report/Community";


    firebase.database().ref(refCommunity).on("value", function(snapshot) {
        if(reportCommunityElement != null){
            while(reportCommunityElement.hasChildNodes()){
                reportCommunityElement.removeChild(reportCommunityElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No report submitted in this section at this time.";
        if(!snapshot.hasChildren()){
            reportCommunityElement.append(emptyMessage);
        }
        snapshot.forEach(function(childSnapshot) {

            var report = childSnapshot.val();
            let newReportBoxElement = document.createElement('div')
            newReportBoxElement.setAttribute("id", childSnapshot.key);
            newReportBoxElement.style.border = "gainsboro"
            newReportBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = report.time || 'N/A'
            time.rows =1
            time.readOnly=true

            // Community Name
            let communityOrClassName = document.createElement('textarea')
            communityOrClassName.innerText = report.communityOrClassName || 'N/A'
            communityOrClassName.rows =1
            communityOrClassName.readOnly=true

            // Discord Link
            let discordLink = document.createElement('textarea')
            discordLink.innerText = report.discordLink || 'N/A'
            discordLink.rows =1
            discordLink.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = report.email || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = report.fullname || 'N/A'
            fullname.rows = 1
            fullname.readOnly = true

            // Reason
            let reason = document.createElement('textarea')
            reason.innerHTML ="Reason: \n\t"+(report.reason || 'N/A')
            reason.readOnly=true



            let resolved = document.createElement('button')
            resolved.innerText = "Resolved"
            resolved.addEventListener("click",function(){
                firebase.database().ref(ResolvedRef).child(newReportBoxElement.id).set({
                    communityOrClassName: report.email,
                    discordLink: report.discordLink,
                    email: report.email,
                    fullname: report.fullname,
                    reason: report.reason,
                    time: report.time
                })
                firebase.database().ref(refCommunity).child(newReportBoxElement.id).remove();
            });

            newReportBoxElement.appendChild(time)
            newReportBoxElement.appendChild(communityOrClassName)
            newReportBoxElement.appendChild(discordLink)
            newReportBoxElement.appendChild(email)
            newReportBoxElement.appendChild(fullname)
            newReportBoxElement.appendChild(reason)
            newReportBoxElement.appendChild(resolved)

            reportCommunityArr.push(report);
            if(reportCommunityElement != null) {
                reportCommunityElement.append(newReportBoxElement)
            }


        });
    });

    console.log("reportCommunityArr:! ", reportCommunityArr);
}
function retrieveResolvedCommunity() {
    console.log("retrieveResolvedCommunity() called :)");
    var ref=firebase.database().ref("Report/ResolvedCommunity");
    var UnresolvedRef = firebase.database().ref("Report/Community");
    let resolvedCommunityElement = document.querySelector('#resolvedCommunity')


    ref.on("value", function(snapshot) {
        if(resolvedCommunityElement != null){
            while(resolvedCommunityElement.hasChildNodes()){
                resolvedCommunityElement.removeChild(resolvedCommunityElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No report submitted in this section at this time.";
        if(!snapshot.hasChildren()){
            resolvedCommunityElement.append(emptyMessage);
        }
        snapshot.forEach(function(childSnapshot) {
            var report = childSnapshot.val();

            let newReportBoxElement = document.createElement('div')
            newReportBoxElement.setAttribute("id", childSnapshot.key);
            newReportBoxElement.style.border = "gainsboro"
            newReportBoxElement.style.marginBottom = "10px"

            //Time
            let time = document.createElement('textarea')
            time.innerText = report.time || 'N/A'
            time.rows =1
            time.readOnly=true

            // Community Name
            let communityOrClassName = document.createElement('textarea')
            communityOrClassName.innerText = report.communityOrClassName || 'N/A'
            communityOrClassName.rows =1
            communityOrClassName.readOnly=true

            // Discord Link
            let discordLink = document.createElement('textarea')
            discordLink.innerText = report.discordLink || 'N/A'
            discordLink.rows =1
            discordLink.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = report.email || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = report.fullname || 'N/A'
            fullname.rows =1
            fullname.readOnly=true

            // Reason
            let reason = document.createElement('textarea')
            reason.innerHTML ="Reason: \n\t"+(report.reason || 'N/A')
            reason.readOnly=true

            let unresolved = document.createElement('button')
            unresolved.innerText = "Unresolved"
            unresolved.addEventListener("click",function(){
                UnresolvedRef.child(newReportBoxElement.id).set({
                    email: report.email,
                    communityOrClassName: report.communityOrClassName,
                    discordLink: report.discordLink,
                    fullname: report.fullname,
                    reason: report.reason,
                    time: report.time
                })
                ref.child(newReportBoxElement.id).remove();
            });

            let remove = document.createElement('button')
            remove.innerText = "Remove"
            remove.addEventListener("click",function(){
                ref.child(newReportBoxElement.id).remove();
            });
            newReportBoxElement.appendChild(time)
            newReportBoxElement.appendChild(communityOrClassName)
            newReportBoxElement.appendChild(discordLink)
            newReportBoxElement.appendChild(email)
            newReportBoxElement.appendChild(fullname)
            newReportBoxElement.appendChild(reason)
            newReportBoxElement.appendChild(unresolved)
            newReportBoxElement.appendChild(remove)

            if(resolvedCommunityElement != null){
                resolvedCommunityElement.append(newReportBoxElement)
            }

            resolvedCommunityArr.push(report);
        });
    });
    console.log("resolvedCommunityArr:! ", resolvedCommunityArr);
}

function retrieveReportClass() {
    console.log("retrieveReportClass() called :)");
    var ResolvedRef=firebase.database().ref("Report/ResolvedClass");
    var ref = firebase.database().ref("Report/Class");
    let reportClassElement = document.querySelector('#reportClass')


    ref.on("value", function(snapshot) {
        if(reportClassElement != null){
            while(reportClassElement.hasChildNodes()){
                reportClassElement.removeChild(reportClassElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No report submitted in this section at this time.";
        if(!snapshot.hasChildren()){
            reportClassElement.append(emptyMessage);
        }
        snapshot.forEach(function(childSnapshot) {
            var report = childSnapshot.val();

            let newReportBoxElement = document.createElement('div')
            newReportBoxElement.setAttribute("id", childSnapshot.key);
            newReportBoxElement.style.border = "gainsboro"
            newReportBoxElement.style.marginBottom = "10px"

            //Time
            let time = document.createElement('textarea')
            time.innerText = report.time || 'N/A'
            time.rows =1
            time.readOnly=true

            // Class Name
            let communityOrClassName = document.createElement('textarea')
            communityOrClassName.innerText = report.communityOrClassName || 'N/A'
            communityOrClassName.rows =1
            communityOrClassName.readOnly=true

            // Discord Link
            let discordLink = document.createElement('textarea')
            discordLink.innerText = report.discordLink || 'N/A'
            discordLink.rows =1
            discordLink.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = report.email || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = report.fullname || 'N/A'
            fullname.rows =1
            fullname.readOnly=true



            // Reason
            let reason = document.createElement('textarea')
            reason.innerHTML ="Reason: \n\t"+(report.reason || 'N/A')
            reason.readOnly=true

            let resolved = document.createElement('button')
            resolved.innerText = "Resolved"
            resolved.addEventListener("click",function(){
                ResolvedRef.child(newReportBoxElement.id).set({
                    communityOrClassName: report.email,
                    discordLink: report.discordLink,
                    email: report.email,
                    fullname: report.fullname,
                    reason: report.reason,
                    time: report.time
                })
                ref.child(newReportBoxElement.id).remove();
            });
            newReportBoxElement.appendChild(time)
            newReportBoxElement.appendChild(communityOrClassName)
            newReportBoxElement.appendChild(discordLink)
            newReportBoxElement.appendChild(email)
            newReportBoxElement.appendChild(fullname)
            newReportBoxElement.appendChild(reason)
            newReportBoxElement.appendChild(resolved)

            if(reportClassElement != null) {
                reportClassElement.append(newReportBoxElement)
            }

            reportClassArr.push(report);
        });
    });
    console.log("reportClassArr:! ", reportClassArr);
}


function retrieveResolvedClass() {
    console.log("retrieveResolvedClass() called :)");
    var ref=firebase.database().ref("Report/ResolvedClass");
    var UnresolvedRef = firebase.database().ref("Report/Class");
    let resolvedClassElement = document.querySelector('#resolvedClass')


    ref.on("value", function(snapshot) {
        if(resolvedClassElement != null){
            while(resolvedClassElement.hasChildNodes()){
                resolvedClassElement.removeChild(resolvedClassElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No report submitted in this section at this time.";
        if(!snapshot.hasChildren()){
            resolvedClassElement.append(emptyMessage);
        }
        snapshot.forEach(function(childSnapshot) {
            var report = childSnapshot.val();


            let newReportBoxElement = document.createElement('div')
            newReportBoxElement.setAttribute("id", childSnapshot.key);
            newReportBoxElement.style.border = "gainsboro"
            newReportBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = report.time || 'N/A'
            time.rows =1
            time.readOnly=true

            // Class Name
            let communityOrClassName = document.createElement('textarea')
            communityOrClassName.innerText = report.communityOrClassName || 'N/A'
            communityOrClassName.rows =1
            communityOrClassName.readOnly=true

            // Discord Link
            let discordLink = document.createElement('textarea')
            discordLink.innerText = report.discordLink || 'N/A'
            discordLink.rows =1
            discordLink.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = report.email || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = report.fullname || 'N/A'
            fullname.rows =1
            fullname.readOnly=true

            // Reason
            let reason = document.createElement('textarea')
            reason.innerHTML ="Reason: \n\t"+(report.reason || 'N/A')
            reason.readOnly=true

            let unresolved = document.createElement('button')
            unresolved.innerText = "Unresolved"
            unresolved.addEventListener("click",function(){
                UnresolvedRef.child(newReportBoxElement.id).set({
                    communityOrClassName: report.communityOrClassName,
                    discordLink: report.discordLink,
                    email: report.email,
                    fullname: report.fullname,
                    reason: report.reason,
                    time: report.time
                })
                ref.child(newReportBoxElement.id).remove();
            });

            let remove = document.createElement('button')
            remove.innerText = "Remove"
            remove.addEventListener("click",function(){
                ref.child(newReportBoxElement.id).remove();
            });
            newReportBoxElement.appendChild(time)
            newReportBoxElement.appendChild(communityOrClassName)
            newReportBoxElement.appendChild(discordLink)
            newReportBoxElement.appendChild(email)
            newReportBoxElement.appendChild(fullname)
            newReportBoxElement.appendChild(reason)
            newReportBoxElement.appendChild(unresolved)
            newReportBoxElement.appendChild(remove)

            if(resolvedClassElement != null){
                resolvedClassElement.append(newReportBoxElement)
            }

            resolvedClassArr.push(report);
        });
    });
    console.log("resolvedClassArr:! ", resolvedClassArr);
}

function reportCommunitySelected(){
    console.log("reportCommunitySelected() called");
    document.getElementById("reportClass").style.display = "none";
    document.getElementById("reportCommunity").style.display = "block";
    document.getElementById("resolvedClass").style.display = "none";
    document.getElementById("resolvedCommunity").style.display = "none";
}

function reportClassSelected(){
    console.log("reportClassSelected() called");
    document.getElementById("reportClass").style.display = "block";;
    document.getElementById("reportCommunity").style.display = "none";
    document.getElementById("resolvedClass").style.display = "none";
    document.getElementById("resolvedCommunity").style.display = "none";

}

function resolvedCommunitySelected(){
    console.log("ResolvedCommunitySelected() called");
    document.getElementById("reportClass").style.display = "none";
    document.getElementById("reportCommunity").style.display = "none";
    document.getElementById("resolvedClass").style.display = "none";
    document.getElementById("resolvedCommunity").style.display = "block";
}

function resolvedClassSelected(){
    console.log("ResolvedClassSelected() called");
    document.getElementById("reportClass").style.display = "none";
    document.getElementById("reportCommunity").style.display = "none";
    document.getElementById("resolvedClass").style.display = "block";
    document.getElementById("resolvedCommunity").style.display = "none";

}

reportCommunityArr = []
reportClassArr = []
resolvedCommunityArr = []
resolvedClassArr = []

retrieveReportCommunity()
retrieveReportClass()
retrieveResolvedClass()
retrieveResolvedCommunity()
