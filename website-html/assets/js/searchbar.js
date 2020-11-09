function getClassSnapshot(){
    console.log("getClassSnapshot() called :)"); 
    if (!firebase.apps.length) {
      console.log("firebase app initlized!");
      firebase.initializeApp(firebaseConfig);
    }
    var ref = firebase.database().ref("classes");
    ref.on("value", function(snapshot) {
     snapshot.forEach(function(childSnapshot) {
      // var childData = childSnapshot.val(); // this is object
      var className = childSnapshot.key; //class name
      // var childchildval = childSnapshot.child("discordInfo1/inviteURL").val(); //discord info
      // console.log(childKey);
      // console.log(childchildval);
      classes.push(className);
     });
    });
}
function submit_class(){
    var classInput = document.getElementById("inputClasses").value;
    //check if user input is valid
    if(classes.includes(classInput)){
        localStorage.setItem("classinput", classInput); //save data to local storage cause we dont wanna use php lmao
        window.location.href = "classDB.html";
    }
    else{
        alert("The class you entered is not in our Database.");
    }
}
function autocomplete(inp, arr) {
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

/*An array containing all the country names in the world:*/
// var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
// var classes = ["CSE 3", "CSE 4GS", "CSE 6GS", "CSE 5A", "CSE 8A", "CSE 8B", "CSE 11", "CSE 12", "CSE 15L", "CSE 20", "CSE 21", "CSE 30", "CSE 42", "CSE 80", "CSE 86", "CSE 87", "CSE 90", "CSE 91", "CSE 99", "CSE 100", "CSE 101", "CSE 103", "CSE 105", "CSE 106", "CSE 107", "CSE 110", "CSE 112", "CSE 113", "CSE 118", "CSE 120", "CSE 123", "CSE 124", "CSE 125", "CSE 127", "CSE 130", "CSE 131", "CSE 132A", "CSE 132B", "CSE 134B", "CSE 135", "CSE 136", "CSE 140", "CSE 140L", "CSE 141", "CSE 141L", "CSE 143", "CSE 145", "CSE 148", "CSE 150A", "CSE 150B", "CSE 151A", "CSE 151B", "CSE 152", "CSE 152A", "CSE 152B", "CSE 156", "CSE 158", "CSE 160", "CSE 163", "CSE 164", "CSE 165", "CSE 166", "CSE 167", "CSE 168", "CSE 169", "CSE 170", "CSE 176A", "CSE 176E", "CSE 180", "CSE 180R", "CSE 181", "CSE 182", "CSE 184", "CSE 185", "CSE 190", "CSE 191", "CSE 192", "CSE 193", "CSE 195", "CSE 197", "CSE 198", "CSE 199", "CSE 199H", "CSE 200", "CSE 201A", "CSE 202", "CSE 203A", "CSE 203B", "CSE 205A", "CSE 206A", "CSE 207", "CSE 208", "CSE 209A", "CSE 209B", "CSE 210", "CSE 211", "CSE 216", "CSE 218", "CSE 219", "CSE 221", "CSE 222A", "CSE 222B", "CSE 223B", "CSE 224", "CSE 227", "CSE 229A", "CSE 229C", "CSE 230", "CSE 231", "CSE 232", "CSE 232B", "CSE 233", "CSE 237A", "CSE 237B", "CSE 237C", "CSE 237D", "CSE 239A", "CSE 240A", "CSE 240B", "CSE 240C", "CSE 241A/ECE", "CSE 243A", "CSE 244A", "CSE 245", "CSE 248", "CSE 249A", "CSE 249B", "CSE 250A", "CSE 250B", "CSE 250C", "CSE 252A", "CSE 252B", "CSE 252C", "CSE 253", "CSE 254", "CSE 255", "CSE 256/LING", "CSE 257", "CSE 258", "CSE 258A", "CSE 259", "CSE 260", "CSE 262", "CSE 272", "CSE 274", "CSE 276A", "CSE 276B", "CSE 276C", "CSE 276D", "CSE 276E", "CSE 280A", "CSE 282/BENG", "CSE 283/BENG", "CSE 284", "CSE 290", "CSE 291", "CSE 292", "CSE 293", "CSE 294", "CSE 298", "CSE 299", "CSE 500", "CSE 599", "AESE 278A", "AESE 278B", "AESE 278C", "AESE 278D", "AESE 278E", "AESE 241", "AESE 261", "AESE 279A", "AESE 279B", "", "ECE 5", "ECE 15", "ECE 16", "ECE 17", "ECE 25", "ECE 30", "ECE 35", "ECE 45", "ECE 65", "ECE 85", "ECE 87", "ECE 90", "ECE 100", "ECE 101", "ECE 102", "ECE 103", "ECE 107", "ECE 108", "ECE 109", "ECE 111", "ECE 115", "ECE 118", "ECE 120", "ECE 121A", "ECE 121B", "ECE 123", "ECE 124", "ECE 125A", "ECE 125B", "ECE 128A", "ECE 128B", "ECE 128C", "ECE 134", "ECE 135A", "ECE 135B", "ECE 136L", "ECE 138L", "ECE 140A", "ECE 140B", "ECE 141A", "ECE 141B", "ECE 143", "ECE 144", "ECE 145AL-BL-CL", "ECE 148", "ECE 150", "ECE 153", "ECE 155", "ECE 156", "ECE 157A", "ECE 157B", "ECE 158A", "ECE 158B", "ECE 159", "ECE 161A", "ECE 161B", "ECE 161C", "ECE 163", "ECE 164", "ECE 165"]
var classes =[];
/*initiate the autocomplete function on the "inputClasses" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("inputClasses"), classes);
