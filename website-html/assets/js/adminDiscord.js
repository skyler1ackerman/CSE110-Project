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
            newDiscordRequestBoxElement.style.border = "solid #FFFFFF"
            newDiscordRequestBoxElement.style.marginBottom = "10px"

            // Time
            let timeLabel = document.createElement('label')
            timeLabel.innerText = "time created"

            let time = document.createElement('span')
            time.innerText = discordRequest.time || 'N/A'

            // Email
            let emailLabel = document.createElement('label')
            emailLabel.innerText = "email"

            let email = document.createElement('span')
            email.innerText = discordRequest.email || 'N/A'

            // Classname
            let classNameLabel = document.createElement('label')
            classNameLabel.innerText = "className"

            let className = document.createElement('span')
            className.innerText = discordRequest.className || 'N/A'

            // Invite URL
            let inviteURLLabel = document.createElement('label')
            inviteURLLabel.innerText = "Invite URL"

            let inviteURL = document.createElement('span')
            inviteURL.innerText = discordRequest.inviteURL || 'N/A'

            // Prof Name
            let profNameLabel = document.createElement('label')
            profNameLabel.innerText = "Proffessor Name"

            let profName = document.createElement('span')
            profName.innerText = discordRequest.profName || 'N/A'

            // Quarter
            let quarterLabel = document.createElement('label')
            quarterLabel.innerText = "Quarter"

            let quarter = document.createElement('span')
            quarter.innerText = discordRequest.quarter || 'N/A'

            // Year
            let yearLabel = document.createElement('label')
            yearLabel.innerText = "Year"

            let year = document.createElement('span')
            year.innerText = discordRequest.year || 'N/A'

            let new_Line = document.createElement('br')
            let acceptBtn = document.createElement('button')
            acceptBtn.innerText = "Accept"
            acceptBtn.addEventListener("click",function(){
                addDiscordInfotoDBFromAdminPage(discordRequest.className, discordRequest.inviteURL, discordRequest.profName, discordRequest.quarter, discordRequest.year)
                discordRequestsRef.child(newDiscordRequestBoxElement.id).remove();
            });

            newDiscordRequestBoxElement.appendChild(timeLabel)
            newDiscordRequestBoxElement.appendChild(time)
            newDiscordRequestBoxElement.appendChild(emailLabel)
            newDiscordRequestBoxElement.appendChild(email)
            newDiscordRequestBoxElement.appendChild(classNameLabel)
            newDiscordRequestBoxElement.appendChild(className)
            newDiscordRequestBoxElement.appendChild(inviteURLLabel)
            newDiscordRequestBoxElement.appendChild(inviteURL)
            newDiscordRequestBoxElement.appendChild(profNameLabel)
            newDiscordRequestBoxElement.appendChild(profName)
            newDiscordRequestBoxElement.appendChild(quarterLabel)
            newDiscordRequestBoxElement.appendChild(quarter)
            newDiscordRequestBoxElement.appendChild(yearLabel)
            newDiscordRequestBoxElement.appendChild(year)
            newDiscordRequestBoxElement.appendChild(new_Line)
            newDiscordRequestBoxElement.appendChild(acceptBtn)

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
    var counter = 1;
    class_ref.on("value", function(snapshot) {
     snapshot.forEach(function(snapshot) {
      counter++;
     });
    });

    //now add a discordinfo inside class DB
    var discordRef = "classes/" + className + "/discordInfo" + counter;
    console.log(discordRef);
    var discord_ref = firebase.database().ref(discordRef);
    discord_ref.set({
      inviteURL: inviteURL,
      profName: profName,
      quarter : quarter,
      year: year,
    });
  }

discordRequestArr = []
retrieveDiscordRequests()
