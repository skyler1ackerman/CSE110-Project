function getFeedbackValues(){
    var a = document.getElementById("email").value;
    var b = document.getElementById("fullname").value;
    var c = document.getElementById("Issue_type").value;
    var d = document.getElementById("explanation").value;
    var msg = a.concat(b.concat(c.concat(d)));
    alert(msg);
}