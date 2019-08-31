import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

import Account from "./Components/pages/Account";
import Header from "./Components/Header";
import DatePicker from "./Components/DatePicker";
import Entries from "./Components/Entries";
import Categories from "./Components/pages/Categories";
import ForgotPass from './Components/pages/ForgotPass';

import config from "./config";

import "spectre.css";
import "spectre.css/dist/spectre-icons.css";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			inputs: {},
			serverData: {},
			date: null,
			user: { id: null },
			pass: false,
			attemptLogin: "",
			edits: "saved"
		};
		firebase.initializeApp(config);
	}

	componentDidMount() {
		const database = firebase.database();
		const rootRef = database.ref("sectors");
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				let sector = localStorage.getItem("sector");
				let name = localStorage.getItem("name");
				let type = localStorage.getItem("type");
				let userid = localStorage.getItem("user");
				if (userid) {	
					this.setState({ user: { id: userid, name: name, sector: sector, type: type }, pass: true });
					
					let categoriesRef = rootRef.child(sector + "/categories");
					categoriesRef.on("value", snap => {
						this.setState({ categories: snap.val() });
					});
				}
			} else {
				this.setState({ user: { id: null, name: "" } });
			}
		});
	}

	del = (id) => {
		let ref = firebase.database().ref("sectors/" + this.state.user.sector + "/categories/" + id);
		ref.remove()
			.then(() => {
				// console.log("success");
			})
			.catch(() => {
				// console.log("failed");
			});
	}

	addCategory = (id) => {
		let total = this.state.categories.length;
		firebase.database().ref("sectors/" + this.state.user.sector + "/categories/" + total).set(id);
	}

	saveData = (e) => {
		e.preventDefault();
		let date = this.state.date;
		let data = this.state.inputs;
		firebase.database().ref("sectors/" + this.state.user.sector + "/data/" + date).set(data)
			.then(() => {
				this.setState({ edits: "saved" });
			})
			.catch(e => {
				this.setState({ edits: "failed" });
				console.log(e);
			});
		this.setState({ edits: "saving" });
	}

	undoEdits = (e) => {
		this.setState({ inputs: {...this.state.serverData}, edits: "saved" });
		
	}

	inputUpdate = (inp, data) => {
		let currInputs = this.state.inputs;
		if (data) {
			currInputs[inp.target.id] = data;
		} else {
			currInputs[inp.target.id] = null;
		}

		this.setState({ inputs: currInputs, edits: "modified" });
	}

	updateDate = (date) => {
		this.setState({ date: date });
		let data = firebase.database().ref("sectors/" + this.state.user.sector + "/data").child(date);
		data.on("value", snap => {
			let inputs = (snap.val() || {});
			this.setState({ inputs: { ...inputs }, serverData: { ...inputs }, edits: "saved"});
		});
	}

	loginFormSubmit = (form) => {
		const [formEmail, formPass] = [form[0], form[1]];
		firebase.auth().signInWithEmailAndPassword(formEmail, formPass)
			.then((userData) => {
				const userEmail = userData.user.email;
				const uid = userData.user.uid;
				const userName = userData.user.displayName;
				let userDBdata = firebase.database().ref("users").child(uid);
				userDBdata.on("value", snap => {
					const userSector = snap.child("sector").val();
					const userClaims = snap.child("claims").val();
					let categories = [];
					const sectorCategoriesDB = firebase.database().ref("sectors/" + userSector + "/categories");
					sectorCategoriesDB.once("value", snap => {
						categories = snap.val();

						this.setState({
							categories: categories,
							user: {
								id: userEmail,
								name: userName,
								sector: userSector,
								type: userClaims
							},
							pass: true,
							attemptLogin: ""
						});
						localStorage.setItem("user", userEmail);
						localStorage.setItem("name", userName);
						localStorage.setItem("sector", userSector);
						localStorage.setItem("type", userClaims);
					});
				});
			})
			.catch((error) => {
				// Handle Errors here.
				// const errorCode = error.code;
				let errorMessage = "";
				switch (error.code) {
				case "auth/wrong-password":
					errorMessage = "The password is invalid.";
					break;
				case "auth/user-not-found":
					errorMessage = "There is no user corresponding to this email. The user may have been deleted.";
					break;
				default:
					errorMessage = error.message;
				}

				this.setState({
					attemptLogin: errorMessage,
					categories: [],
					date: null,
					inputs: {},
					pass: false,
					user: { id: null }
				});
			});
		// Auth complete
	}

	verifyUser = () => {
		let actionCodeSettings = {
			url: 'https://song-records.web.app/',
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
		firebase.auth().currentUser.sendEmailVerification(actionCodeSettings).then(function () {
			alert("Check your email");
		}).catch(function (error) {
			alert("Unknown error:" + error);
		});
	}

	forgotSubmit = (emailAddress) => {
		let actionCodeSettings = {
			url: 'https://song-records.web.app/?email=' + emailAddress,
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
		firebase.auth().sendPasswordResetEmail(emailAddress, actionCodeSettings).then(function () {
			alert("Check your email");
		}).catch(function (error) {
			alert("Unknown error:" + error);
		});
	}

	signOut = (e) => {
		this.setState({ categories: [], date: null, inputs: {}, pass: false, user: { id: null } });
		localStorage.clear();
		firebase.auth().signOut();
	}

	render() {
		let stateIcon = "";
		switch (this.state.edits) {
		case "saved":
			stateIcon = "check";
			break;
		case "modified":
			stateIcon = "flag";
			break;
		case "saving":
			stateIcon = "time";
			break;
		default: stateIcon = "";
		}
		return (
			<Router>
				<div className="app " style={{paddingBottom: "1rem",}}>
					<Header className="row" />
					<Route
						exact path="/"
						render={props => (
							<React.Fragment >
								{
									this.state.pass !== false ?
										(
											<div className="container dataForm column col-8 col-md-12">
												<form method="post" onSubmit={this.saveData} >
													<DatePicker
														updateDate={this.updateDate}
														date={this.state.date}
														className="form-group"
													/>
													<div className="divider" />
													<Entries
														categories={this.state.categories}
														data={{...this.state.inputs}}
														onChange={this.inputUpdate}
														updateDate={this.updateDate}
													/>
													<div className="divider" />
													<div className="columns">
														<div className="column col-9 col-xs-12 col-ml-auto btn-group btn-group-block input-group">
															<input type="submit" value="Save" className="btn btn-primary btn-block" />
															<input type="button" value="Cancel" className="btn btn-secondary btn-block" onClick={this.undoEdits} />
															<span className="input-group-addon"><i className={"icon icon-" + stateIcon}></i></span>
														</div>
													</div>
												</form>
											</div>
										) : (
											<h2>Sign in to continue</h2>
										)
								}
							</React.Fragment>
						)}
					/>

					<Route
						path="/categories"
						render={props => (
							<React.Fragment>
								{
									this.state.pass !== false ?
										(
											<Categories
												categories={this.state.categories}
												user={this.state.user.type}
												del={this.del}
												addCategory={this.addCategory}
											/>
										) : (
											<h2>Sign in to continue</h2>
										)
								}
							</React.Fragment>
						)}
					/>

					<Route
						exact path="/account"
						render={props => (
							<Account
								loggedIn={this.state.pass}
								attemptLogin={this.state.attemptLogin}
								user={this.state.user}
								auth={firebase.auth().currentUser}
								loginFormSubmit={this.loginFormSubmit}
								signOut={this.signOut}
								verifyUser={this.verifyUser}
							/>
						)}
					/>
					<Route
						exact path="/account/forgot"
						render={props => (
							<ForgotPass
								forgotSubmit={this.forgotSubmit}
							/>
						)}
					/>
				</div>
			</Router>		
		);
	}
}

export default App;
