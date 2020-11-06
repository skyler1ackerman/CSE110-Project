 function testFunction() {
    console.log("test called :)");
    const email = "yoryu@ucsd.edu"
    console.log(email.substr(email.length - 9)); //Outputs: Tabs1    
}
 function signInFunction() {
    //doc: https://firebase.google.com/docs/auth/web/google-signin#before_you_begin
    console.log("signInFunction called :)");
    //initialize firebase app only if there isn't any...
    if (!firebase.apps.length) {
        console.log("firebase app initlized!");
        firebase.initializeApp(firebaseConfig);
    }
    
    var provider = new firebase.auth.GoogleAuthProvider();
    //without this, google auth keeps logging in automatically without account selection option
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user);
      console.log(user.email);
      //check if the email ends with @ucsd.edu
      console.log(user.email.substr(user.email.length - 9));
      if(user.email.substr(user.email.length - 9) != "@ucsd.edu"){
        console.log("Not a UCSD email!");
        //if not ucsd email, sign out
        firebase.auth().signOut().then(function() {
          console.log("signout successful!");   
          alert("Access granted only to UCSD students.\n Login with @ucsd.edu email.");
        }).catch(function(error) {
          console.log("signout error!");
        });
      } // => "Tabs1")
      else{
        console.log("signin successful!");
        window.location.href = "afterlogin.html";
      }
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
}
 function signOutFunction() {
    console.log("signOutFunction called :)");
    var answer = window.confirm("Do you want to logout?");
    if (answer) {
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("signout successful");
      }).catch(function(error) {
        // An error happened.
        console.log("signout error!");
      });
    }
    else {
       console.log("user does not want to logout")
    }
   
   
 }
