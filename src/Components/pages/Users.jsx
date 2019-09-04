import React, { Component } from 'react'
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

export class Users extends Component {

    constructor() {
        super();
        this.state = {
            users: [],
            userID: "",
            accessClaim: ""
        }
    }

    componentDidMount() {
        const database = firebase.database();
		const rootRef = database.ref("users");
        const sector = localStorage.getItem("sector");
        rootRef.orderByChild("sector").equalTo(sector).on("child_added", snap => {
            this.setState(oldState => ({
                users: [...oldState.users, {...snap.val(), key: snap.key}]
            }))
        });
        rootRef.on('child_removed', oldChildSnapshot => {
            let removed = this.state.users.filter(user => user.email !== oldChildSnapshot.val().email)
            this.setState({ users: removed });
        });
    }

    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    }

    addUser = (e) => {
        e.preventDefault();
        e.persist();
        const userEmail = this.state.userID;
        const userData = {
            claims: this.state.accessClaim,
            email: userEmail,
            sector: localStorage.getItem("sector")
        }

        const randomPassword = Array(10)
            .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
            .map(x => x[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * x.length)])
            .join('');
        
        firebase.auth().createUserWithEmailAndPassword(userEmail, randomPassword)
            .then(res => {
                let actionCodeSettings = {
                    url: 'https://song-records.web.app/?email=' + userEmail,
                    // iOS: {
                    // 	bundleId: 'com.example.ios'
                    // },
                    // android: {
                    // 	packageName: 'com.example.android',
                    // 	installApp: true,
                    // 	minimumVersion: '12'
                    // },
                    handleCodeInApp: true,
                    // When multiple custom dynamic link domains are defined, specify which
                    // one to use.
                    continueUrl: 'https://song-records.web.app'
                };
                // User created
                firebase.database().ref("users/" + res.user.uid).set(userData);
                firebase.auth().sendPasswordResetEmail(userEmail, actionCodeSettings).then(function () {
                    alert("Ask user to reset password using link in email");
                }).catch(function (error) {
                    alert("Unknown error:" + error);
                });
            })
            .then(() => {
                // Added to DB
                this.setState({ userID: "", accessClaim: "" });
                e.target.reset()
            })
            .catch(error => {
                // Handle Errors here.
                // var errorCode = error.code;
                // var errorMessage = error.message;
                console.error(error)
                // ...
            });
    }

    deleteUser = (e) => {
        firebase.database().ref("users/" + e).set(null);
    }

    userList = () => {
        return (
            <div className="userList">
            {    
                this.state.users.length === 0 ?
                    <div className="loading loading-lg" key="loading" /> :
                    this.state.users.map(user => {
                        // const disabled = (this.props.currentUser === user.email);
                        return (
                            <div className="tile" key={user.email} >
                                <div className="tile-icon"><i className="icon icon-people"></i></div>
                                <div className="tile-content">
                                    <p className="tile-title">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="tile-action" title="Under construction 💙">
                                    <button className="btn btn-link" disabled={"disabled"/*disabled*/} onClick={() => { this.deleteUser(user.key) }} ><i className="icon icon-delete"></i></button>
                                </div>
                            </div>
                        )
                    })
            }
            </div>
        )
    }

    render() {
        return (
            <div className="user-list container column col-4 col-lg-6 col-md-8 col-xs-12">
                <div className="divider" />
                <div className="panel">
                    <div className="panel-header">
                        <div className="panel-title h4">Users in your sector</div>
                    </div>
                    <div className="panel-body">
                        { this.userList() }
                    </div>
                    <div className="panel-footer">
                        <form onSubmit={this.addUser}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    id="userID"
                                    className="form-input input-sm"
                                    placeholder="User Email"
                                    style={{ width: "70%" }}
                                    onChange={this.handleChange}
                                    required
                                />
                                <select
                                    id="accessClaim"
                                    className="form-select select-sm"
                                    onChange={this.handleChange}
                                    required
                                >
                                    <option value=""></option>
                                    <option value="admin">Admin</option>
                                    <option value="coordinator">Coordinator</option>
                                    <option value="contributor">Contributor</option>
                                </select>
                                <button className="btn btn-primary input-group-btn btn-sm">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Users
