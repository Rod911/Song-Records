import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


class Login extends Component {
    constructor(props){
        super(props);
        this.loginFormSubmit = this.submit.bind(this);
    }
    handleChange = (e) => this.setState({[e.target.name]: e.target.value});

    submit = (e) =>{
        e.preventDefault();
        this.props.loginFormSubmit([
            e.target['email'].value,
            e.target['password'].value
        ])
        return false;
    }

    render() {
        let user = this.props.user;
        let attemptLogin = this.props.attemptLogin;
        let loggedIn = this.props.loggedIn;
        if(!loggedIn){
            return(
                <div className="loginForm">
                    <form method="POST" onSubmit={this.submit} >
                        <label htmlFor="email" >Email</label>
                        <input type="email" id="email" name="email" placeholder="Enter email here" required onChange={this.handleChange} />
                        <label htmlFor="password" >Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" required onChange={this.handleChange} />
                        <input type="submit" value="Login" />
                        {
                            attemptLogin !== "" &&
                            (<div className="error" >
                                <p>{attemptLogin}</p>
                            </div>)
                        }
                    </form>
                </div>
            );
        } else {
            return(
                <div>
                    <h4>{user.name}</h4>
                    <p>Sector: {user.sector} </p>
                    <p>Access: {user.type} </p>
                </div>
            );
        }
    }
}

Login.propTypes = {
    attemptLogin:PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object,
    loginFormSubmit: PropTypes.func.isRequired
}

export default Login
