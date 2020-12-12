const getCommRequestSnapshot=(path)=>{
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getCommRequestSnapshot?path=' + path, config)
        .then(response => response.json())
        .catch(error => console.log(error));
}

const getClassRequestSnapshot=(path)=>{
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getClassRequestSnapshot?path=' + path, config)
        .then(response => response.json())
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
    fetch('http://localhost:8000/removeData',config)
        .catch(error => console.log(error));

}
function retrieveCommunitiesRequests() {
    var discordRequestsRef = "DiscordServerRequests/Communities";
    let discordRequestsElement = document.querySelector('#communitiesRequests')
    var discordSnapshot;
    getCommRequestSnapshot(discordRequestsRef).then(snapshot=> {
        discordSnapshot=snapshot;
        while(discordRequestsElement.hasChildNodes()){
            discordRequestsElement.removeChild(discordRequestsElement.lastChild);
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No Discord request submitted in this section at this time.";
        if(Object.keys(discordSnapshot).length==0){
            discordRequestsElement.append(emptyMessage);
        }
        for(var key in discordSnapshot){
            var id = key;
            var discordRequest = discordSnapshot[key];
            let newDiscordRequestBoxElement = document.createElement('div')
            newDiscordRequestBoxElement.setAttribute("id", id);
            //newFeedbackBoxElement.style.border = "solid gainsboro"
            newDiscordRequestBoxElement.style.marginBottom = "5vh"

            // Time
            let time = document.createElement('textarea')
            time.innerText = discordRequest["time"] || 'N/A'
            time.rows =1
            time.readOnly=true
            time.style.textAlign = "center"

            // name
            let name = document.createElement('textarea')
            name.innerText = discordRequest["name"] || 'N/A'
            name.rows =1
            name.readOnly=true
            name.style.textAlign = "center"
            
            // Email
            let contact = document.createElement('textarea')
            contact.innerText = discordRequest["contact"] || 'N/A'
            contact.rows =1
            contact.readOnly=true
            contact.style.textAlign = "center"
            
            // Invite URL
            let inviteLink = document.createElement('textarea')
            inviteLink.innerText = discordRequest["inviteLink"] || 'N/A'
            inviteLink.rows =1
            inviteLink.readOnly=true
            inviteLink.style.textAlign = "center"
            // org_type
            let org_type = document.createElement('textarea')
            org_type.innerText = discordRequest["org_type"] || 'N/A'
            org_type.rows =1
            org_type.readOnly=true
            org_type.style.textAlign = "center"

            // category
            let category = document.createElement('textarea')
            category.innerText = discordRequest["category"] || 'N/A'
            category.rows =1
            category.readOnly=true
            category.style.textAlign = "center"
            // social_media
            let social_media = document.createElement('textarea')
            social_media.innerText = discordRequest["social_media"] || 'N/A'
            social_media.rows =1
            social_media.readOnly=true
            social_media.style.textAlign = "center"

            // description
            let description = document.createElement('textarea')
            description.innerText = discordRequest["description"] || 'N/A'
            description.rows =1
            description.readOnly=true
            description.style.textAlign = "center"



            let acceptBtn = document.createElement('button')
            acceptBtn.innerText = "Accept"
            acceptBtn.addEventListener("click",function(discordRequest){
                addCommunitiesInfotoDBFromAdminPage(discordRequest.contact, discordRequest.name, discordRequest.inviteLink, discordRequest.org_type, discordRequest.category, discordRequest.social_media, discordRequest.description);
                removeData(discordRequestsRef,newDiscordRequestBoxElement.id);
                retrieveCommunitiesRequests();
            }.bind(acceptBtn,discordRequest));

            let rejectBtn = document.createElement('button')
            rejectBtn.innerText = "Reject"
            rejectBtn.addEventListener("click",function(){
                removeData(discordRequestsRef,newDiscordRequestBoxElement.id);
                retrieveCommunitiesRequests();
            }.bind(rejectBtn));


            newDiscordRequestBoxElement.appendChild(time)
            newDiscordRequestBoxElement.appendChild(contact)
            newDiscordRequestBoxElement.appendChild(name)
            newDiscordRequestBoxElement.appendChild(inviteLink)
            newDiscordRequestBoxElement.appendChild(org_type)
            newDiscordRequestBoxElement.appendChild(category)
            newDiscordRequestBoxElement.appendChild(social_media)
            newDiscordRequestBoxElement.appendChild(description)
            newDiscordRequestBoxElement.appendChild(acceptBtn)
            newDiscordRequestBoxElement.appendChild(rejectBtn)

            discordRequestsElement.append(newDiscordRequestBoxElement)
        };
    });


}
function retrieveDiscordRequests() {
    console.log("retrieveDiscordRequests() called :)");
    let discordRequestsElement = document.querySelector('#discordRequests')
    var discordRequestsRef = "DiscordServerRequests/Classes";
    getClassRequestSnapshot(discordRequestsRef).then(snapshot=> {
        discordSnapshot=snapshot;
        while(discordRequestsElement.hasChildNodes()){
            discordRequestsElement.removeChild(discordRequestsElement.lastChild);
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No Discord request submitted in this section at this time.";
        if(Object.keys(discordSnapshot).length==0){
            discordRequestsElement.append(emptyMessage);
        }
        for(var key in discordSnapshot){
            var id = key;
            var discordRequest = discordSnapshot[key];
            let newDiscordRequestBoxElement = document.createElement('div')
            newDiscordRequestBoxElement.setAttribute("id", id);
            //newFeedbackBoxElement.style.border = "solid gainsboro"
            newDiscordRequestBoxElement.style.marginBottom = "5vh"

            // Time
            let time = document.createElement('textarea')
            time.innerText = discordRequest["time"] || 'N/A'
            time.rows =1
            time.readOnly=true
            time.style.textAlign = "center"


            // Email
            let email = document.createElement('textarea')
            email.innerText = discordRequest["email"] || 'N/A'
            email.rows =1
            email.readOnly=true
            email.style.textAlign = "center"

            // Classname
            let className = document.createElement('textarea')
            className.innerText = discordRequest["className"] || 'N/A'
            className.rows =1
            className.readOnly=true
            className.style.textAlign = "center"

            // Invite URL
            let inviteURL = document.createElement('textarea')
            inviteURL.innerText = discordRequest["inviteURL"] || 'N/A'
            inviteURL.rows =1
            inviteURL.readOnly=true
            inviteURL.style.textAlign = "center"
            // Prof Name
            let profName = document.createElement('textarea')
            profName.innerText = discordRequest["profName"] || 'N/A'
            profName.rows =1
            profName.readOnly=true
            profName.style.textAlign = "center"

            // Quarter
            let quarter = document.createElement('textarea')
            quarter.innerText = discordRequest["quarter"] || 'N/A'
            quarter.rows =1
            quarter.readOnly=true
            quarter.style.textAlign = "center"
            // Year
            let year = document.createElement('textarea')
            year.innerText = discordRequest["year"] || 'N/A'
            year.rows =1
            year.readOnly=true
            year.style.textAlign = "center"

            let acceptBtn = document.createElement('button')
            acceptBtn.innerText = "Accept"
            acceptBtn.addEventListener("click",function(discordRequest){
                addDiscordInfotoDBFromAdminPage(discordRequest.className, discordRequest.inviteURL, discordRequest.profName, discordRequest.quarter, discordRequest.year)
                removeData(discordRequestsRef,newDiscordRequestBoxElement.id);
                retrieveDiscordRequests();
            }.bind(acceptBtn,discordRequest));

            let rejectBtn = document.createElement('button')
            rejectBtn.innerText = "Reject"
            rejectBtn.addEventListener("click",function(){
                removeData(discordRequestsRef,newDiscordRequestBoxElement.id);
                retrieveDiscordRequests();
            }.bind(rejectBtn));


            newDiscordRequestBoxElement.appendChild(time)
            newDiscordRequestBoxElement.appendChild(email)
            newDiscordRequestBoxElement.appendChild(className)
            newDiscordRequestBoxElement.appendChild(inviteURL)
            newDiscordRequestBoxElement.appendChild(profName)
            newDiscordRequestBoxElement.appendChild(quarter)
            newDiscordRequestBoxElement.appendChild(year)
            newDiscordRequestBoxElement.appendChild(acceptBtn)
            newDiscordRequestBoxElement.appendChild(rejectBtn)
            discordRequestsElement.append(newDiscordRequestBoxElement)
        };
    });


}



function addDiscordInfotoDBFromAdminPage (className, inviteURL, profName, quarter, year){
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            className,
            inviteURL,
            profName,
            quarter,
            year
        })
    };
    fetch('http://localhost:8000/addClass',config)
        .catch(error => console.log(error));

}



function addCommunitiesInfotoDBFromAdminPage(contact, name, inviteLink, org_type, category, social_media, description){
    //First, count number of children in the class
    let config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contact,
            name,
            inviteLink,
            org_type,
            category,
            social_media,
            description
        })
    };
    fetch('http://localhost:8000/addCommunity',config)
        .catch(error=>console.log(error))


}

function classRequests(){
    retrieveDiscordRequests()
    document.getElementById("communitiesRequests").style.display = "none";
    document.getElementById("discordRequests").style.display = "block";

}
function communitiesRequests(){
    retrieveCommunitiesRequests()
    document.getElementById("communitiesRequests").style.display = "block";
    document.getElementById("discordRequests").style.display = "none";
}


retrieveDiscordRequests()

