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
    if (user != null) {
        id = user.uid;
        console.log("user uid:", id);
        name = user.displayName;
        console.log("user name:", name);
        email = user.email;
        console.log("user email:", email);
        photoUrl = user.photoURL;
        console.log("user photoUrl:", photoUrl);
        welcomeMessage = "Hi! I am ".concat(name);
        console.log("user welcome msg:", welcomeMessage);
    }

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

    instantiateSession("Sebastian", "Sebastian", "Sebastian@example.com", "https://demo.talkjs.com/img/sebastian.jpg","Hey, how can I help?");
    await delay(10000);
    document.getElementById("chatGuide").innerHTML = "";
}
function disconnect(){
    talkSession.destroy();
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

// instantiateSession();