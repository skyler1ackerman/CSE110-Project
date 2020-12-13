
firebase.auth().onAuthStateChanged(function(user) {
    var isAdmin=false;
    if (user) {
        firebase.database().ref("AdminUser/").once("value").then(function(snapshot){

            snapshot.forEach(function (childSnapshot){
                if(localStorage.getItem("user-email")==childSnapshot.val().email){
                    isAdmin=true;
                }
            });
            if(!isAdmin){
                window.location.href = "afterlogin.html";
            }

        });
    } else {
        window.location.href = "index.html";
    }
});