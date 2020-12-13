function searchbarClubSelected(){
  document.getElementById("classSearchBar").style.display = "none";
  document.getElementById("clubSearchBar").style.display = "block";
}

function getCommunitySnapshot() {
    getCommunitySnap().then(snapshot => {
        for(var i in snapshot.result)
            communitiesArr.push(snapshot.result[i]);
    });
}
const getCommunitySnap = () => {
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getCommunitySnapshot', config)
        .then(response => response.json())
        .catch(error => console.log(error));
}

function submit_community() {
    var communityInput = document.getElementById("inputCommunities").value;
    document.getElementById('displayResults').style.display = "block";

    location.hash = 'displayResults';


    // Animation for moving the screen
    if (window.location.hash) scroll(0,0);

    setTimeout(function () {
        scroll(0, 0);
    }, 1);
    if (window.location.hash) {
        var hash = window.location.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 1500, 'swing');
    }

    // Removes previous title of Community from previous search query from page,
    // otherwise it keeps adding the element but never gets deleted on new search
    var remove1 = document.querySelector(" #results > #community-category ");
    var remove2 = document.querySelector(" #results > #communityName ");
    if(remove1 !== null){
        remove1.parentNode.removeChild(remove1);
    }
    if(remove2 !== null){
        remove2.parentNode.removeChild(remove2);
    }

    if (communitiesArr.includes(communityInput)) {
        localStorage.setItem("communityInput", communityInput); //save data to local storage cause we dont wanna use php lmao
        getCommunity(communityInput).then(snapshot => {
            let results = snapshot;
            document.getElementById("results").innerHTML = `\t\t\t<h2 style=\"text-align: center;\" id=\"communityName\">${communityInput}</h2>\n` + document.getElementById("results").innerHTML;
            document.getElementById("queryResults").innerHTML = results;
        });
    }
    else {
        document.getElementById('displayResults').style.display = "none";
        showInvalidCommunityAlert();
    }

}

const getCommunity = (communityName) => {
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getCommunity?name=' + communityName, config)
        .then(response => response.text())
        .catch(error => console.log(error));
}

// Util Function for naviagating to report page
function goToReportPageFromCommunity(communityOrClassNameSelected, communityOrClassDiscordServerSelected) {

    // Processing
    localStorage.setItem('communityOrClassNameSelected', communityOrClassNameSelected);
    localStorage.setItem("communityOrClassDiscordServerSelected", communityOrClassDiscordServerSelected)
    localStorage.setItem('isCommunitySelected', 'True')

    window.location.href = "report-discord-server.html"
}

function goToUpdateCommunityPage(communityName, communityContact, communityDiscordLink, communityDescription,
    communityType, communitySocialMedia, communityCategory) {

    // Processing
    localStorage.setItem('communityName', communityName);
    localStorage.setItem('communityContact', communityContact);
    localStorage.setItem('communityDiscordLink', communityDiscordLink)
    localStorage.setItem('communityDescription', communityDescription);
    localStorage.setItem('communityType', communityType);
    localStorage.setItem('communitySocialMedia', communitySocialMedia);    
    localStorage.setItem('communityCategory', communityCategory);
    
    window.location.href = "update-community.html"
}

function submit_community_category(categoryInput){
    document.getElementById('displayResults').style.display = "block";

    location.hash = 'displayResults';

    // Animation for moving the screen
    // programatically scroll down a bit. otherwise animation sometimes doesnt work.
    window.scrollBy(0, 1);      
    if (window.location.hash) scroll(0,0);
    setTimeout(function () {
        scroll(0, 0);
    }, 1);
    if (window.location.hash) {
        var hash = window.location.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 1500, 'swing');
    }

    // Removes previous title of Community from previous search query from page,
    // otherwise it keeps adding the element but never gets deleted on new search
    var remove1 = document.querySelector(" #results > #community-category ");
    var remove2 = document.querySelector(" #results > #communityName ");
    if(remove1 !== null){
        remove1.parentNode.removeChild(remove1);
    }
    if(remove2 !== null){
        remove2.parentNode.removeChild(remove2);
    }

    localStorage.setItem("categoryInput", categoryInput);
    getCommunityByCat(categoryInput).then(snapshot => {
        let results = snapshot;
        document.getElementById("results").innerHTML = `\t\t\t<h2 style=\"text-align: center;\" id=\"community-category\">${categoryInput}</h2>\n` + document.getElementById("results").innerHTML;
        document.getElementById("queryResults").innerHTML = results;

        var container = document.querySelector(" #results > #queryResults ");
        var coll = container.querySelectorAll(" .community > .collapsible")
        var i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
    });
}

const getCommunityByCat = (category) => {
    let config = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    return fetch('http://localhost:8000/getCommunityByCat?category=' + category, config)
        .then(response => response.text())
        .catch(error => console.log(error));
}
// end of Category Search

function autocompleteCommunity(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
    if(inp === null){
        return;
    }
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
      a.style.maxHeight="20vh"
      a.style.overflowY="scroll";
      a.style.borderColor="transparent";
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

//alert box for invlaid community name search
function showInvalidCommunityAlert(){
    document.getElementById("customAlert").style.display="block";
}

var communitiesArr =[];
autocompleteCommunity(document.getElementById("inputCommunities"), communitiesArr);
