/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Login extends Component {
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

    editContent = (id, type, btn) => {
        let div = document.getElementById(id);
        if (btn.target.tagName === "I") {
            btn.target = btn.target.parentNode;
        }
        btn.target.parentElement.firstChild.remove();
        let parentDiv = div.parentElement;
        let input = document.createElement("input");
        input.type = type;
        input.id = id;
        input.value = div.textContent;
        input.classList.add("form-input");
        input.autocomplete = type;
        parentDiv.removeChild(div);
        parentDiv.appendChild(input);
    }

    saveProfile = (e) => {
        e.preventDefault();
        const inputs = e.target.getElementsByTagName("input");
        const user = this.props.auth;

        for (const input of inputs) {
            switch (input.id) {
                case "inpEmail":
                    user.updateEmail(input.value).then(function () {
                        alert("Sign out and login again to update");
                    }).catch(function (error) {
                        alert(e.message);
                    });
                    break;
                case "inpPassword":
                    user.updatePassword(input.value)
                        .then(function () {
                            alert("Sign out and login again to update");
                        }).catch(function (e) {
                            alert(e.message);
                        });
                    break;
                case "inpUname":
                    user.updateProfile({
                        displayName: input.value,
                        photoURL: null
                    }).then(function () {
                        alert("Sign out and login again to update");
                    }).catch(function (e) {
                        alert(e.message);
                    });
                    break;
                default:
                    // default
                    break;
            }
        }
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
            const initials = user.name.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase();
            const accoutDetails = (
                <div className="container account-info column col-4 col-lg-6 col-md-8 col-xs-12">
                    <div className="card">
                        <div className="card-image" style={{ padding: "16px", paddingBottom: 0 }}>
                            <figure className="avatar avatar-xl" data-initial={initials} style={{ backgroundColor: "#3a418c", padding: "50px" }} />
                        </div>
                        <div className="card-header">
                            <div className="card-title h4">{user.name}</div>
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

            const modal = (
                <div className="modal" id="profile-modal">
                    <a className="modal-overlay" href="#modals" aria-label="Close" ></a>
                    <div className="modal-container" role="document">
                        <div className="modal-header">
                            <a className="btn btn-clear float-right" href="#modals" aria-label="Close"></a>
                            <div className="modal-title h5">Profile</div>
                        </div>
                        <div className="modal-body">
                            <div className="content">
                                <div className="panel">
                                    <div className="panel-header text-center">
                                        <figure className="avatar avatar-xl" data-initial={initials} style={{ backgroundColor: "#3a418c", padding: "50px" }} />
                                        <div className="panel-title h5 mt-10">{user.name}</div>
                                        <div className="panel-subtitle text-capitalize">{user.type}</div>
                                    </div>
                                    <div className="divider" />
                                    <form onSubmit={this.saveProfile}>
                                        <div className="panel-body">
                                            <div className="tile tile-centered" style={tileStyle} >
                                                <div className="tile-content">
                                                    <div className="tile-title text-bold">E-mail</div>
                                                    <div className="tile-subtitle" id="inpEmail" >{user.id}</div>
                                                </div>
                                                <div className="tile-action">
                                                    <button role="button" className="btn btn-link btn-action btn-lg tooltip tooltip-left" data-tooltip="Edit E-mail" onClick={(e) => this.editContent("inpEmail", "email", e)} ><i className="icon icon-edit"></i></button>
                                                </div>
                                            </div>
                                            <div className="tile tile-centered" style={tileStyle} >
                                                <div className="tile-content">
                                                    <div className="tile-title text-bold">Password</div>
                                                    <div className="tile-subtitle" id="inpPassword" ></div>
                                                </div>
                                                <div className="tile-action">
                                                    <button role="button" className="btn btn-link btn-action btn-lg tooltip tooltip-left" data-tooltip="Edit Password" onClick={(e) => this.editContent("inpPassword", "password", e)} ><i className="icon icon-edit"></i></button>
                                                </div>
                                            </div>
                                            <div className="tile tile-centered" style={tileStyle} >
                                                <div className="tile-content">
                                                    <div className="tile-title text-bold">Display Name</div>
                                                    <div className="tile-subtitle" id="inpUname" >{user.name}</div>
                                                </div>
                                                <div className="tile-action">
                                                    <button role="button" className="btn btn-link btn-action btn-lg tooltip tooltip-left" data-tooltip="Edit Display Name" onClick={(e) => this.editContent("inpUname", "text", e)} ><i className="icon icon-edit"></i></button>
                                                </div>
                                            </div>
                                            <div className="tile tile-centered" style={tileStyle} >
                                                <div className="tile-content">
                                                    <div className="tile-title text-bold">Location</div>
                                                    <div className="tile-subtitle">{user.sector}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel-footer">
                                            <button className="btn btn-primary btn-block" >Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <a className="btn btn-link" href="#modals">Close</a>
                        </div>
                    </div>
                </div>
            );

            return(
                <React.Fragment>
                    {accoutDetails}
                    {modal}
                </React.Fragment>
            );
        }
    }
}

Login.propTypes = {
    attemptLogin:PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object,
    auth: PropTypes.object,
    loginFormSubmit: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
}

const tileStyle = {
    margin: "0.75rem 0"
}

export default Login
