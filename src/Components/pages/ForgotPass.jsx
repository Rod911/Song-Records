import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

export class ForgotPass extends Component {
    submit = (e) => {
        e.preventDefault();
        this.props.forgotSubmit(e.target['email'].value);
        return false;
    }
    
    render() {
        return (
            <div className="container forgotForm col-6 col-sm-12">
                <form method="POST" onSubmit={this.submit} >
                    <fieldset>
                        <legend>Forgot Password</legend>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email" >Email</label>
                            <input className="form-input" type="email" id="email" name="email" placeholder="Enter email here" required autoComplete="email" />
                        </div>
                        <div className="form-group">
                            <input className="btn btn-block" type="submit" value="Submit" />
                        </div>
                        <div className="form-group">
                            <Link to="/account" className="btn btn-link btn-block" >Go to login</Link>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }
}

ForgotPass.propTypes = {
    forgotSubmit: PropTypes.func.isRequired
}

export default ForgotPass
