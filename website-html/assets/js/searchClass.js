function searchbarClassSelected(){
  console.log("searchbarClassSelected() called");
  document.getElementById("clubSearchBar").style.display = "none";
  document.getElementById("classSearchBar").style.display = "block";
}

function getClassSnapshot(){
    console.log("getClassSnapshot() called :)");
    var ref = firebase.database().ref("classes");
    ref.on("value", function(snapshot) {
     snapshot.forEach(function(childSnapshot) {
      var className = childSnapshot.key;
      classesArr.push(className);
     });
    });
}

//reads in every discord info from a class
function getDiscordInfo(className){
    console.log("getDiscordInfo() called :)");
    var classRef = "classes/".concat(className);
    console.log("Finding class ->", className);
    var ref = firebase.database().ref(classRef);
    var counter = 1;
    ref.on("value", function(snapshot) {
     snapshot.forEach(function(snapshot) {
      var info_year = snapshot.child("year").val(); //discord info
      var info_quarter = snapshot.child("quarter").val(); //discord info
      var info_profname = snapshot.child("profName").val(); //discord info
      var info_inviteurl = snapshot.child("inviteURL").val(); //discord info
      var displayedInfo = "yr: ";
      displayedInfo += info_year;
      displayedInfo += "          |qtr: ";
      displayedInfo += info_quarter;
      displayedInfo += "          |prof: ";
      displayedInfo += info_profname;
      displayedInfo += "          |url:   ";
      displayedInfo += info_inviteurl;
      displayedInfo += "";
      if(info_year==null || info_year=="" || info_year=="\0"){
        document.getElementById("discordInfo".concat(counter)).innerHTML = "DB Empty - No Discord info Added Yet";
        return;
      }else{
        document.getElementById("discordInfo".concat(counter)).innerHTML = displayedInfo;
      }
      counter++;
     })
    });
}

function submitClassDiscordInfotoDB(){
  console.log("submitDiscordInfotoDB() called!");

  //now add a discordinfo inside Discord server requests DB
  var discordRef = "DiscordServerRequests/";
  console.log(discordRef);
  firebase.database().ref(discordRef).push().set({
      className: localStorage.getItem("classinput"),
      email: localStorage.getItem('user-email'),
      inviteURL: document.getElementById("invitelink").value,
      profName: document.getElementById("professor").value,
      quarter : document.getElementById("quarter").value,
      year: document.getElementById("year").value,
      time:Date(Date.now()).toString()
    });
}

// Old Yonseu Implementation
// function addDiscordInfotoDB(){
//   console.log("addDiscordInfotoDB() called!");
//   //First, count number of children in the class
//   var className = localStorage.getItem("classinput")
//   var classRef = "classes/".concat(className);
//   console.log("Finding class ->", className);
//   var class_ref = firebase.database().ref(classRef);
//   var counter = 1;
//   class_ref.on("value", function(snapshot) {
//    snapshot.forEach(function(snapshot) {
//     counter++;
//    });
//   });

//   //now add a discordinfo inside class DB
//   var discordRef = "classes/" + className + "/discordInfo" + counter;
//   console.log(discordRef);
//   var discord_ref = firebase.database().ref(discordRef);
//   discord_ref.set({
//     inviteURL: document.getElementById("invitelink").value,
//     profName: document.getElementById("professor").value,
//     quarter : document.getElementById("quarter").value,
//     year: document.getElementById("year").value,
//   });
// }

function resetDB(){
  console.log("addDiscordInfotoDB() called!");
  //First, count number of children in the class
  var className = localStorage.getItem("classinput")
  var classRef = "classes/".concat(className);
  console.log("Finding class ->", className);
  var class_ref = firebase.database().ref(classRef);
  class_ref.set({
    discordInfo1: "",
  });
}

function submit_class(){
    var classInput = document.getElementById("inputClasses").value;
    //check if user input is valid
    if(classesArr.includes(classInput)){
        localStorage.setItem("classinput", classInput); //save data to local storage cause we dont wanna use php lmao
        window.location.href = "classDB.html";
    }
    else{
        alert("The class you entered is not in our Database.");
    }
}

function autocompleteClass(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;

      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*create buffer for scrolling*/
      nodesBuffer = document.createElement("BODY");
      nodesBuffer.setAttribute("id", this.id+"buffer");
      nodesBuffer.setAttribute("class", "buffer-items");
      nodesBuffer.style.display = "none";
      this.parentNode.appendChild(nodesBuffer);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }

      a.addEventListener("wheel",function (e){
          e.preventDefault();

          if(e.deltaY>0&&a.childElementCount>7){
              nodesBuffer.appendChild(a.firstChild);
              a.removeChild(a.firstChild);
              console.log("scroll up");
          }else if(e.deltaY<0){
              if(nodesBuffer.hasChildNodes()){
                  console.log("buffer not empty");
                  a.insertBefore(nodesBuffer.lastChild,a.firstChild);
              }
          }

      });

  });



  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });



  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    var y = document.getElementsByClassName("buffer-items")
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
    for (var i = 0; i < y.length; i++) {
        y[i].parentNode.removeChild(y[i]);
    }
  }

  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}



var classesArr =[];
autocompleteClass(document.getElementById("inputClasses"), classesArr);
