import React from 'react';
import SearchBar from "../components/SearchBar";
import db , { provider2 } from "../base"
import '../components/NavBar'
import NavBar from "../components/NavBar";

const backgroundStyle = {

    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
    backgroundImage: `url('/GeiselNight.jpg')`,

}

class Classes extends React.Component{
    render() {
        return(
            <body style={backgroundStyle}>
            <div>
                <NavBar/>
            </div>
            <div className='container'>

                <label>
                    Search by class <SearchBar/>
                </label>
                <button onClick={() => db.auth().signOut()}>Sign Out</button>
            </div>
            </body>
            );
    }
}

export default Classes;