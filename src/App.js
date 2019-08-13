import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';

import Account from './Components/pages/Account';
import Header from './Components/Header';
import DatePicker from './Components/DatePicker';
import Entries from './Components/Entries';
import Categories from './Components/pages/Categories';

import config from './config';

import 'spectre.css'
import 'spectre.css/dist/spectre-icons.css';

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
		let database = firebase.database();
		let rootRef = database.ref("sectors");
		let userid = localStorage.getItem('user');
		if (userid) {
			let sector = localStorage.getItem('sector');
			let name = localStorage.getItem('name');
			let type = localStorage.getItem('type');
			this.setState({ user: { id: userid, name: name, sector: sector, type: type }, pass: true })
			let categoriesRef = rootRef.child(sector + "/categories");
			categoriesRef.on("value", snap => {
				this.setState({ categories: snap.val() });
			});
		}
	}

	del = (id) => {
		let ref = firebase.database().ref("sectors/" + this.state.user.sector + "/categories/" + id);
		ref.remove()
			.then(() => {
				// console.log("success");
			})
			.catch(() => {
				// console.log("failed");
			})
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
			})
		this.setState({ edits: "saving" })
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
		this.setState({ date: date })
		let data = firebase.database().ref("sectors/" + this.state.user.sector + "/data").child(date);
		data.on("value", snap => {
			let inputs = (snap.val() || {})
			this.setState({ inputs: { ...inputs }, serverData: { ...inputs } })
		})
	}

	loginFormSubmit = (form) => {
		let firestore = firebase.firestore();
		let usersRef = firestore.collection("users");
		let query = usersRef.where("id", "==", form[0]);
		query.get().then(snapshot => {
			snapshot.forEach(doc => {
				if (doc.id) {
					let user = doc.data();
					if (user.pass === form[1]) {
						// Logged in
						let data = firebase.database().ref("sectors/" + user.sector + "/categories");
						data.on("value", snap => {
							this.setState({ categories: snap.val(), user: { id: user.id, name: user.name, sector: user.sector, type: user.type }, pass: true, attemptLogin: "" });
						})
						localStorage.setItem('user', user.id);
						localStorage.setItem('name', user.name);
						localStorage.setItem('sector', user.sector);
						localStorage.setItem('type', user.type);
						return;
					} else {
						this.setState({ attemptLogin: "Incorrect password!", categories: [], date: null, inputs: {}, pass: false, user: { id: null } });
					}
				}
			});
			if (snapshot.docs.length === 0) {
				this.setState({ attemptLogin: "User doesn't exist, check email id", categories: [], date: null, inputs: {}, pass: false, user: { id: null } })
			}
		});
	}

	clear = (id) => {
		let ref = firebase.database().ref("sectors/" + this.state.user.sector + "/data/" + this.state.date + "/" + id);
		ref.remove()
			.then(() => {
				// console.log("success");
			})
			.catch(() => {
				// console.log("failed");
			})
	}

	signOut = (e) => {
		this.setState({ categories: [], date: null, inputs: {}, pass: false, user: { id: null } })
		localStorage.clear();
	}

	render() {
		let state = "";
		switch (this.state.edits) {
			case "saved":
				state = "check";
				break;
			case "modified":
				state = "flag";
				break;
			case "saving":
				state = "time";
				break;
			default: state = "";
		}
		return (
			<Router>
				<div className="app " style={{paddingBottom: "1rem",}}>
					<Header
						className="row"
					/>
					<Route exact path="/" render={props => (
						<React.Fragment >
							{
								this.state.pass !== false ?
									(
										<div className="container dataForm column col-8 col-md-12">
											<form method="post" onSubmit={this.saveData} >
												<DatePicker
													pickDate={this.pickDate}
													updateDate={this.updateDate}
													date={this.state.date}
													className="form-group"
												/>
												<div className="divider" />
												<Entries
													categories={this.state.categories}
													clear={this.clear}
													data={this.state.serverData}
													onChange={this.inputUpdate}
													updateDate={this.updateDate}
												/>
												<div className="divider" />
												<div className="columns">
													<div className="column col-9 col-xs-12 col-ml-auto btn-group btn-group-block input-group">
														<input type="submit" value="Save" className="btn btn-primary btn-block" />
														<input type="button" value="Cancel" className="btn btn-secondary btn-block" onClick={this.undoEdits} />
														<span className="input-group-addon"><i className={"icon icon-" + state}></i></span>
													</div>
												</div>
											</form>
										</div>
									) : (
										<h2>Sign in to continue</h2>
									)
							}
						</React.Fragment>
					)} />


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
						path="/account"
						render={props => (
							<Account
								loggedIn={this.state.pass}
								attemptLogin={this.state.attemptLogin}
								user={this.state.user}
								loginFormSubmit={this.loginFormSubmit}
								signOut={this.signOut}
							/>
						)} />
				</div>
			</Router>		
		);
	}
}

export default App;
