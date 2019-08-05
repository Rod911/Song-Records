import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class Header extends Component {
    switchTab = (currentPath) => {
        let navs = document.getElementById("navList");
        for (let nav of navs.children) {
            nav.classList.remove("active");
        }
        document.getElementById(currentPath).classList.add("active")
    }

    componentDidMount() {
        this.switchTab(window.location.pathname)
    }
   
    render() {
        
        let component = (
            <div className="header column" style={{ backgroundColor: "#19191B", color: "#F7F9FB"}}>
                <header>
                    <h1 style={{paddingTop: "1rem" }} >Recorder</h1>
                    <ul className="tab tab-block" id="navList">
                        <li className={"tab-item "} id="/">
                            <Link to="/" onClick={ ()=> this.switchTab("/")} >Home</Link>
                        </li>
                        <li className={"tab-item " } id="/categories">
                            <Link to="/categories"  onClick={ () => this.switchTab("/categories")}>Categories</Link>
                        </li>
                        <li className={"tab-item " } id="/account">
                            <Link to="/account" onClick={ () => this.switchTab("/account")}>Account</Link>
                        </li>
                    </ul>
                </header>
            </div>
        )
        return(component);
    }
}

export default Header