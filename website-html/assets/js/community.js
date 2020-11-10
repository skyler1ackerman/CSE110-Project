function getCommunityByName(name){
    console.log("getCommunityByName() called :)");
    if (!firebase.apps.length) {
      console.log("firebase app initlized!");
      firebase.initializeApp(firebaseConfig);
    }
    var ref = firebase.database().ref("clubs").child(name);

    let communityObj = null
    ref.on('value', function(snapshot) {
        console.log(snapshot.val());
        communityObj = snapshot.val()
    });

    return communityObj
}
