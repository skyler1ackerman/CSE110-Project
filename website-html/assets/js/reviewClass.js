
function removeClass(className,Bid){
    var classRef = "classes/".concat(className);
    firebase.database().ref(classRef).child(Bid).remove();
}

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
async function getDiscordInfo(className){
    console.log("getDiscordInfo() called");
    var classRef = "classes/".concat(className);
    console.log("Finding class ->", className);
    var ref = firebase.database().ref(classRef);
    var resultsString = { str : "" };
    var results = {};
    //This loop iterates over the clubs associated with the category
    await ref.once("value", function(snapshot) {
        snapshot.forEach(function (snapshot) {
            var info_id = snapshot.key;
            var info_year = snapshot.child("year").val(); //discord info
            var info_quarter = snapshot.child("quarter").val(); //discord info
            var info_profname = snapshot.child("profName").val(); //discord info
            var info_inviteurl = snapshot.child("inviteURL").val(); //discord info
            if(info_quarter === ""){
                return;
            }
            var item = info_quarter.concat(" ",info_year);
            // if Quarter Year is not already in the dict, add it
            if (!(item in results)){
                results[item] = [];
            }

            // Add to list associated with Quarter Year
            // results = Dictionary where
            // { Fall 2020 : [ {prof: ... , discord : ... } , {...} ] }
            var profDiscordInfo = {"prof" : info_profname, "discord" : info_inviteurl, "id" : info_id};
            results[item].push(profDiscordInfo);
            //console.log(results);

        });
    });
    //console.log(JSON.parse(JSON.stringify(results)));

    // Returns results before finished parsing the DB, so still empty
    return results;
};

async function constructHTML(className){

    // result is still empty even when using async/await
    let result = await getDiscordInfo(className);
    console.log("constructHTML");
    //console.log(JSON.parse(JSON.stringify(result)));
    var resultsString = {str : ""};
    if (localStorage.getItem("reviewClassInput")!=null&&jQuery.isEmptyObject(result)){
        resultsString.str += "<p>There is no discord server for this class yet. Add a new one!</p>";
    }
    //console.log(Object.values(result).length);
    Object.keys(result).forEach(function(key) {
        resultsString.str += "<li class='community' style=\"display: inline;\">";
        resultsString.str += `<button class=\"collapsible\">${key}</button>`;
        resultsString.str += "<div class=\"content\">";
        resultsString.str += "<p></p>";
        resultsString.str += "<div class=\"table-wrapper\" style=\"align-content: center;\">\n" +
            "                        <table class=\"alt\" style=\"align-self: center;\">\n" +
            "                            <thead></thead>\n" +
            "                            <tbody>";
        result[key].forEach(function(elem) {
            resultsString.str += `<tr class="classList">
                                     <td style=\"text-align: center; vertical-align: middle;\">${elem['prof']}</td>
                                     <td><button  class=\"buttonPrimary\" id=\"${elem['id']}\">REMOVE DISCORD</button>
                                     </td> </tr>`;


        });

        resultsString.str += "</tbody>\n" +
            "                            <tfoot>\n" +
            "                            </tfoot>\n" +
            "                        </table>\n" +
            "                    </div>\n" +
            "                    <p></p>";
        resultsString.str += "</div>";
        resultsString.str += "</li>";
        //};

    });
    console.log("After for each loop");
    console.log(resultsString.str);
    document.getElementById("queryResults").innerHTML = resultsString.str;

    var container = document.querySelector(" #results > #queryResults ");
    var coll = container.querySelectorAll(" .community > .collapsible");
    var removeBts = container.querySelectorAll(".buttonPrimary");
    var tabs = document.querySelectorAll(".classList");
    var i;
    for(i=0;i < tabs.length; i++){
        tabs[i].addEventListener("click",function (){
           console.log(this);
            if(this.childElementCount==0){
                var element = this.parentNode.parentNode.parentNode.parentNode.parentNode;
                element.parentNode.removeChild(element);
            }

        });
    }
    for(i = 0; i < removeBts.length; i++){
        var Bid=removeBts[i].id;
        console.log();
        removeBts[i].addEventListener("click",function (className,Bid,e){
            var classRef = "classes/".concat(className);
            firebase.database().ref(classRef).child(Bid).remove();
            var element = document.getElementById(Bid).parentNode.parentNode;

            if(element.parentNode.childElementCount==1){
                element=element.parentNode.parentNode.parentNode.parentNode.parentNode;
                element.parentNode.removeChild(element);
            }else{s
                element.parentNode.removeChild(element);
            }
            alert("Discord successfully removed from the database!")
        }.bind(removeBts[i],className,Bid));

    }

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
};





function submit_class(){
    var reviewClassInput = document.getElementById("inputClasses").value;
    //check if user input is valid
    if(classesArr.includes(reviewClassInput)){
        localStorage.setItem("reviewClassInput", reviewClassInput); //save data to local storage cause we dont wanna use php lmao
        window.location.href = "admin-discord-review.html";
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
