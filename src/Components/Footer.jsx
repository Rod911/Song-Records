import React, { Component } from 'react'

export class Footer extends Component {
    render() {
        return (
            <div style={footerStyle}>
                <p style={textStyle}>
                    Made with <span style={heart}>❤</span> by Malcolm Rodrigues
                </p>
                <p style={textStyle}>
                    <a className="tab-item" href="https://github.com/Rod911/Song-Records/issues">Feedback & Bug reports</a>
                </p>
            </div>
        )
    }
}

const footerStyle = {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#F7F8F9",
    padding: ".5rem",
    textAlign: "center"
}

const textStyle = {
    color: "#66758C",
    margin: "0 auto"
}

const heart = {
    color: "#e85600"
}
export default Footer
