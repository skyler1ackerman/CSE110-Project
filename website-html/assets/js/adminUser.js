function getAdminEmail(){
    console.log("getAdminEmail() called!");
    var adRef="AdminUser/";
    firebase.database().ref(adRef).push().set({
        email:document.getElementById("Admin_Email").value
    });
    firebase.database().ref(adRef).once("child_added").then(function (){
        document.getElementById("Admin_Email").value='';
        console.log("Output clear")
    });
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




            let removed = document.createElement('button')
            removed.innerText = "Removed"
            removed.addEventListener("click",function(){
                ref.child(adminRowElement.id).remove();
            });
            adminRowElement.appendChild(email)
            adminRowElement.appendChild(IsAdmin)
            adminRowElement.appendChild(removed)

            if(AdminUserElement != null){
                AdminUserElement.append(adminRowElement)
            }

        });
    });
    console.log("admin appended");
}
retrieveAdminUser();