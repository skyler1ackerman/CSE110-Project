var classListArr = [];

//retrive class data and all info inside
function getSnapshot(num) {
    console.log("getSnapshot() called :)"); 
    firebase.initializeApp(firebaseConfig);
    var ref = firebase.database().ref("classes");

    ref.on("value", function(snapshot) {
     snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val(); // this is object
      var childKey = childSnapshot.key; //class name
      var childchildval = childSnapshot.child("discordInfo1/inviteURL").val(); //discord info
      console.log(childKey);
      console.log(childchildval);
     });
    });
}

function getSnapshot2(){
    console.log("getSnapshot2() called :)"); 
    firebase.initializeApp(firebaseConfig);
    var ref = firebase.database().ref("TestChangeClasses");
    ref.once("value", function(snapshot) {
      snapshot.forEach(function(child) {
        // console.log(child);
        console.log(child.key+": "+child.val());
        classListArr.push(child.key);
      });
    });
    console.log(classListArr);
}

