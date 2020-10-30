import React from "react";
import "../App.css"
import NavBar from "../components/NavBar";
const backgroundStyle = {

    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
    backgroundImage: `url('/GeiselNight.jpg')`,

}

class Clubs extends React.Component{
    render(){
        return(
            <body style={backgroundStyle}>
            <div>
                <NavBar/>
            </div>
            <div className= 'container'>
                <h1>Clubs feature coming Soon</h1>
                <p>Designed by Team San Diego</p>
            </div>
            </body>
        );
    }
}

export default Clubs;