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
                .signInWithPopup(provider2);
            history.push("/");
        } catch (error){
            alert(error);
        }
    }

    const handleLogin = (event) => {
        event.preventDefault();
        const { email, password } = event.target.elements;

        try{
            db
            .auth()
            .signInWithEmailAndPassword(email.value, password.value);
            history.push("/");
        } catch(error){
            alert(error);
        }
    }

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
                <form onSubmit={handleLogin} >
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
                <button onClick={redirectSignUp}>Sign UP</button>
                <button onClick={handleLoginWithGoogle}>Log In with Google</button>
            </div>
        </div>
    );
};

export default Login;