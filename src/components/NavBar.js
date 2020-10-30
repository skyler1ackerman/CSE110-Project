import React from 'react';
import  '../App.css';
import { withRouter} from 'react-router-dom';
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
    redirectLogin= ()=>{
        this.props.history.push("/Login");
    }

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
            <nav className='navbar'>
                <label onClick={this.redirectHome}>HOME</label >
                <label onClick={this.redirectLogin}>LOGIN</label >
                <label onClick={this.redirectClasses}>CLASSES</label >
                <label onClick={this.redirectClubs}>CLUBS</label >
                <label onClick={this.redirectDepartments}>DEPARTMENTS</label >
                <label  onClick={this.redirectContact}>CONTACT</label >
            </nav>
        );
    }
}

export default withRouter(NavBar);