/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProfileModal from './ProfileModal';
import Users from './Users';

class Account extends Component {
    constructor(props){
        super(props);
        this.loginFormSubmit = this.submit.bind(this);
        this.signOut = this.signOut.bind(this);
    }

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
                                <input className="form-input" type="email" id="email" name="email" placeholder="Enter email here" required autoComplete="email" />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="password" >Password</label>
                                <input className="form-input" type="password" id="password" name="password" placeholder="Password" required autoComplete="password" />
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
            const userName = user.name === null ? "New User" : user.name;
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
                                <a className="btn" href="#profile-modal">Profile</a>
                            </div>
                        </div>
                    </div>
                </div>
            );

            return(
                <React.Fragment>
                    {accoutDetails}
                    <ProfileModal
                        user={user}
                        auth={this.props.auth}
                        // Prop-drilling 💔
                    />
                    {
                        user.type === "admin" && (
                            <Users
                                currentUser = {this.props.user.id}
                            />
                        )
                    }
                </React.Fragment>
            );
        }
    }
}

Account.propTypes = {
    attemptLogin:PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object,
    auth: PropTypes.object,
    loginFormSubmit: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
}

export default Account
