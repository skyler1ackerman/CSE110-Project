import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import MainPage from "./routes/MainPage";
import Login from "./routes/Login";
import Classes from "./routes/Classes";
import Clubs from "./routes/Clubs";
import Departments from "./routes/Departments";
import Contact from "./routes/Contact";
import PrivateRoute from "./auth/PrivateRoute";
import  {AuthProvider} from "./auth/Auth";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Route exact path="/" component={MainPage}/>
                    <Route exact path="/Login" component={Login}/>
                    <PrivateRoute exact path="/Classes" component={Classes}/>
                    <PrivateRoute exact path="/Clubs" component={Clubs}/>
                    <PrivateRoute exact path="/Departments" component={Departments}/>
                    <Route exact path="/Contact" component={Contact}/>
                </div>
            </Router>
        </AuthProvider>


    );
}

export default App;