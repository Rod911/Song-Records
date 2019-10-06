/* eslint-disable */
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import ProfileModal from './ProfileModal';
import Users from './Users';

class Account extends Component {
    constructor(props) {
        super(props);
        this.loginFormSubmit = this.submit.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    submit = (e) => {
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

    setTheme = (e) => {
        e.preventDefault();
        this.props.changeTheme(e.target.getAttribute("data-theme"));
    }

    render() {
        let user = this.props.user;
        let attemptLogin = this.props.attemptLogin;
        let loggedIn = this.props.loggedIn;
        let currentTheme = this.props.currentTheme;
        if (!loggedIn) {
            return (
                <div className="container loginForm col-6 col-sm-12">
                    <form method="POST" onSubmit={this.submit} >
                        <fieldset>
                            <legend>Sign in</legend>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email" >Email</label>
                                <input className="form-input" type="email" id="email" name="email" placeholder="Enter email here" required autoComplete="email" />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="password" >Password</label>
                                <input className="form-input" type="password" id="password" name="password" placeholder="Password" required autoComplete="password" />
                            </div>
                            <div className="form-group">
                                <input className="btn btn-block" type="submit" value="Login" />
                            </div>
                            <div className="form-group">
                                <Link to="/account/forgot" className="btn btn-link btn-block" >Forgot password?</Link>
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
            const userName = (user.name === null || user.name === "null") ? "New User" : user.name;
            const initials = userName.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase();
            const accoutDetails = (
                <div className="container account-info column col-4 col-lg-6 col-md-8 col-xs-12">
                    <div className="card">
                        <div className="card-image" style={{ padding: "16px", paddingBottom: 0 }}>
                            <figure className="avatar avatar-xl" data-initial={initials} style={{ backgroundColor: "#3a418c", padding: "50px" }} />
                        </div>
                        <div className="card-header">
                            <div className="card-title h4">{userName}</div>
                            <div className="card-subtitle text-gray"> {user.id} ({user.type}) </div>
                        </div>
                        <div className="card-body">{user.sector}</div>
                        <div className="card-footer">
                            <div className="btn-group btn-group-block">
                                <button className="btn btn-primary" onClick={this.signOut}>Sign Out</button>
                                <a className="btn" href="#profile">Profile</a>
                            </div>
                        </div>
                    </div>
                </div>
            );

            const appearance = (
                <div className="container appearance column col-4 col-lg-6 col-md-8 col-xs-12">
                    <div className="divider" />
                    <div className="panel">
                        <div className="panel-header h4">Appearance</div>
                        <div className="panel-footer">
                            <div className="form-group">
                                <div className="btn-group btn-group-block">
                                    <button className={"btn btn-sm theme-select " + (currentTheme === "light" ? "active" : "") } data-theme="light" onClick={this.setTheme}>Light</button>
                                    <button className={"btn btn-sm theme-select " + (currentTheme === "dark" ? "active" : "") } data-theme="dark" onClick={this.setTheme}>Dark</button>
                                    <button className={"btn btn-sm theme-select " + (currentTheme === "black" ? "active" : "") } data-theme="black" onClick={this.setTheme}>Black</button>
                                </div> 

                                {/* <ul className="step">
                                    <li className={"step-item " + (currentTheme === "light" ? "active" : "") }>
                                        <a href="#" className="theme-select" data-theme="light" onClick={this.setTheme}>Light</a>
                                    </li>
                                    <li className={"step-item " + (currentTheme === "dark" ? "active" : "") }>
                                        <a href="#" className="theme-select" data-theme="dark" onClick={this.setTheme}>Dark</a>
                                    </li>
                                    <li className={"step-item " + (currentTheme === "black" ? "active" : "") }>
                                        <a href="#" className="theme-select" data-theme="black" onClick={this.setTheme}>Black</a>
                                    </li>
                                </ul> */}
                            </div>
                        </div>
                    </div>
                </div>
            );

            return (
                <React.Fragment>
                    {accoutDetails}
                    <ProfileModal
                        user={user}
                        auth={this.props.auth}
                        verify={this.props.verifyUser}
                    // Prop-drilling 💔
                    />
                    {
                        user.type === "admin" && (
                            <Users
                                currentUser={this.props.user.id}
                            />
                        )
                    }
                    {appearance}
                </React.Fragment>
            );
        }
    }
}

Account.propTypes = {
    attemptLogin: PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object,
    auth: PropTypes.object,
    loginFormSubmit: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    verifyUser: PropTypes.func.isRequired,
    changeTheme: PropTypes.func.isRequired,
    currentTheme: PropTypes.string
}

export default Account
