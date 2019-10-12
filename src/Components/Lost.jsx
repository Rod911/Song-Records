import React, { Component } from 'react';
import { Link } from "react-router-dom";

export class Lost extends Component {
    render() {
        return (
            <div className="container column col-6 col-md-8 col-xs-12">
                <div className="col text-justify">
                    <h1>That's a 404. How did we get here?</h1>
                    <h4>Some things you can do:</h4>
                    <ol>
                        <li>
                            <Link to="/" >Go to home page</Link>
                        </li>
                        <li>
                            <Link to="/categories" >Manage categories</Link>
                        </li>
                        <li>
                            <Link to="/account" >Take a look at your account</Link>
                        </li>
                        <li>
                            <Link to="/songs" >Search your songs / hymns</Link>
                        </li>
                        <li>
                            <Link to="/songs/all/1" >Go through all your songs / hymns</Link>
                        </li>
                        <li>
                            <Link to="/songs/add" >Add a new song / hymn</Link>
                        </li>
                    </ol>
                    <h4>You weren't supposed to see this page.</h4>
                    <h4>If you aren't here intentionally then please <a href="https://github.com/Rod911/Song-Records/issues">send a report</a> as how you got here. 😅</h4>
                </div>
            </div>
        )
    }
}

export default Lost
