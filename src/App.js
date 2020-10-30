import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom"

import MainPage from "./routes/MainPage";
import Contact from "./routes/Contact"
/*import Login from "./routes/Login"*/
function App() {
    return (
        <Router>
            <div>
                <Route exact path="/" component={MainPage}/>
                {/*<Route exact path="/Login" component={Login}/>*/}
                <Route exact path="/ContactUs" component={Contact}/>
            </div>
        </Router>

    );
}

export default App;