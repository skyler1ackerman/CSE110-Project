//recycle user obj
var currentUser = {
    id:"", 
    name:"", 
    email:"",
    photoUrl:"", 
    welcomeMessage:"", 
};

//recycle other user obj
var otherUser = {
    id:"", 
    name:"", 
    email:"",
    photoUrl:"", 
    welcomeMessage:"", 
};


function setCurrentUserObj(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            currentUser.id = user.uid;
            console.log("user uid:", currentUser.id);
            currentUser.name = user.displayName;
            console.log("user name:", currentUser.name);
            currentUser.email = user.email;
            console.log("user email:", currentUser.email);
            currentUser.photoUrl = user.photoURL;
            console.log("user photoUrl:", currentUser.photoUrl);
            currentUser.welcomeMessage = "Hi! I am ".concat(currentUser.name);
            console.log("user welcome msg:", currentUser.welcomeMessage);
        } else {
          // No user is signed in.
        }
    });
}

function initiateDefaultSession(){
    (function(t,a,l,k,j,s){
        s=a.createElement('script');s.async=1;s.src="https://cdn.talkjs.com/talk.js";
        a.head.appendChild(s);
        k=t.Promise;
        t.Talk={v:3,ready:{then:function(f){if(k)return new k(function(r,e){l.push([f,r,e])});
            l.push([f])},catch:function(){
                return k&&new k()
            },c:l}
        };
    })(window,document,[]);

    Talk.ready.then(function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var me = new Talk.User({
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoUrl: user.photoURL,
                    welcomeMessage: "Welcome to Triton Groups Live Chat!",
                });
                window.talkSession = new Talk.Session({
                    appId: "tGPhd31E",
                    me: me     
                });
                var conversation = talkSession.getOrCreateConversation(Talk.oneOnOneId(me))
                conversation.setParticipant(me);
                var inbox = talkSession.createInbox({selected: conversation});
                inbox.mount(document.getElementById("talkjs-container"));
            } else {
              // No user is signed in.
            }
        });
    });

}

function instantiateSession(otherID, otherName, otherEmail, otherPhotoUrl, otherWelcomeMsg){
    (function(t,a,l,k,j,s){
        s=a.createElement('script');s.async=1;s.src="https://cdn.talkjs.com/talk.js";
        a.head.appendChild(s);
        k=t.Promise;
        t.Talk={v:3,ready:{then:function(f){if(k)return new k(function(r,e){l.push([f,r,e])});
            l.push([f])},catch:function(){
                return k&&new k()
            },c:l}
        };
    })(window,document,[]);

    Talk.ready.then(function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var me = new Talk.User({
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoUrl: user.photoURL,
                    welcomeMessage: "Hi! I am ".concat(user.displayName),
                });
                window.talkSession = new Talk.Session({
                    appId: "tGPhd31E",
                    me: me     
                });
                var other = new Talk.User({
                    id: otherID, 
                    name: otherName,
                    email: otherEmail,
                    photoUrl: otherPhotoUrl,
                    welcomeMessage: otherWelcomeMsg
                });
        
                var conversation = talkSession.getOrCreateConversation(Talk.oneOnOneId(me, other))
                conversation.setParticipant(me);
                conversation.setParticipant(other);
        
                var inbox = talkSession.createInbox({selected: conversation});
                inbox.mount(document.getElementById("talkjs-container"));
            } else {
              // No user is signed in.
            }
        });
    });
}

const delay = ms => new Promise(res => setTimeout(res, ms));
const queueMatch = async () => {
    document.getElementById("chatGuide").innerHTML = ""; 
    document.getElementById("matchBtn").style.display = "none"; 
    document.getElementById("cancelBtn").style.display = "block"; 
    
    // document.getElementById("chatGuide").innerHTML = "You are on queue for a new match..."; 
    document.getElementById("loadingIcon").style.display = "flex"; 
    // do a bunch of stuff here regarding matching
    findMatch();
}

//find match and return the otherUser information
function findMatch(){
    //if queue is empty, create a new queue and listen to it
    //if every queue is full, create new queue and listen to it 
    //if there is a queue with a waiting participant, join the queue
    firebase.database().ref("livechat/queues").once('value').then((snapshot) => {
        //when the queue is empty, create a new queue and listen to it.
        var ifAllQueueFull = 1;
        if(snapshot.numChildren() == 0){
            console.log("EMPTY QUEUE!");
            var myRef = firebase.database().ref("livechat/queues").push();
            var key = myRef.key; //get the push-random-key for listening
            console.log("key: ", key);
            myRef.set({
                "participants": {
                    [currentUser.id]: {
                      "id": currentUser.id,
                      "name": currentUser.name,
                      "email": currentUser.email,
                      "photoUrl": currentUser.photoUrl,
                      "welcomeMessage": currentUser.welcomeMessage,
                    },
                },
            });
            firebase.database().ref("livechat/queues").child(key).on('value', (snapshot) =>{
                console.log("sc:", snapshot.child("participants").numChildren()); 
                if(snapshot.child("participants").numChildren()==2){
                    //read the other person's profile and match with him.
                    snapshot.child("participants").forEach(function(childSnapshot){
                        console.log(childSnapshot.key);
                        if(childSnapshot.key!=currentUser.id){
                            //get the other person's user profile(that's not me)
                            var oUser = childSnapshot.val();
                            //detach eventlistener
                            firebase.database().ref("livechat/queues").child(key).off();
                            //and match
                            console.log("OTHER USER ENTERED THE QUERY!");
                            console.log("You are matching with: ", oUser.email)
                            instantiateSession(oUser.id, oUser.name, oUser.email, oUser.photoURL, oUser.welcomeMessage);
                            document.getElementById("chatGuide").innerHTML = "Welcome to Triton Chat!";
                            document.getElementById("matchBtn").style.display = "block"; 
                            document.getElementById("cancelBtn").style.display = "none"; 
                            document.getElementById("loadingIcon").style.display = "none"; 
                            document.getElementById('canvas').style.visibility = "visible";
                            document.getElementById('canvas').style.opacity = "1";
                            document.getElementById('canvas').style.zIndex = "8";
                            document.getElementById('congratMsg').style.visibility = "visible";
                            document.getElementById('congratMsg').style.opacity = "0.8";
                            document.getElementById('congratMsg').style.zIndex = "12";
                            var fireworkSound = new Audio('assets/audio/fireworkWhistle.mp3');
                            fireworkSound.play();
                            setTimeout(function() { 
                                document.getElementById('canvas').style.visibility = "hidden";
                                document.getElementById('canvas').style.opacity = "0";
                                document.getElementById('congratMsg').style.visibility = "hidden";
                                document.getElementById('congratMsg').style.opacity = "0";
                                fireworkSound.volume = 0.2;
                            }, 3500);
                            setTimeout(function() { 
                                document.getElementById('canvas').style.zIndex = "0";
                                document.getElementById('congratMsg').style.zIndex = "0";
                                fireworkSound.pause();
                                fireworkSound.currentTime = 0;
                                fireworkSound.volume = 0.2;
                            }, 5000);
                            return;
                        }
                    });
                }
            });
        } else{
            snapshot.forEach(function(childSnapshot) {
                //if there is a queue with a waiting participant, join the queue and match
                if(childSnapshot.child("participants").numChildren() == 1){
                    //set all full flag to false
                    ifAllQueueFull = 0;
                    // upload my userprofile to that queue
                    firebase.database().ref("livechat/queues/" + childSnapshot.key + "/participants/" + currentUser.id).set({
                        id: currentUser.id,
                        name: currentUser.name,
                        email: currentUser.email,
                        photoUrl: currentUser.photoUrl,
                        welcomeMessage: currentUser.welcomeMessage,
                    });
                    //read the other's profile (once) and match
                    firebase.database().ref("livechat/queues/" + childSnapshot.key + "/participants/").once('value').then((snapshot) => {
                        snapshot.forEach(function(grandChildSnapshot){
                            console.log(grandChildSnapshot.key);
                            if(grandChildSnapshot.key!=currentUser.id){
                                //get the other person's user profile(that's not me)
                                var oUser = grandChildSnapshot.val();
                                console.log("YOU ENTERED AN EXISTING QUERY!");
                                console.log("You are matching with: ", oUser.email)
                                instantiateSession(oUser.id, oUser.name, oUser.email, oUser.photoURL, oUser.welcomeMessage);
                                document.getElementById("chatGuide").innerHTML = "Welcome to Triton Chat!";
                                document.getElementById("matchBtn").style.display = "block"; 
                                document.getElementById("cancelBtn").style.display = "none"; 
                                document.getElementById("loadingIcon").style.display = "none"; 
                                document.getElementById('canvas').style.visibility = "visible";
                                document.getElementById('canvas').style.opacity = "1";
                                document.getElementById('canvas').style.zIndex = "8";
                                document.getElementById('congratMsg').style.visibility = "visible";
                                document.getElementById('congratMsg').style.opacity = "0.8";
                                document.getElementById('congratMsg').style.zIndex = "12";
                                var fireworkSound = new Audio('assets/audio/fireworkWhistle.mp3');
                                fireworkSound.play();
                                setTimeout(function() { 
                                    document.getElementById('canvas').style.visibility = "hidden";
                                    document.getElementById('canvas').style.opacity = "0";
                                    document.getElementById('congratMsg').style.visibility = "hidden";
                                    document.getElementById('congratMsg').style.opacity = "0";
                                    fireworkSound.volume = 0.2;
                                }, 3500);
                                setTimeout(function() { 
                                    document.getElementById('canvas').style.zIndex = "0";
                                    document.getElementById('congratMsg').style.zIndex = "0";
                                    fireworkSound.pause();
                                    fireworkSound.currentTime = 0;
                                    fireworkSound.volume = 0.2;
                                }, 5000);
                                return;
                            }
                        });
                    }); 
                }
            }); 
            //in JS, if statement is synchronous
            //if every queue is full, create new queue and listen to it  //line below gets executed after foreach is done since js trait
            if(ifAllQueueFull == 1){
                console.log("EVERY QUEUE IS FULL. CREATING NEW QUEUE");
                var myRef = firebase.database().ref("livechat/queues").push();
                var key = myRef.key; //get the push-random-key for listening
                console.log("key: ", key);
                myRef.set({
                    "participants": {
                        [currentUser.id]: {
                          "id": currentUser.id,
                          "name": currentUser.name,
                          "email": currentUser.email,
                          "photoUrl": currentUser.photoUrl,
                          "welcomeMessage": currentUser.welcomeMessage,
                        },
                    },
                });
                firebase.database().ref("livechat/queues").child(key).on('value', (snapshot) =>{
                    console.log("sc:", snapshot.child("participants").numChildren()); 
                    if(snapshot.child("participants").numChildren()==2){
                        //read the other person's profile and match with him.
                        snapshot.child("participants").forEach(function(childSnapshot){
                            console.log(childSnapshot.key);
                            if(childSnapshot.key!=currentUser.id){
                                //get the other person's user profile(that's not me)
                                var oUser = childSnapshot.val();
                                //detach eventlistener
                                firebase.database().ref("livechat/queues").child(key).off();
                                //and match
                                console.log("OTHER USER ENTERED THE QUERY!");
                                console.log("You are matching with: ", oUser.email)
                                instantiateSession(oUser.id, oUser.name, oUser.email, oUser.photoURL, oUser.welcomeMessage);
                                document.getElementById("matchBtn").style.display = "block"; 
                                document.getElementById("cancelBtn").style.display = "none"; 
                                document.getElementById("chatGuide").innerHTML = "Welcome to Triton Chat!";
                                document.getElementById("loadingIcon").style.display = "none"; 
                                document.getElementById('canvas').style.visibility = "visible";
                                document.getElementById('canvas').style.opacity = "1";
                                document.getElementById('canvas').style.zIndex = "8";
                                document.getElementById('congratMsg').style.visibility = "visible";
                                document.getElementById('congratMsg').style.opacity = "0.8";
                                document.getElementById('congratMsg').style.zIndex = "12";
                                var fireworkSound = new Audio('assets/audio/fireworkWhistle.mp3');
                                fireworkSound.play();
                                setTimeout(function() { 
                                    document.getElementById('canvas').style.visibility = "hidden";
                                    document.getElementById('canvas').style.opacity = "0";
                                    document.getElementById('congratMsg').style.visibility = "hidden";
                                    document.getElementById('congratMsg').style.opacity = "0";
                                    fireworkSound.volume = 0.2;
                                }, 3500);
                                setTimeout(function() { 
                                    document.getElementById('canvas').style.zIndex = "0";
                                    document.getElementById('congratMsg').style.zIndex = "0";
                                    fireworkSound.pause();
                                    fireworkSound.currentTime = 0;
                                    fireworkSound.volume = 0.2;
                                }, 5000);
                                return;
                            }
                        });
                    }
                });          
            }
        }
    });
}

function dequeueMatch(){
    document.getElementById("matchBtn").style.display = "block"; 
    document.getElementById("cancelBtn").style.display = "none"; 
    
    //if there is a queue with one person and id is mine, remove the queue
    firebase.database().ref("livechat/queues").once('value').then((snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            //if there is a queue with one person, check it if it's me, and if it's me, remove the queue room.
            if(childSnapshot.child("participants").numChildren() == 1){
                childSnapshot.child("participants").forEach(function(grandChildSnapshot){
                    //if the only participant's ID is same as my ID, remove the queue room
                    if(grandChildSnapshot.key==currentUser.id){
                        //remove the queue
                        console.log("key: ", childSnapshot.key);
                        firebase.database().ref("livechat/queues/"+childSnapshot.key).remove();
                        document.getElementById("loadingIcon").style.display = "none"; 
                        document.getElementById("chatGuide").innerHTML = "Welcome To Triton Chat!"; 
                    }
                });
            }
        });
    }); 
}



function postNewClaim(){
    $.when($.ajax(getNewClaimInput())).then(function () {
        callFBset();
        uploadAlert();
    });
}

function getClaimByName(Name){
    firebase.database().ref('claims/dataID').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            if(childSnapshot.child("name").val()==Name){
                var name = childSnapshot.child('name').val();
                var claimnNumber = childSnapshot.child('claimnNumber').val();
                var phoneNumber = childSnapshot.child('phoneNumber').val();                
            }  
        }); 
    });
}

function toggleChatContainer(){
    if(document.getElementById('talkjs-container').style.display == 'none'){
        //first, set UI as if the user is not on the queue
        console.log("toggle btn clicked");
        document.getElementById('talkjs-container').style.display = 'block';
        document.getElementById('matchBtn').style.display = 'block';
        document.getElementById('chatGuide').style.display = 'block';
        //if the user is on the queue, change the UI accordingly
        firebase.database().ref("livechat/queues").once('value').then((snapshot) => {
            snapshot.forEach(function(childSnapshot) {
                //if there is a queue with one person, check it if it's me, and if it's me, activate loadingIcon and cancel button
                if(childSnapshot.child("participants").numChildren() == 1){
                    childSnapshot.child("participants").forEach(function(grandChildSnapshot){
                        //if the only participant's ID is same as my ID, ctivate loadingIcon and cancel button
                        if(grandChildSnapshot.key==currentUser.id){
                            //activate loadingIcon and cancel button
                            console.log("there is my queue going on")
                            document.getElementById('talkjs-container').style.display = 'block';
                            document.getElementById('chatGuide').style.display = 'block';
                            document.getElementById('loadingIcon').style.display = 'flex';
                            document.getElementById('cancelBtn').style.display = 'block';
                            return;
                        }
                    });
                }
            });
        }); 
    } else{
        document.getElementById('talkjs-container').style.display = 'none';
        document.getElementById('matchBtn').style.display = 'none';
        document.getElementById('cancelBtn').style.display = 'none';
        document.getElementById('chatGuide').style.display = 'none';
        document.getElementById('loadingIcon').style.display = 'none';
    }
}
setCurrentUserObj();
// initiateDefaultPopupSession();
initiateDefaultSession();
// instantiateSession();

//when user opens up, in default, inbox should appear : click the button programactically (didnt work...)
//match and unmatch buttons. and welcome message or on qeuue message 

//aftre mathing there is cancel button. change it to new matching