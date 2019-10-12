import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

import Categories from "./Components/pages/Categories";
import Account from "./Components/pages/Account";
import ForgotPass from './Components/pages/ForgotPass';
import Songs from './Components/pages/Songs';
import AddSong from './Components/pages/AddSong';
import ViewSong from './Components/pages/ViewSong';
import AllSongs from './Components/pages/AllSongs'

import Header from "./Components/Header";
import DatePicker from "./Components/DatePicker";
import Entries from "./Components/Entries";
import Footer from './Components/Footer';
import Lost from './Components/Lost';

import config from "./config";

import "spectre.css";
import "spectre.css/dist/spectre-icons.css";
import "./index.css";

import packageJson from '../package.json';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			categories: [false],
			inputs: {},
			songInDB: {},
			serverData: {},
			date: null,
			user: { id: null },
			pass: false,
			attemptLogin: "",
			edits: "saved",
			duplicateCategoryAdded: false,
			songAdded: { new: false, added: false, data: null, err: "" },
			theme: "",
			appVer: null,
			latestVer: null,
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
						let filteredArray = [null];
						if (snap.val()) {
							filteredArray = snap.val().filter(el => el);
						}
						this.setState({ categories: [...filteredArray] });

					});
				}
			} else {
				this.setState({ user: { id: null, name: "" } });
			}
		});
		this.setState({ theme: localStorage.getItem("theme") });
		database.ref('app-ver').on("value", snap => { this.setState({ latestVer: snap.val(), appVer: packageJson.version }) });
	}

	del = id => {
		let filteredArray = this.state.categories.filter(el => el && el !== id);
		this.setCategories(filteredArray);
	}

	addCategory = id => {
		if (this.state.categories.includes(id)) {
			this.setState({ duplicateCategoryAdded: true })
			setTimeout(() => this.setState({ duplicateCategoryAdded: false }), 3000)
			return
		} else
			this.setState({ duplicateCategoryAdded: false })

		const categories = [...this.state.categories, id];
		this.setCategories(categories);
	}

	setCategories = categories => firebase.database().ref("sectors/" + this.state.user.sector + "/categories").set(categories);

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

	undoEdits = () => this.setState({ inputs: { ...this.state.serverData }, edits: "saved" });

	clear = (id) => {
		// Delete uncategorised items
		let ref = firebase.database().ref("sectors/" + this.state.user.sector + "/data/" + this.state.date + "/" + id);
		ref.remove()
			.then(() => {
				// console.log("success");
			})
			.catch(() => {
				// console.log("failed");
			})
	}

	inputUpdate = (inp, data) => {
		let currInputs = this.state.inputs;
		let currDB = {};

		let target = inp.target.id;

		if (data) {
			currInputs[target] = data;
		} else {
			currInputs[target] = null;
		}

		currDB[target] = "loading";

		if (data === "") {
			currDB[target] = "";
		} else {
			const database = firebase.database();
			const rootRef = database.ref("sectors/" + this.state.sector + "/songs");
			let songsRef = rootRef.orderByChild("Name").equalTo(data.toLowerCase());
			songsRef.on("value", snap => {
				if (snap.exists()) {
					currDB[target] = "icon icon-check";
				} else {
					currDB[target] = "icon icon-flag";
				}
				this.setState({ songInDB: currDB });
			});
		}
		this.setState({ inputs: currInputs, songInDB: currDB, edits: "modified" });
	}

	updateDate = (date) => {
		this.setState({ date: date });
		let currDB = {};

		let data = firebase.database().ref("sectors/" + this.state.user.sector + "/data").child(date);
		data.on("value", snap => {
			let inputs = (snap.val() || {});
			this.setState({ inputs: { ...inputs }, serverData: { ...inputs }, edits: "saved" });

			Object.keys(inputs).forEach(key => {
				currDB[key] = "loading";
				let songsRef = firebase.database().ref("sectors/" + this.state.user.sector + "/songs").orderByChild("Name").equalTo(inputs[key].toLowerCase());
				songsRef.on("value", snap => {
					if (snap.exists()) {
						currDB[key] = "icon icon-check";
					} else {
						currDB[key] = "icon icon-flag";
					}
					this.setState({ songInDB: currDB })
				});
			});
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
			url: 'https://song-records.web.app/account?email=' + emailAddress,
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
			continueUrl: 'https://song-records.web.app/account'
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

	addSongSubmit = (title, lyrics) => {
		let lastId;
		firebase.database().ref("sectors/" + this.state.user.sector + "/songs").limitToLast(1)
			.once("value", snap => {
				lastId = snap.val() === null ? 100 : snap.val()[Object.keys(snap.val())[0]].id;
				const ref = firebase.database().ref("sectors/" + this.state.user.sector + "/songs").ref.push();
				let newObj = {
					Name: title,
					Lyrics: lyrics,
					id: lastId + 1
				}
				ref.set(newObj)
					.then(this.setState({ songAdded: { new: true, added: true, data: newObj, err: "" } }))
					.catch(e => this.setState({ songAdded: { new: true, added: false, data: newObj, err: e } }))
			});
	}

	changeTheme = (mode) => {
		this.setState({ theme: mode });
		localStorage.setItem("theme", mode);
	}

	dismissToast = () => {
		this.setState({ songAdded: { new: false } });
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

		const theme = this.state.theme || "light";

		return (
			<BrowserRouter>
				<div className={"app " + theme} style={{ paddingBottom: "1rem" }}>
					<Header className="row" />
					<Switch>
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
															data={{ ...this.state.inputs }}
															dbResult={{ ...this.state.songInDB }}
															onChange={this.inputUpdate}
															updateDate={this.updateDate}
															clear={this.clear}
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
													duplicateCategoryAdded={this.state.duplicateCategoryAdded}
													rearrange={this.setCategories}
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
									changeTheme={this.changeTheme}
									currentTheme={theme}
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

						<Route
							path="/songs/add"
							render={() => (
								<React.Fragment>
									{
										this.state.pass !== false ?
											(
												<AddSong
													addSongSubmit={this.addSongSubmit}
													songAdded={this.state.songAdded}
													dismissToast={this.dismissToast}
												/>
											) : (
												<h2>Sign in to continue</h2>
											)
									}
								</React.Fragment>
							)}
						/>

						<Route
							exact path={"/songs/all/:page"}
							render={(props) => {
								if (this.state.pass !== false) {
									return (
										<AllSongs
											sector={this.state.user.sector || ""}
										/>)
								} else {
									return (<h2>Sign in to continue</h2>)
								}
							}}
						/>

						<Route
							exact path="/songs"
							render={() => (
								<React.Fragment>
									{
										this.state.pass !== false ?
											(
												<Songs
													sector={this.state.user.sector || ""}
												/>
											) : (
												<h2>Sign in to continue</h2>
											)
									}
								</React.Fragment>
							)}
						/>

						<Route
							path="/songs/view/:songId"
							render={(props) => {
								const id = props.match.params.songId;
								if (this.state.pass !== false) {
									return (<ViewSong
										sector={this.state.user.sector || ""}
										id={id}
									/>)
								} else {
									return (<h2>Sign in to continue</h2>)
								}
							}}
						/>

						<Route component={Lost} />
					</Switch>
				</div>
				<Footer
					currentTheme={theme}
					appVer={this.state.appVer}
					latestVer={this.state.latestVer}
				/>
			</BrowserRouter>
		);
	}
}

export default App;
