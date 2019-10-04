import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Footer extends Component {
    render() {
        return (
            <div className="card" style={this.props.currentTheme === "dark" ? footerDark : footerLight}>
                <p className="text-grey card-subtitle" style={textStyle}>
                    <a className="tab-item" target="_blank" rel="noopener noreferrer" href="https://github.com/Rod911/Song-Records/issues">Feedback & Bug reports</a> &copy; Malcolm Rodrigues
                </p>
            </div>
        )
    }
}

const footerLight = {
    backgroundColor: "#F7F8F9",
    padding: ".5rem",
    textAlign: "center"
}

const footerDark = {
    backgroundColor: "#121212",
    padding: ".5rem",
    textAlign: "center",
    borderLeft: "0",
    borderRight: "0",
    borderColor: "#f0f8ff36",
    borderRadius: "0",
}

const textStyle = {
    color: "#66758C",
    margin: "0 auto"
}

Footer.propTypes = {
    currentTheme: PropTypes.string.isRequired
}

export default Footer
