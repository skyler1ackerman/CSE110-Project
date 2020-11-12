
 //check access toke is prest for now 
    //future import jwt validate packge for checkig experation date 
    // route to / if not there 
    //continute to load if present 

function auth(){
    console.log("LOADED FROM AUTH.JS");
    if (auth2.isSignedIn.get()){
        console.log("WEBSITE FETCH STARTED")
    } else{
        console.log("WEBSITE FETCH REJECTED")
        window.location.href = "index.html";
    }
}
auth();