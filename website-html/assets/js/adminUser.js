const setAdminEmail = () => {
    console.log("setAdminEmail() called!");
    getAdminEmail(document.getElementById("Admin_Email").value);
    document.getElementById("Admin_Email").value='';
}

const getAdminEmail = (mail) => {
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mail
        })
    };
    fetch('http://localhost:8000/getAdminEmail', config)
    .catch(error => console.log(error));
}

function retrieveAdminUser() {
    console.log("retrieveAdminUser called :)");
    var ref=firebase.database().ref("AdminUser/");
    let AdminUserElement = document.querySelector('#AdminUsers')
    //let newAdminBoxElement = document.createElement('div')


    // newAdminBoxElement.style.border = "gainsboro"
    // newAdminBoxElement.style.marginBottom = "10px"
    ref.on("value", function(snapshot) {
        if(AdminUserElement != null){
            while(AdminUserElement.childElementCount>1){
                AdminUserElement.removeChild(AdminUserElement.lastChild);
            }

        }
        snapshot.forEach(function(childSnapshot) {
            var admin = childSnapshot.val();
            let adminRowElement=document.createElement('tr')
            adminRowElement.setAttribute("id", childSnapshot.key);

            // Email
            let email = document.createElement('td')
            email.innerText = admin.email || 'N/A'



            // IsAdmin

            let IsAdmin = document.createElement('td')
            IsAdmin.innerText = "Administrative User" || 'N/A'




            let remove = document.createElement('button')
            remove.innerText = "Remove"
            remove.addEventListener("click",function(){
                ref.child(adminRowElement.id).remove();
            });
            adminRowElement.appendChild(email)
            adminRowElement.appendChild(IsAdmin)
            adminRowElement.appendChild(remove)

            if(AdminUserElement != null){
                AdminUserElement.append(adminRowElement)
            }

        });
    });
    console.log("admin appended");
}
retrieveAdminUser();
