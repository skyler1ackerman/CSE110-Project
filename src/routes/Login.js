import React, {useContext} from "react";
import "../App.css"
import NavBar from "../components/NavBar";
import db , { provider2 } from "../base"
import { Redirect } from "react-router-dom";
import {AuthContext} from "../auth/Auth";
const backgroundStyle = {

    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
    backgroundImage: `url('/GeiselNight.jpg')`,

}

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



    const { currentUser } = useContext(AuthContext);
    if (currentUser) {
        return <Redirect to="/Classes" />;
    }



    return(
        <body style={backgroundStyle}>
        <div>
            <NavBar/>
        </div>
        <div className= 'container'>
            <button onClick={handleLoginWithGoogle}>Log In with Google</button>
        </div>
        </body>


    );
};

export default Login;







