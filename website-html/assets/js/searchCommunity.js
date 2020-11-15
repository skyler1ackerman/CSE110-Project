function searchbarClubSelected(){
  console.log("searchbarClubSelected() called");
  document.getElementById("classSearchBar").style.display = "none";
  document.getElementById("clubSearchBar").style.display = "block";
}
function getCommunityInfoByName(name){
  console.log("getCommunityInfoByName() called :)");
  var ref = firebase.database().ref("clubs").child(name);
  console.log("NAME: ", name);
  ref.on('value', function(snapshot) {
      console.log(snapshot.val());
      let communityObj = snapshot.val()
      console.log("year!: , ", communityObj.year);
      document.getElementById("community-academic-year").innerHTML =  snapshot.child("year").val(); //discord info
      document.getElementById("community-date-created").innerHTML = snapshot.child("year").val();
      document.getElementById("community-status").innerHTML = snapshot.child("year").val();
      document.getElementById("community-organization-type").innerHTML = snapshot.child("year").val();
      document.getElementById("community-purpose").innerHTML =snapshot.child("year").val();
      // document.getElementById("community-discord-link").innerHTML = communityObj  (Pending)
      document.getElementById("community-socialmedia").innerHTML = snapshot.child("year").val();
      document.getElementById("community-email").innerHTML = snapshot.child("year").val();
  });
}

function getCommunitySnapshot(){
  console.log("getCommunitySnapshot() called :)");
  var ref = firebase.database().ref("clubs");
  ref.on("value", function(snapshot) {
   snapshot.forEach(function(childSnapshot) {
    var communityName = childSnapshot.key;
    communitiesArr.push(communityName);
   });
  });
  console.log("communitiesArr:! ", communitiesArr);
}

function submit_community(){
  var communityInput = document.getElementById("inputCommunities").value;
  //check if user input is valid
  if(communitiesArr.includes(communityInput)){
      localStorage.setItem("communityInput", communityInput); //save data to local storage cause we dont wanna use php lmao
      window.location.href = "communityDB.html";
  }
  else{
      alert("The community you entered is not in our Database.");
  }
}

function autocompleteCommunity(inp, arr) {
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
      nodesBuffer.setAttribute("id", "buffer");
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
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

var communitiesArr =[];
autocompleteCommunity(document.getElementById("inputCommunities"), communitiesArr);
