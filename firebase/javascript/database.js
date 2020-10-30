
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
    writeClasses(arr[i], '', '', '', '')
  }
}
function writeClasses(name, profname, qtr, yr, link) {

  firebase.database().ref('classes/').child(name).push({
    discordInfo: {
      profName: profname,
      quarter: qtr,
      year: yr,
      inviteURL: link,
    }
  });
}


function removeWhiteSpace(strwithspace){
    return strwithspace.replace(/ /g,'');
}