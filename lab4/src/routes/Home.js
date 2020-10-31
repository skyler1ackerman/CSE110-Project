import React, {Component} from "react";
import TeamMembers from "../components/TeamMembers";
import DisplayData from "../components/DisplayData";
import db from "../base";
import "../App.css"

const Home = () => {

    return (
        <div>
            <h1>Home</h1>
            <div className="centered">
                <TeamMembers/>
                <DisplayData/>
                <button onClick={() => db.auth().signOut()}>Sign Out</button>
            </div>
        </div>
    )
};

export default Home;