firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //do nothing
    } else {
      window.location.href = "index.html";
    }
});