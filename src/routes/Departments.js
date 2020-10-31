import React from "react";
import "../App.css"
import NavBar from "../components/NavBar";
import db from "../base";
const backgroundStyle = {

    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
    backgroundImage: `url('/GeiselNight.jpg')`,

}

class Departments extends React.Component{
    render(){
        return(
            <body style={backgroundStyle}>
            <div>
                <NavBar/>
            </div>
            <div className= 'container'>
                <h1>Departments feature coming Soon</h1>
                <p>Designed by Team San Diego</p>
                <button className="SignOutButton" onClick={() => db.auth().signOut()}>Sign Out</button>
            </div>
            </body>
        );
    }
}

export default Departments;