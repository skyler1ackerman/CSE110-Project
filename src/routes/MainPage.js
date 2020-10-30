import React from 'react';
import SearchBar from "../components/SearchBar";

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


class MainPage extends React.Component {


    render(){
        return(
            <body style={backgroundStyle}>
                <div>
                    <NavBar/>
                </div>
                <div className='container'>
                    <head>Hello</head>
                    <h1>Triton Groups</h1>
                    <br/>
                    <h2>A site that connects you with your classmates</h2>
                    <br/>
                    <label>
                        Search by class <SearchBar/>
                    </label>

                    {/*<img src="/group.png" alt="group"  width="639" height="385"/>*/}
                </div>
            </body>

        );
    }


}


export default MainPage;