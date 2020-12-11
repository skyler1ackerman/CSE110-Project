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
    writeClasses(arr[i], "", "", "", "")
  }
}
function writeClasses(name, profname, qtr, yr, link) {

  firebase.database().ref('classes/').child(name).set({
    placeholderServer: {
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
      // arr = ["category", "description", "status", "org_type" ,"contact" ,"s_media", "invite"];
      var arr = ["none", "none", "none", "none" ,"none" ,"none", "none"];
      for (var inside_key in obj[key]) {
        if (obj[key].hasOwnProperty(inside_key)) {
          arr[i] = obj[key][inside_key];
        }
        i++;
      }
      
      writeClubs(arr[0], key, arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
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
// arr = ["category", "description", "status", "org_type" ,"contact" ,"s_media", "invite"];
function writeClubs(category, clubname, description, status, org_type, contact, soc_media, invite){
  clubname = removeErrorChar(clubname);
  clubname = clubname.replace(/\//g,'-');
  console.log("writeClubs() called :)"); 

  firebase.database().ref('clubs/').child(category).child(clubname).update({
    "description": description, 
    "status": status, 
    "org_type": org_type, 
    "contact": contact, 
    "social_media": soc_media, 
    "inviteLink": invite
  });
}

// Example entry:

// "Sigma Alpha Mu Fraternity": {
//   "Category": "Fraternities",
//   "Description": "To unite each undergraduate member toward a more meaningful life, to prepare members for responsible fraternity and community involvement.",
//   "Status": "Current",
//   "Organization Type": "Undergraduate",
//   "Contact": "prior.ucsdsam@gmail.com",
//   "Social Media": "ucsdsammy",
//   "Invite": ""
// }

function majorList(majorlistfile){
  var majorList = majorlistfile;
  
  console.log("majorList() called :)");
  firebase.initializeApp(firebaseConfig);

  // Converting JSON-encoded string to JS object
  var objM = JSON.parse(majorList);

  for(var key in objM) {
    writeMajors(objM[key]);
  }

}

function writeMajors(major){

  console.log("writeMajors() called :)"); 
  // the major name included '/' in the string, firebase uses it as going inside the key to make new child
  // so that it is replaced with '-'
  major = major.replace(/\//g,'-');

  firebase.database().ref('majors/').child(major).update({
    majorName: major
  });
}