import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


class Login extends Component {
    constructor(props){
        super(props);
        this.loginFormSubmit = this.submit.bind(this);
        this.signOut = this.signOut.bind(this);
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
    signOut = () => {
        this.props.signOut()
        localStorage.clear();
    }
    render() {
        let user = this.props.user;
        let attemptLogin = this.props.attemptLogin;
        let loggedIn = this.props.loggedIn;
        if(!loggedIn){
            return(
                <div className="container loginForm col-6 col-sm-12">
                    <form method="POST" onSubmit={this.submit} >
                        <fieldset>
                            <legend>Sign in</legend>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email" >Email</label>
                                <input className="form-input" type="email" id="email" name="email" placeholder="Enter email here" required onChange={this.handleChange} autoComplete="email" />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="password" >Password</label>
                                <input className="form-input" type="password" id="password" name="password" placeholder="Password" required onChange={this.handleChange} autoComplete="password" />
                            </div>
                            <div className="form-group">
                                <input className="btn btn-block" type="submit" value="Login" />
                            </div>
                        {
                            attemptLogin !== "" &&
                            (<div className="error" >
                                <span className="label label-error" >{attemptLogin}</span>
                            </div>)
                        }
                        </fieldset>
                    </form>
                </div>
            );
        } else {
            let initials = user.name.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase();
            return(
                <div className="container account-info column col-4 col-lg-6 col-md-8 col-xs-12">
                    <div className="card">
                        <div className="card-image" style={{padding: "16px", paddingBottom: 0}}>
                            <figure class="avatar avatar-xl" data-initial={initials} style={{ backgroundColor: "#3a418c", padding: "50px"}} />
                        </div>
                        <div className="card-header">
                            <div className="card-title h4">{user.name}</div>
                            <div className="card-subtitle text-gray">{user.type} </div>
                        </div>
                        <div className="card-body">{user.sector}</div>
                        <div className="card-footer">
                            <button className="btn btn-primary" onClick={this.signOut}>Sign Out</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

Login.propTypes = {
    attemptLogin:PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object,
    loginFormSubmit: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
}

export default Login
