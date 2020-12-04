
function retrieveDiscordRequests() {
    console.log("retrieveDiscordRequests() called :)");

    let discordRequestsElement = document.querySelector('#discordRequests')
    var discordRequestsRef = firebase.database().ref("DiscordServerRequests/");
    discordRequestsRef.on("value", function(snapshot) {
        while(discordRequestsElement.hasChildNodes()){
            discordRequestsElement.removeChild(discordRequestsElement.lastChild);
        }
        snapshot.forEach(function(childSnapshot) {
            var discordRequest = childSnapshot.val();
            let newDiscordRequestBoxElement = document.createElement('div')
            newDiscordRequestBoxElement.setAttribute("id", childSnapshot.key);
            //newFeedbackBoxElement.style.border = "solid gainsboro"
            newDiscordRequestBoxElement.style.marginBottom = "10px"

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
    var class_ref = firebase.database().ref(classRef);
    class_ref.on("value", function(snapshot) {
        var discordRef = "classes/" + className + "/discordInfo" + snapshot.numChildren();
        console.log(discordRef);
        var discord_ref = firebase.database().ref(discordRef);
        discord_ref.set({
            inviteURL: inviteURL,
            profName: profName,
            quarter : quarter,
            year: year,
        });
    });

  }

discordRequestArr = []
retrieveDiscordRequests()
