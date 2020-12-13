// assumes searchMajor.js, searchClass.js, login.js
// variables
var courseArray = [];
var courseCount = 0;
var userMajor = "";
var profileImgUrl = "";
var usernameKey = "";

//recycle user obj
var currentUser = {
    id:"", 
    name:"", 
    email:"",
    photoUrl:"", 
};

function setCurrentUserObj(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            currentUser.id = user.uid;
            currentUser.name = user.displayName;
            currentUser.email = user.email;
            currentUser.photoUrl = user.photoURL;
            updatePage();
        } else {
        // No user is signed in.
            document.location.href="/";
        }
    });
}

// define helper fuctions for MVC, sends req to server
const getUserName = (uid) => {
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getUserName?uid=' + uid, config)
    .then(response => response.text())
    .catch(error => console.log(error));
}

const getUserMajor = (uid) => {
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getUserMajor?uid=' + uid, config)
    .then(response => response.text())
    .catch(error => console.log(error));
}

const getUserClasses = (uid) => {
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getUserClasses?uid=' + uid, config)
    .then(response => response.text())
    .catch(error => console.log(error));
}

const saveUserProfile = (uid, courses, major, email, name) => {
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            uid,
            courses,
            major,
            email,
            name
        })
    };
    fetch('http://localhost:8000/saveUserProfile', config)
    .catch(error => console.log(error));
}

function updatePage() {
    // used user id as key in order to recover saved user data
    usernameKey = currentUser.id;
    
    getUserMajor(usernameKey).then(snapshot => {
        userMajor = snapshot;
        if (userMajor == null) {
            userMajor = "";
        } else if (typeof userMajor === "string"){
            // fill in the major textbox 
            document.getElementById("inputMajors").value = userMajor;
        }
    });
    getUserClasses(usernameKey).then(snapshot => {
        courseArray = snapshot;
        if (courseArray == null) {
            courseArray = [];
        } else if (typeof courseArray === "string"){
            // take string of comma-seperated classes, turn into an array of strings
            courseArray = courseArray.split(",");
            courseCount = courseArray.length;
            if(courseArray[0].length === 0){
                courseArray = [];
                courseCount = 0;
            }
            // clear and fill in the course list textbox 
            document.getElementById("courseListToSave").value = "";
            for (i of courseArray) {
                document.getElementById("courseListToSave").value = document.getElementById("courseListToSave").value + i + "\n";
            }
        }
    });
    
    document.getElementById("fullname").value = currentUser.name;
    document.getElementById("email").value = currentUser.email;

    // take url of user's profile pic from login.js, get a resized version (unsure if always works)
    var profileImgUrl = currentUser.photoUrl;
    profileImgUrl = profileImgUrl.replace("s96-c", "s512-c");
    document.getElementById("profilePicUserProfile").src=profileImgUrl;
    //remove local storage items in signout function for security.
    document.getElementById("welcomeMessage").innerHTML="Hi " + currentUser.name.substr(0,currentUser.name.indexOf(' ')) + "!";

}

    
// currently only for dropdown in select, no duplicate add check 
function addCourse() {
    var currentCourse = document.getElementById("inputClasses").value;
    // clear the input box for responsiveness
    document.getElementById("inputClasses").value = "";
    document.getElementById("inputClassesErr").innerHTML = "";
    document.getElementById("inputMajorsErr").innerHTML = "";
    document.getElementById("saveErr").innerHTML = "";
    //check if user input is valid
    if(classesArr.includes(currentCourse) && currentCourse !== ""){
    }
    else{
        //alert("The class you entered is not in our Database.");
        document.getElementById("inputClassesErr").innerHTML = "The class you entered is not in our database.";
        return false;
    }
    var i;
    for (i of courseArray) {
        if(i == currentCourse){
            //alert("The class you entered is already in the list.");
            document.getElementById("inputClassesErr").innerHTML = "The class you entered is already in the list.";
            return false;
        }
    }
    courseArray[courseCount] = currentCourse;
    courseCount++;
    // clear and fill in the course list textbox 
    document.getElementById("courseListToSave").value = "";
    for (i of courseArray) {
        document.getElementById("courseListToSave").value = document.getElementById("courseListToSave").value + i + "\n";
    }

}

// take entered major, make sure its valid before letting save button take it 
function setMajor() {
    var currentMajor = document.getElementById("inputMajors").value;
    // check if user input is valid major, allowing empty major
    if(majorsArr.includes(currentMajor) || currentMajor === ""){
        userMajor = currentMajor;
        //alert("The major you entered will be saved.");
        document.getElementById("inputMajorsErr").style.color = "green"; 
        document.getElementById("inputMajorsErr").innerHTML = "";
    }
    else{
        //alert("The major you entered is not in our database, will not be saved.");
        document.getElementById("inputMajorsErr").style.color = "red"; 
        document.getElementById("inputMajorsErr").innerHTML = "Invalid major.";
        document.getElementById("inputMajors").value = "";
        userMajor = "";
        return false;
    }
}

function updateProfile(){
    var courses = courseArray.toString();

    // send to backend

    saveUserProfile(currentUser.id, courses, userMajor, currentUser.email, currentUser.name);
    //alert("Enrolled courses saved!")
    document.getElementById("saveErr").style.color = "green";
    document.getElementById("saveErr").innerHTML = "Your changes have been saved.";
    document.getElementById("inputClasses").value = "";
    document.getElementById("inputClassesErr").innerHTML = "";

}
// clear is not meant to update db, only the list visible on page
function clearList(){
    document.getElementById("courseListToSave").value = "";
    document.getElementById("saveErr").innerHTML = "";
    document.getElementById("inputMajorsErr").innerHTML = "";
    document.getElementById("inputClassesErr").innerHTML = "";
    document.getElementById("inputClasses").value = "";
    courseArray = [];
    courseCount = 0;
}

// main
// call function to get user obj and update page
setCurrentUserObj();
// get all class and major info from FB databse, need this for vars
getClassSnapshot();
getMajorSnapshot();
