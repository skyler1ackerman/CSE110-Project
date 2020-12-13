function goToContactUs(){
    window.location.href = "contactUs.html";
}

function goToAboutUs(){
    window.location.href = "aboutUs.html";
}

const getAdminUser = () => {
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getAdminUser', config)
    .then(response => response.json())
    .catch(error => console.log(error));
}

function ifAdminDashboard() {
    // kaiwen's jquery thing to make a new button on page for admin, change if wanted
    getAdminUser().then(snapshot => {
        Object.keys(snapshot).forEach(function (admin_email) {
            if(localStorage.getItem("user-email")==snapshot[admin_email].email){
                document.getElementById("directAdmin").style.display = "inline-block";
            }
        });
    });
}


function goToAdminDashboard(){
    window.location.href = "admin-dashboard.html";
}

ifAdminDashboard();