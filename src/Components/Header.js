import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


class Header extends Component {
    constructor(props){
        super(props);
        this.signOut = this.signOut.bind(this);
    }

    signOut = () => {
        this.props.signOut()
        localStorage.clear();
    }


    render() {
        let user = this.props.loggedIn;
        let userAction = [];
        if (user) {
            userAction= (
                <React.Fragment>
                    <Link to="/account" style={links} >Account</Link>
                    <button onClick={this.signOut}>Sign Out</button>
                </React.Fragment>
            )
        } else {
            userAction=(<Link to="/account" style={links} >Log In</Link>);
        }
        
        let component = (
            <div className="header">
                <header>
                    <h2>Recorder</h2>
                    <Link to="/" style={links} >Home</Link>|
                    <Link to="/categories" style={links} >Categories</Link>|
                    {userAction}
                </header>
            </div>
        )
        return(component);
    }
}

Header.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    signOut: PropTypes.func.isRequired
}

export default Header

const links = {
    color: "#00A",
    margin: "10px"
}