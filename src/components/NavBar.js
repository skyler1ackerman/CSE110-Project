import React from 'react';
import  '../App.css';
import { withRouter} from 'react-router-dom';
import db from "../base";



class NavBar extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            color: 'white'
        }
    }

    redirectHome =()=>{
        this.props.history.push("/");
    }
    /*= ()=>{
        this.props.history.push("/Login");
    }*/

    redirectClasses =()=>{
        this.props.history.push("/Classes");
    }


    redirectClubs= ()=>{
        this.props.history.push("/Clubs");
    }

    redirectDepartments= ()=>{
        this.props.history.push("/Departments");
    }

    redirectContact =()=>{
        this.props.history.push("/Contact");
    }

    render(){
        return(
            <div>
                <nav className='navbar'>
                    <button onClick={this.redirectHome}>HOME</button >
                    {/*<button onClick={this.redirectLogin}>LOGIN</button >*/}
                    <button onClick={this.redirectClasses}>CLASSES</button >
                    <button onClick={this.redirectClubs}>CLUBS</button >
                    <button onClick={this.redirectDepartments}>DEPARTMENTS</button >
                    <button  onClick={this.redirectContact}>CONTACT</button >
                </nav>

            </div>


        );
    }
}

export default withRouter(NavBar);