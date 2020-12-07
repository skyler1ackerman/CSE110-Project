function goToContactUs(){
    window.location.href = "contactUs.html";
}

function goToAboutUs(){
    window.location.href = "aboutUs.html";
}

function ifAdminDashboard() {
    // kaiwen's jquery thing to make a new button on page for admin, change if wanted
    firebase.database().ref("AdminUser/").once("value").then(function(snapshot){
        snapshot.forEach(function (childSnapshot){
            if(localStorage.getItem("user-email")==childSnapshot.val().email){
                document.getElementById("directAdmin").style.display = "inline-block";
            }
        });
    });
}


function goToAdminDashboard(){
    window.location.href = "admin-dashboard.html";
}

ifAdminDashboard();