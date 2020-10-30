import React from 'react';
import  '../App.css';
import { withRouter} from 'react-router-dom';
class NavBar extends React.Component{
    redirectContact =()=>{
        this.props.history.push("/ContactUs");
    }
    redirectHome =()=>{
        this.props.history.push("/");
    }

    render(){
        return(
            <nav className='navbar'>
                <label onClick={this.redirectHome}>Home</label >
                <label >Login</label >
                <label  onClick={this.redirectContact}>Contact Us</label >
            </nav>
        );
    }
}

export default withRouter(NavBar);