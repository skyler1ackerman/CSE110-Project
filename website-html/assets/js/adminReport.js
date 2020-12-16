const getReportSnapshot=(path)=>{
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://18.237.22.223:8000/getReportSnapshot?path=' + path, config)
        .then(response => response.json())
        .catch(error => console.log(error));
}

const moveReport =(from,to,id,time,communityOrClassName,discordLink,email,fullname,reason)=>{
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from,
            to,
            id,
            time,
            communityOrClassName,
            discordLink,
            email,
            fullname,
            reason
        })
    };
    fetch('http://18.237.22.223:8000/moveReport',config)
        .catch(error => console.log(error));

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
    fetch('http://18.237.22.223:8000/removeData',config)
        .catch(error => console.log(error));

}

function retrieveReportCommunity() {
    let reportCommunityElement = document.querySelector('#reportCommunity');
    var ResolvedRef="Report/ResolvedCommunity";
    var refCommunity = "Report/Community";
    var reportSnapshot;
    getReportSnapshot(refCommunity).then(snapshot=>{
        reportSnapshot=snapshot;
        if(reportCommunityElement != null){
            while(reportCommunityElement.hasChildNodes()){
                reportCommunityElement.removeChild(reportCommunityElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No report submitted in this section at this time.";
        if(Object.keys(reportSnapshot).length==0){
            reportCommunityElement.append(emptyMessage);
        }
        for(var key in reportSnapshot){
            var id =key;
            var report = reportSnapshot[key];
            let newReportBoxElement = document.createElement('div')
            newReportBoxElement.setAttribute("id", id);
            newReportBoxElement.style.border = "gainsboro"
            newReportBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = report["time"] || 'N/A'
            time.rows =1
            time.readOnly=true

            // Community Name
            let communityOrClassName = document.createElement('textarea')
            communityOrClassName.innerText = report["communityOrClassName"] || 'N/A'
            communityOrClassName.rows =1
            communityOrClassName.readOnly=true

            // Discord Link
            let discordLink = document.createElement('textarea')
            discordLink.innerText = report["discordLink"] || 'N/A'
            discordLink.rows =1
            discordLink.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = report["email"] || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = report["fullname"] || 'N/A'
            fullname.rows = 1
            fullname.readOnly = true

            // Reason
            let reason = document.createElement('textarea')
            reason.innerHTML ="Reason: \n\t"+(report["reason"] || 'N/A')
            reason.readOnly=true

            let resolved = document.createElement('button')
            resolved.innerText = "Resolved"
            resolved.addEventListener("click",function(report){
                moveReport(refCommunity,ResolvedRef,newReportBoxElement.id,report["time"],
                    report["communityOrClassName"],report["discordLink"],report["email"],report["fullname"],report["reason"]);
                retrieveReportCommunity();
            }.bind(resolved,report));

            newReportBoxElement.appendChild(time)
            newReportBoxElement.appendChild(communityOrClassName)
            newReportBoxElement.appendChild(discordLink)
            newReportBoxElement.appendChild(email)
            newReportBoxElement.appendChild(fullname)
            newReportBoxElement.appendChild(reason)
            newReportBoxElement.appendChild(resolved)

            if(reportCommunityElement != null) {
                reportCommunityElement.append(newReportBoxElement)
            }
        };
    });
}

function retrieveResolvedCommunity() {
    var ref="Report/ResolvedCommunity";
    var UnresolvedRef = "Report/Community";
    let resolvedCommunityElement = document.querySelector('#resolvedCommunity')

    var reportSnapshot;
    getReportSnapshot(ref).then(snapshot=>{
        reportSnapshot=snapshot;
        if(resolvedCommunityElement != null){
            while(resolvedCommunityElement.hasChildNodes()){
                resolvedCommunityElement.removeChild(resolvedCommunityElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No report submitted in this section at this time.";
        if(Object.keys(reportSnapshot).length==0){
            resolvedCommunityElement.append(emptyMessage);
        }
        for(var key in reportSnapshot){
            var id =key;
            var report = reportSnapshot[key];
            let newReportBoxElement = document.createElement('div')
            newReportBoxElement.setAttribute("id", id);
            newReportBoxElement.style.border = "gainsboro"
            newReportBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = report["time"] || 'N/A'
            time.rows =1
            time.readOnly=true

            // Community Name
            let communityOrClassName = document.createElement('textarea')
            communityOrClassName.innerText = report["communityOrClassName"] || 'N/A'
            communityOrClassName.rows =1
            communityOrClassName.readOnly=true

            // Discord Link
            let discordLink = document.createElement('textarea')
            discordLink.innerText = report["discordLink"] || 'N/A'
            discordLink.rows =1
            discordLink.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = report["email"] || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = report["fullname"] || 'N/A'
            fullname.rows = 1
            fullname.readOnly = true

            // Reason
            let reason = document.createElement('textarea')
            reason.innerHTML ="Reason: \n\t"+(report["reason"] || 'N/A')
            reason.readOnly=true

            let unresolved = document.createElement('button')
            unresolved.innerText = "Unresolved"
            unresolved.addEventListener("click",function(report){
                moveReport(ref,UnresolvedRef,newReportBoxElement.id,report["time"],
                    report["communityOrClassName"],report["discordLink"],report["email"],report["fullname"],report["reason"]);
                retrieveResolvedCommunity();
            }.bind(unresolved,report));

            let remove = document.createElement('button')
            remove.innerText = "Remove"
            remove.addEventListener("click",function(){
                removeData(ref,newReportBoxElement.id)
            }.bind(remove));
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

        };
    });

}

function retrieveReportClass() {
    var ResolvedRef="Report/ResolvedClass";
    var ref = "Report/Class";
    let reportClassElement = document.querySelector('#reportClass')

    var reportSnapshot;
    getReportSnapshot(ref).then(snapshot=>{
        reportSnapshot=snapshot;
        if(reportClassElement != null){
            while(reportClassElement.hasChildNodes()){
                reportClassElement.removeChild(reportClassElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No report submitted in this section at this time.";
        if(Object.keys(reportSnapshot).length==0){
            reportClassElement.append(emptyMessage);
        }
        for(var key in reportSnapshot){
            var id =key;
            var report = reportSnapshot[key];
            let newReportBoxElement = document.createElement('div')
            newReportBoxElement.setAttribute("id", id);
            newReportBoxElement.style.border = "gainsboro"
            newReportBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = report["time"] || 'N/A'
            time.rows =1
            time.readOnly=true

            // Community Name
            let communityOrClassName = document.createElement('textarea')
            communityOrClassName.innerText = report["communityOrClassName"] || 'N/A'
            communityOrClassName.rows =1
            communityOrClassName.readOnly=true

            // Discord Link
            let discordLink = document.createElement('textarea')
            discordLink.innerText = report["discordLink"] || 'N/A'
            discordLink.rows =1
            discordLink.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = report["email"] || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = report["fullname"] || 'N/A'
            fullname.rows = 1
            fullname.readOnly = true

            // Reason
            let reason = document.createElement('textarea')
            reason.innerHTML ="Reason: \n\t"+(report["reason"] || 'N/A')
            reason.readOnly=true

            let resolved = document.createElement('button')
            resolved.innerText = "Resolved"
            resolved.addEventListener("click",function(report){
                moveReport(ref,ResolvedRef,newReportBoxElement.id,report["time"],
                    report["communityOrClassName"],report["discordLink"],report["email"],report["fullname"],report["reason"]);
                retrieveReportClass();
            }.bind(resolved,report));
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
        };
    });

}

function retrieveResolvedClass() {
    var ref="Report/ResolvedClass";
    var UnresolvedRef = "Report/Class";
    let resolvedClassElement = document.querySelector('#resolvedClass')

    var reportSnapshot;
    getReportSnapshot(ref).then(snapshot=>{
        reportSnapshot=snapshot;
        if(resolvedClassElement != null){
            while(resolvedClassElement.hasChildNodes()){
                resolvedClassElement.removeChild(resolvedClassElement.lastChild);
            }
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No report submitted in this section at this time.";
        if(Object.keys(reportSnapshot).length==0){
            resolvedClassElement.append(emptyMessage);
        }
        for(var key in reportSnapshot){
            var id =key;
            var report = reportSnapshot[key];
            let newReportBoxElement = document.createElement('div')
            newReportBoxElement.setAttribute("id", id);
            newReportBoxElement.style.border = "gainsboro"
            newReportBoxElement.style.marginBottom = "10px"
            //Time
            let time = document.createElement('textarea')
            time.innerText = report["time"] || 'N/A'
            time.rows =1
            time.readOnly=true

            // Community Name
            let communityOrClassName = document.createElement('textarea')
            communityOrClassName.innerText = report["communityOrClassName"] || 'N/A'
            communityOrClassName.rows =1
            communityOrClassName.readOnly=true

            // Discord Link
            let discordLink = document.createElement('textarea')
            discordLink.innerText = report["discordLink"] || 'N/A'
            discordLink.rows =1
            discordLink.readOnly=true

            // Email
            let email = document.createElement('textarea')
            email.innerText = report["email"] || 'N/A'
            email.rows =1
            email.readOnly=true

            // Fullname
            let fullname = document.createElement('textarea')
            fullname.innerText = report["fullname"] || 'N/A'
            fullname.rows = 1
            fullname.readOnly = true

            // Reason
            let reason = document.createElement('textarea')
            reason.innerHTML ="Reason: \n\t"+(report["reason"] || 'N/A')
            reason.readOnly=true

            let unresolved = document.createElement('button')
            unresolved.innerText = "Unresolved"
            unresolved.addEventListener("click",function(report){
                moveReport(ref,UnresolvedRef,newReportBoxElement.id,report["time"],
                    report["communityOrClassName"],report["discordLink"],report["email"],report["fullname"],report["reason"]);
                retrieveResolvedClass();
            }.bind(unresolved,report));

            let remove = document.createElement('button')
            remove.innerText = "Remove"
            remove.addEventListener("click",function(){
                removeData(ref,newReportBoxElement.id)
            }.bind(remove));
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
        };
    });
}

function reportCommunitySelected(){
    retrieveReportCommunity();
    document.getElementById("reportClass").style.display = "none";
    document.getElementById("reportCommunity").style.display = "block";
    document.getElementById("resolvedClass").style.display = "none";
    document.getElementById("resolvedCommunity").style.display = "none";
}

function reportClassSelected(){
    retrieveReportClass();
    document.getElementById("reportClass").style.display = "block";;
    document.getElementById("reportCommunity").style.display = "none";
    document.getElementById("resolvedClass").style.display = "none";
    document.getElementById("resolvedCommunity").style.display = "none";

}

function resolvedCommunitySelected(){
    retrieveResolvedCommunity();
    document.getElementById("reportClass").style.display = "none";
    document.getElementById("reportCommunity").style.display = "none";
    document.getElementById("resolvedClass").style.display = "none";
    document.getElementById("resolvedCommunity").style.display = "block";
}

function resolvedClassSelected(){
    retrieveResolvedClass();
    document.getElementById("reportClass").style.display = "none";
    document.getElementById("reportCommunity").style.display = "none";
    document.getElementById("resolvedClass").style.display = "block";
    document.getElementById("resolvedCommunity").style.display = "none";

}

retrieveReportCommunity()

