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
    console.log(arr);
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

function clubsInfo(clubfile){
  var clubInfo = clubfile;
  
  console.log("clubsInfo() called :)");
  firebase.initializeApp(firebaseConfig);
  // console.log(clubInfo);

  // Converting JSON-encoded string to JS object
  var obj = JSON.parse(clubInfo);

  // var keys = Object.keys(obj);

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var i = 0;
      var arr = ["none", "none", "none", "none" ,"none" ,"none", "none"];
      for (var inside_key in obj[key]) {
        if (obj[key].hasOwnProperty(inside_key)) {
          arr[i] = obj[key][inside_key];
        }
        // else{
        //   arr[i] = " - ";
        // }
        i++;
      }
      writeClubs(key, arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
      console.log(key);
      console.log(arr);
    }
  }

  // writeClubs(obj, obj[0], obj[1], obj[2], obj[3], obj[4], obj[5], obj[6])
  // console.log(keys);

}

function removeErrorChar(removechar){
  return removechar.replace(/\.|\#|\$|\[|\]/g,'');
}

function writeClubs(clubname, year, purpose, created, status, org_type, org_email, soc_media){
  clubname = removeErrorChar(clubname);
  console.log("writeClubs() called :)"); 

  firebase.database().ref('clubs/').child(clubname).update({
    "Academic Year": year, 
    "Purpose": purpose, 
    "Created": created, 
    "Status": status, 
    "Organization Type": org_type, 
    "Organization Email": org_email, 
    "Social Media": soc_media
  });
}

// Example entry:

// "Society of Hispanic Professional Engineers ": {
//   "Academic Year": "2020",
//   "Purpose": "The purpose of SHPE UCSD is to promote the advancement of Hispanics in math, science, engineering and other\rtechnical fields through our student chapter benefits; including but not limited to Professional Development, Academic\rDevelopment, and Community Service. SHPE at UCSD is a non-profit student organization.",
//   "Created": "8/25/2020",
//   "Status": "Current",
//   "Organization Type": "Undergraduate",
//   "Organization Email": "shpe@eng.ucsd.edu",
//   "Social Media": "shpeucsd.org"
// },