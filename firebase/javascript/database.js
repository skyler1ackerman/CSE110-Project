

function controlDB(num) {
  console.log("controlDB() called :)"); 
  firebase.initializeApp(firebaseConfig);
  // var num = 9;

  // var discordInfo2 = JSON.parse('{"profName": "gary2","quarter": "fall","year": "2020","inviteURL": "www.com"}');
  
  firebase.database().ref('TestChangeClasses/').child("AAS10/").child("discordInfo" + num.toString() + "/").update({
    "profName": "gary2","quarter": "fall","year": "2020","inviteURL": "www.com"
  });
}

function dbFunction(arr) {
    console.log("dbFunction called :)"); 
    firebase.initializeApp(firebaseConfig);
    populateClasses(arr);
    // writeClasses('CSE110', 'Gary', 'Fall', '2020', 'test.com');
    // writeClasses('CSE110', 'Gery', 'Fall', '2020', 'test2.com');
    // writeClasses('CSE111', 'Gory', 'Fall', '2020', 'test.com');
    // writeClasses('CSE112', 'Giry', 'Fall', '2020', 'test.com');
  }

function populateClasses(arr) {
  for(i = 0; i < arr.length; i++) {
    writeClasses(arr[i], 'A', 'B', 'C', 'D')
  }
}
function writeClasses(name, profname, qtr, yr, link) {

  firebase.database().ref('classes/').child(name).set({
    discordInfo1: {
      profName: profname,
      quarter: qtr,
      year: yr,
      inviteURL: link,
    }
  });
  
}


function removeWhiteSpace(strwithspace){
    return strwithspace.replace(/\\|\/|\ |\.|\#|\$|\[|\]|\"|\(|\)/g,'');

}