import React, { Component } from "react";
import { Link } from "react-router-dom";
import { createBrowserHistory } from 'history';

class Header extends Component {
	switchTab = (currentPath) => {
		let navs = document.getElementById("navList");
		for (let nav of navs.children) {
			nav.classList.remove("active");
		}
		document.getElementById(currentPath).classList.add("active");
	}

	navigate(locationPath) {
		let path;
		switch (locationPath.split('/')[1]) {
			case "":
				path = "/";
				break;
			case "categories":
			case "songs":
				path = "/categories";
				break;
			case "account":
				path = "/account";
				break;
			default:
				return;
		}
		this.switchTab(path);
	}

	componentWillUnmount() {
		this.unlisten();
	}
	
	componentDidMount() {
		const history = createBrowserHistory();
		const location = history.location;

		this.unlisten = history.listen((location, action) => {
			// location is an object like window.location
			// console.log(action, location.pathname, location.state);
		});

		history.listen((location, action) => {
			this.navigate(location.pathname);
		});

		this.navigate(location.pathname);	
	}

	render() {

		let component = (
			<div className="header column">
				<header>
					<h1 style={{ paddingTop: "1rem" }} >Recorder</h1>
					<ul className="tab tab-block" id="navList">
						<li className={"tab-item "} id="/">
							<Link className="unfocus" to="/" onClick={() => this.switchTab("/")} >Home</Link>
						</li>
						<li className={"tab-item "} id="/categories">
							<Link className="unfocus" to="/categories" onClick={() => this.switchTab("/categories")}>Categories</Link>
						</li>
						<li className={"tab-item "} id="/account">
							<Link className="unfocus" to="/account" onClick={() => this.switchTab("/account")}>Account</Link>
						</li>
					</ul>
				</header>
			</div>
		);
		return (component);
	}
}

export default Header;