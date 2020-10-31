import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import MainPage from "./routes/MainPage";
import Login from "./routes/Login";
import Classes from "./routes/Classes";
import Clubs from "./routes/Clubs";
import Departments from "./routes/Departments";
import Contact from "./routes/Contact";


function App() {
    return (
        <Router>
            <div>
                <Route exact path="/" component={MainPage}/>
                <Route exact path="/Login" component={Login}/>
                <Route exact path="/Classes" component={Classes}/>
                <Route exact path="/Clubs" component={Clubs}/>
                <Route exact path="/Departments" component={Departments}/>
                <Route exact path="/Contact" component={Contact}/>
            </div>
        </Router>

    );
}

export default App;