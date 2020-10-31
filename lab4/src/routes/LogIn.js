import React, {useContext} from "react";
import {AuthContext} from "../auth/Auth";
import { Redirect } from "react-router-dom";
// import db from "../base";
import '../App.css';
import db , { provider2 } from "../base"

const Login = ({history}) => {

    const handleLoginWithGoogle = () => {
        try{
            db
                .auth()
                .signInWithPopup(provider2).then(function(result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    console.log(user);
                    console.log(user.email);
                    //check if the email ends with @ucsd.edu
                    console.log(user.email.substr(user.email.length - 9));
                    if(user.email.substr(user.email.length - 9) != "@ucsd.edu"){
                      console.log("Not a UCSD email!");
                      //if not ucsd email, sign out
                      db.auth().signOut().then(function() {
                        console.log("signout successful!");
                      }).catch(function(error) {
                        console.log("signout error!");
                      });
                    } // => "Tabs1")
                    else{
                      console.log("signin successful!");
                    }
                    // ...
                  }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                  });
            history.push("/");
        } catch (error){
            alert(error);
        }
    }

    // const handleLogin = (event) => {
    //     event.preventDefault();
    //     const { email, password } = event.target.elements;

    //     try{
    //         db
    //         .auth()
    //         .signInWithEmailAndPassword(email.value, password.value);
    //         history.push("/");
    //     } catch(error){
    //         alert(error);
    //     }
    // }

    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Redirect to="/" />;
    }

    const redirectSignUp = () => {
        history.push("/signup")
    }

    return(
        <div className="centered">
            <div className="row">
                <h1>Log In</h1>
                {/* <form onSubmit={handleLogin} >
                    <label>
                        Email
                        <input name="email" type="email" placeholder="Email" />
                    </label>
                    <label>
                        Password
                        <input name="password" type="password" placeholder="Password" />
                    </label>
                    <button type="submit">Log In</button>
                </form>
                <button onClick={redirectSignUp}>Sign UP</button> */}
                <button onClick={handleLoginWithGoogle}>Log In with Google</button>
            </div>
        </div>
    );
};

export default Login;