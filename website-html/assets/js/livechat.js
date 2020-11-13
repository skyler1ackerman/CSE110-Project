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
        html += "<li style=\"text-align: right; margin:8px 0px 8px 0px;\" id='message-" + snapshot.key + "'>";
        html += "<button style=\"color:darkred;\" data-id='" + snapshot.key + "' onclick='deleteMessage(this);' class=\"no-style\">";
            html += "&times;"
        html += "</button>";
        html += "     <span style='background-color:#b19cd9; border-radius:10px; padding:2px 4px 2px 4px;'>" + snapshot.val().message + "</span>";
    }
    else{
        //this for changing text color for each person. user color hex code.
        var senderStr = String(snapshot.val().sender);
        var asciiSum = 0;
        for (var i = 0; i < senderStr.length; i++) {
            asciiSum += senderStr.charCodeAt(i)*i*82;
        }
        var colorHexCode = (asciiSum%16777215).toString(16);
        if(colorHexCode.length == 6){
            colorHexCode = colorHexCode.concat("");
        } else if(colorHexCode.length == 5){
            colorHexCode = colorHexCode.concat("F");
        } else if(colorHexCode.length == 4){
            colorHexCode = colorHexCode.concat("3F");
        }else if(colorHexCode.length == 3){
            colorHexCode = colorHexCode.concat("3EF");
        }else if(colorHexCode.length == 2){
            colorHexCode = colorHexCode.concat("F3EF");
        } else if(colorHexCode.length == 1){
            colorHexCode = colorHexCode.concat("FF3EF");
        }
        html += "<li style=\"text-align: left; margin-left:0px;\" id='message-" + snapshot.key + "'>";
        html += "<span style='font-size:20px; color:#" + colorHexCode +  ";'>&#9632;</span>"; 
        html += "<span style='font-size:12px; color:white; background-color:#"+ colorHexCode +"; border-radius:3px;'>"+String(snapshot.val().sender).split(" ")[0] +"</span>: <span style='padding:2px;'>" + snapshot.val().message + "</span>";
    }
    if (snapshot.val().sender != localStorage.getItem("user-displayname")) {
    html += "</li>";
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


