import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class ProfileModal extends Component {

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
        const user = this.props.user;
        const auth = this.props.auth;
        const emailVerified = auth.emailVerified;
        const userName = user.name || "New User";
        const initials = userName.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase();
        return (
            <div className="modal modal-lg" id="profile-modal">
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
                                    <div className="panel-title h5 mt-10">{userName}</div>
                                    <div className="panel-subtitle text-capitalize">{user.type}</div>
                                </div>
                                <div className="divider" />
                                <form onSubmit={this.saveProfile}>
                                    <div className="panel-body">
                                        <div className="tile tile-centered" style={tileStyle} >
                                            <div className="tile-content">
                                                <div className="tile-title text-bold">E-mail</div>
                                                <div className="tile-subtitle" id="inpEmail" >{user.id} {emailVerified ? "(Email Verified)" : (<button className="btn btn-sm" role="button">Verify</button>)}</div>
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
                                                <div className="tile-subtitle" id="inpUname" >{userName}</div>
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
                                    <div className="panel-footer btn-group btn-group-block">
                                        <button className="btn btn-primary btn-block" >Save</button>
                                        <a className="btn btn-block" href="#modals">Close</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>
        )
    }
}

ProfileModal.propTypes = {
    user: PropTypes.object,
    auth: PropTypes.object
}

const tileStyle = {
    margin: "0.75rem 0"
}

export default ProfileModal
