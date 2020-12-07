
function retrieveCommunitiesRequests() {

    let discordRequestsElement = document.querySelector('#communitiesRequests')
    var discordRequestsRef = firebase.database().ref("DiscordServerRequests/Communities");
    discordRequestsRef.on("value", function(snapshot) {
        while(discordRequestsElement.hasChildNodes()){
            discordRequestsElement.removeChild(discordRequestsElement.lastChild);
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No disocrd request submitted in this section at this time.";
        if(!snapshot.hasChildren()){
            discordRequestsElement.append(emptyMessage);
        }
        snapshot.forEach(function(childSnapshot) {
            var discordRequest = childSnapshot.val();
            let newDiscordRequestBoxElement = document.createElement('div')
            newDiscordRequestBoxElement.setAttribute("id", childSnapshot.key);
            //newFeedbackBoxElement.style.border = "solid gainsboro"
            newDiscordRequestBoxElement.style.marginBottom = "5vh"

            // Time
            let time = document.createElement('textarea')
            time.innerText = discordRequest.time || 'N/A'
            time.rows =1
            time.readOnly=true
            time.style.textAlign = "center"

            // name
            let name = document.createElement('textarea')
            name.innerText = discordRequest.name || 'N/A'
            name.rows =1
            name.readOnly=true
            name.style.textAlign = "center"
            
            // Email
            let contact = document.createElement('textarea')
            contact.innerText = discordRequest.contact || 'N/A'
            contact.rows =1
            contact.readOnly=true
            contact.style.textAlign = "center"
            
            // Invite URL
            let inviteLink = document.createElement('textarea')
            inviteLink.innerText = discordRequest.inviteLink || 'N/A'
            inviteLink.rows =1
            inviteLink.readOnly=true
            inviteLink.style.textAlign = "center"
            // org_type
            let org_type = document.createElement('textarea')
            org_type.innerText = discordRequest.org_type || 'N/A'
            org_type.rows =1
            org_type.readOnly=true
            org_type.style.textAlign = "center"

            // category
            let category = document.createElement('textarea')
            category.innerText = discordRequest.category || 'N/A'
            category.rows =1
            category.readOnly=true
            category.style.textAlign = "center"
            // social_media
            let social_media = document.createElement('textarea')
            social_media.innerText = discordRequest.social_media || 'N/A'
            social_media.rows =1
            social_media.readOnly=true
            social_media.style.textAlign = "center"

            // description
            let description = document.createElement('textarea')
            description.innerText = discordRequest.description || 'N/A'
            description.rows =1
            description.readOnly=true
            description.style.textAlign = "center"



            let acceptBtn = document.createElement('button')
            acceptBtn.innerText = "Accept"
            acceptBtn.addEventListener("click",function(){
                addCommunitiesInfotoDBFromAdminPage(discordRequest.contact, discordRequest.name, discordRequest.inviteLink, discordRequest.org_type, discordRequest.category, discordRequest.social_media, discordRequest.description)
                discordRequestsRef.child(newDiscordRequestBoxElement.id).remove();
            });

            let rejectBtn = document.createElement('button')
            rejectBtn.innerText = "Reject"
            rejectBtn.addEventListener("click",function(){
                discordRequestsRef.child(newDiscordRequestBoxElement.id).remove();
            });


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
            CommunitiesRequestArr.push(discordRequest);
            discordRequestsElement.append(newDiscordRequestBoxElement)
        });
    });

    console.log("discordRequestArr:! ", CommunitiesRequestArr);
}
function retrieveDiscordRequests() {
    console.log("retrieveDiscordRequests() called :)");

    let discordRequestsElement = document.querySelector('#discordRequests')
    var discordRequestsRef = firebase.database().ref("DiscordServerRequests/Classes");
    discordRequestsRef.on("value", function(snapshot) {
        while(discordRequestsElement.hasChildNodes()){
            discordRequestsElement.removeChild(discordRequestsElement.lastChild);
        }
        let emptyMessage = document.createElement("p");
        emptyMessage.innerHTML = "No disocrd request submitted in this section at this time.";
        if(!snapshot.hasChildren()){
            discordRequestsElement.append(emptyMessage);
        }
        snapshot.forEach(function(childSnapshot) {
            var discordRequest = childSnapshot.val();
            let newDiscordRequestBoxElement = document.createElement('div')
            newDiscordRequestBoxElement.setAttribute("id", childSnapshot.key);
            //newFeedbackBoxElement.style.border = "solid gainsboro"
            newDiscordRequestBoxElement.style.marginBottom = "5vh"

            // Time
            let time = document.createElement('textarea')
            time.innerText = discordRequest.time || 'N/A'
            time.rows =1
            time.readOnly=true
            time.style.textAlign = "center"


            // Email
            let email = document.createElement('textarea')
            email.innerText = discordRequest.email || 'N/A'
            email.rows =1
            email.readOnly=true
            email.style.textAlign = "center"

            // Classname
            let className = document.createElement('textarea')
            className.innerText = discordRequest.className || 'N/A'
            className.rows =1
            className.readOnly=true
            className.style.textAlign = "center"

            // Invite URL
            let inviteURL = document.createElement('textarea')
            inviteURL.innerText = discordRequest.inviteURL || 'N/A'
            inviteURL.rows =1
            inviteURL.readOnly=true
            inviteURL.style.textAlign = "center"
            // Prof Name
            let profName = document.createElement('textarea')
            profName.innerText = discordRequest.profName || 'N/A'
            profName.rows =1
            profName.readOnly=true
            profName.style.textAlign = "center"

            // Quarter
            let quarter = document.createElement('textarea')
            quarter.innerText = discordRequest.quarter || 'N/A'
            quarter.rows =1
            quarter.readOnly=true
            quarter.style.textAlign = "center"
            // Year
            let year = document.createElement('textarea')
            year.innerText = discordRequest.year || 'N/A'
            year.rows =1
            year.readOnly=true
            year.style.textAlign = "center"

            let acceptBtn = document.createElement('button')
            acceptBtn.innerText = "Accept"
            acceptBtn.addEventListener("click",function(){
                addDiscordInfotoDBFromAdminPage(discordRequest.className, discordRequest.inviteURL, discordRequest.profName, discordRequest.quarter, discordRequest.year)
                discordRequestsRef.child(newDiscordRequestBoxElement.id).remove();
            });

            let rejectBtn = document.createElement('button')
            rejectBtn.innerText = "Reject"
            rejectBtn.addEventListener("click",function(){
                discordRequestsRef.child(newDiscordRequestBoxElement.id).remove();
            });


            newDiscordRequestBoxElement.appendChild(time)
            newDiscordRequestBoxElement.appendChild(email)
            newDiscordRequestBoxElement.appendChild(className)
            newDiscordRequestBoxElement.appendChild(inviteURL)
            newDiscordRequestBoxElement.appendChild(profName)
            newDiscordRequestBoxElement.appendChild(quarter)
            newDiscordRequestBoxElement.appendChild(year)
            newDiscordRequestBoxElement.appendChild(acceptBtn)
            newDiscordRequestBoxElement.appendChild(rejectBtn)
            discordRequestArr.push(discordRequest);
            discordRequestsElement.append(newDiscordRequestBoxElement)
        });
    });

    console.log("discordRequestArr:! ", discordRequestArr);
}

function addDiscordInfotoDBFromAdminPage(className, inviteURL, profName, quarter, year){
    console.log("addDiscordInfotoDBFromAdminPage() called!");
    //First, count number of children in the class
    var classRef = "classes/".concat(className);
    console.log("Finding class ->", className);

    firebase.database().ref(classRef).push().set({
        inviteURL: inviteURL,
        profName: profName,
        quarter : quarter,
        year: year,
    });

}
function addCommunitiesInfotoDBFromAdminPage(contact, name, inviteLink, org_type, category, social_media, description){
    //First, count number of children in the class
    var Ref = "clubs/"+category;
    var childRef = name;

    firebase.database().ref(Ref).child(name).set({
        contact: contact,
        description: description,
        inviteLink: inviteLink,
        org_type: org_type,
        social_media: social_media,
        status: "Current"
    });


}

function classRequests(){
    document.getElementById("communitiesRequests").style.display = "none";
    document.getElementById("discordRequests").style.display = "block";

}
function communitiesRequests(){
    document.getElementById("communitiesRequests").style.display = "block";
    document.getElementById("discordRequests").style.display = "none";
}

discordRequestArr = []
CommunitiesRequestArr=[]
retrieveDiscordRequests()
retrieveCommunitiesRequests()
