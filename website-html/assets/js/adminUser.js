const setAdminEmail = () => {
    getAdminEmail(document.getElementById("Admin_Email").value);
    document.getElementById("Admin_Email").value='';
    retrieveAdminUser()
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
const getAdminSnapshot = ()=>{
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getAdminSnapshot', config)
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
        .catch(error => console(error));

}
function retrieveAdminUser() {
    let AdminUserElement = document.querySelector('#AdminUsers')
    var adminSnapshot;

    getAdminSnapshot().then(snapshot=>{
        adminSnapshot=snapshot;
        if(AdminUserElement != null){
            while(AdminUserElement.childElementCount>1){
                AdminUserElement.removeChild(AdminUserElement.lastChild);
            }

        }
        for(var key in adminSnapshot){
            var admin = key;
            let adminRowElement=document.createElement('tr')
            adminRowElement.setAttribute("id", admin);

            // Email
            let email = document.createElement('td')
            email.innerText = adminSnapshot[admin] || 'N/A'

            // IsAdmin
            let IsAdmin = document.createElement('td')
            IsAdmin.innerText = "Administrative User" || 'N/A'

            let remove = document.createElement('button')
            remove.innerText = "Remove"
            remove.addEventListener("click",function(admin){
                removeData("AdminUser/",admin);
                retrieveAdminUser()
            }.bind(remove,admin));
            adminRowElement.appendChild(email)
            adminRowElement.appendChild(IsAdmin)
            adminRowElement.appendChild(remove)

            if(AdminUserElement != null){
                AdminUserElement.append(adminRowElement)
            }

        };
    });
}
retrieveAdminUser();
