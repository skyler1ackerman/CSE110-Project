function getFeedbackValues(){
    var a = document.getElementById("email").value;
    var b = document.getElementById("firstname").value;
    var c = document.getElementById("lastname").value;
    var d = document.getElementById("Issue_type").value;
    var e = document.getElementById("explanation").value;
    var msg = a.concat(b.concat(c.concat(d.concat(e))));
    alert(msg);
}