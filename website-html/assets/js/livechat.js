function closeChatRoom(){
    console.log("close called");
    document.getElementById("chatroom").style.visibility = "hidden";
    document.getElementById("openChatroom").style.visibility = "visible";
}

function openChatRoom(){
    console.log("close called");
    document.getElementById("openChatroom").style.visibility = "hidden";
    document.getElementById("chatroom").style.visibility = "visible";
    // addOnlineNumberAsUserSignin();
}


function addOnlineNumberAsUserSignin(){
	var numOnlinePpl = (document.getElementById("numonline").innerHTML) || 0 ;
	numOnlinePpl++;
	firebase.database().ref('messages/').update({
		onlineCount: numOnlinePpl,
 	});
}

function sendMessage() {
	// get message
	var message = document.getElementById("message").value;
	// save in database
	firebase.database().ref("messages/dataID").push().set({
		"sender": localStorage.getItem("user-displayname"),
		"message": message
    });
    document.getElementById("message").value = "";
	// prevent form from submitting
	return false;
}

// listen for incoming messages
firebase.database().ref("messages/dataID").on("child_added", function (snapshot) {
    var html = "";
    // give each message a unique ID
    // html += "<li style=\"text-align: right; margin-right:5px;\" id='message-" + snapshot.key + "'>";
    // show delete button if message is sent by me
    if (snapshot.val().sender == localStorage.getItem("user-displayname")) {
        html += "<li style=\"text-align: right; margin-right:5px;\" id='message-" + snapshot.key + "'>";
        html += "<button style=\"color:darkred;\" data-id='" + snapshot.key + "' onclick='deleteMessage(this);' class=\"no-style\">";
            html += "&times;"
        html += "</button>";
        html += "     <span style='background-color:brown; padding:2px 6px 2px 8px;'>" + snapshot.val().message + "</span>";
    }
    else{
        html += "<li style=\"text-align: left; margin-left:0px;\" id='message-" + snapshot.key + "'>";
        html += "    <img src='assets/css/images/img_avatar.png' alt='Avatar' class='avatar'>: <span style='background-color:purple; padding:2px;'>" + snapshot.val().message + "</span>";
    }
    if (snapshot.val().sender != localStorage.getItem("user-displayname")) {
    html += "</li><span font-size:3px !important;>" + String(snapshot.val().sender).split(" ")[0]+"</span>";
    }
    document.getElementById("messages").innerHTML += html;
    var objDiv = document.getElementById("messagesContainer");
    objDiv.scrollTop = objDiv.scrollHeight;
});

//listen to how many ppl are online
firebase.database().ref("messages/onlineCount").on('value', function (snapshot) {
    document.getElementById("numonline").innerHTML = snapshot.val();
    console.log("numlogin!: ",snapshot.val());
});



function deleteMessage(self) {
    // get message ID
    var txt;
    var res = confirm("Remove the message?");
    if (res == true) {
        var messageId = self.getAttribute("data-id");
        // delete message
        firebase.database().ref("messages/dataID").child(messageId).remove();
    } else {
        //nothing happens
    }
    
}
 
// attach listener for delete message
firebase.database().ref("messages/dataID").on("child_removed", function (snapshot) {
    // remove message node
    document.getElementById("message-" + snapshot.key).innerHTML = "*message removed*";
});


