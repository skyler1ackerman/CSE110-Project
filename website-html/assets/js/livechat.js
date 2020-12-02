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
                console.log("inside user if statement")
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

function match(){
    //get user info
    var user = firebase.auth().currentUser;
    var id, name, email, photoUrl, welcomeMessage; 
    // if (user != null) {
    //     id = user.uid;
    //     console.log("user uid:", id);
    //     name = user.displayName;
    //     console.log("user name:", name);
    //     email = user.email;
    //     console.log("user email:", email);
    //     photoUrl = user.photoURL;
    //     console.log("user photoUrl:", photoUrl);
    //     welcomeMessage = "Hi! I am ".concat(name);
    //     console.log("user welcome msg:", welcomeMessage);
    // }

    firebase.database().ref("livechat/queues").on('value', (snapshot) =>{
        // console.log(snapshot.val()); //snapshot of queues
        snapshot.forEach(function(childSnapshot) {
            // if(childSnapshot.child("name").val()==Name){
            //     var name = childSnapshot.child('name').val();
            //     var claimnNumber = childSnapshot.child('claimnNumber').val();
            //     var phoneNumber = childSnapshot.child('phoneNumber').val();                
            // }  
            
            console.log(childSnapshot.val()); //snapshot of participants
            console.log(childSnapshot.child("participants").numChildren()); //get number of participants in each queue
            childSnapshot.forEach(function(grandChildSnapshot){
                console.log(grandChildSnapshot.val()); //snapshot of each user's info
                // console.log(grandChildSnapshot.numChildren());
            });
        }); 
        
    });
    
    // firebase.database().ref("livechat/queues").push().set({
    //     "participants": {
    //         [id]: {
    //           "id": id,
    //           "name": name,
    //           "email": email,
    //           "photoUrl": photoUrl,
    //           "welcomeMessage": welcomeMessage,
    //         },
    //     },
    // });
}

const delay = ms => new Promise(res => setTimeout(res, ms));
const newMatch = async () => {
    if (typeof talkSession !== 'undefined') {
        disconnect();
    }
    document.getElementById("chatGuide").innerHTML = "Loading Chat...";
    
    // do a bunch of stuff here regarding matching
    findMatch();
    // instantiateSession("Sebastian", "Sebastian", "Sebastian@example.com", "https://demo.talkjs.com/img/sebastian.jpg","Hey, how can I help?");
    await delay(10000);
    document.getElementById("chatGuide").innerHTML = "";
}


function disconnect(){
    talkSession.destroy();
}

//find match and return the otherUser information
function findMatch(){
    firebase.database().ref("livechat/queues").once('value').then((snapshot) => {
        // console.log(snapshot.val()); //snapshot of queues
        // console.log(snapshot.numChildren()); //number of queues

        //when the queue is empty, create a new queue and listen to it.
        var ifAllQueueFull = 1;
        if(snapshot.numChildren() == 0){
            console.log("queue empty!");
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
                            console.log(childSnapshot.val().id);
                            console.log(childSnapshot.val().name);
                            console.log(childSnapshot.val().email);
                            console.log(childSnapshot.val().photoUrl);
                            console.log(childSnapshot.val().welcomeMessage);
                            //detach eventlistener
                            firebase.database().ref("livechat/queues").child(key).off();
                            //and match
                            instantiateSession(oUser.id, oUser.name, oUser.email, oUser.photoURL, oUser.welcomeMessage);
                            return;
                        }
                    });
                }
            });
        } else{
            snapshot.forEach(function(childSnapshot) {
                // console.log(childSnapshot.val()); //snapshot of participants
                // console.log(childSnapshot.child("participants").numChildren()); //get number of participants in each queue

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
                                console.log(grandChildSnapshot.val().id);
                                console.log(grandChildSnapshot.val().name);
                                console.log(grandChildSnapshot.val().email);
                                console.log(grandChildSnapshot.val().photoUrl);
                                console.log(grandChildSnapshot.val().welcomeMessage);
                                instantiateSession(oUser.id, oUser.name, oUser.email, oUser.photoURL, oUser.welcomeMessage);
                                return;
                            }
                        });
                    }); 
                    
                }
                // childSnapshot.forEach(function(grandChildSnapshot){
                //     console.log(grandChildSnapshot.val()); //snapshot of each user's info
                //     // console.log(grandChildSnapshot.numChildren());
                // });
            }); 
            
            //if every queue is full, create new queue and listen to it  //line below gets executed after foreach is done since js trait
            if(ifAllQueueFull == 1){
                console.log("every qeueu is full");
                
            }
        }
    
    });
      
    //if queue is empty, create a new queue and listen to it

    //if every queue is full, create new queue and listen to it 

    //if there is a queue with a waiting participant, join the queue

}
// //possible scenarios
// When user clicks "Start New Match" button, disconnect the chat room, take a snapshot of "livechat/queue"
// 1. When all queues are full or when there is no queue
//         create new queue AND listen if anyone joins into your queue
//             if no one joins, wait
//             if anyone joins, match
// 2. When there is a queue with a spot left
//         join existing queue AND match
            
// //list of functions
// check if all queues are full or empty()
// join existing queue()
// create new queue and listen to the newly made queue()
// match() <-- instantiateSession()





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

setCurrentUserObj();
// instantiateSession();