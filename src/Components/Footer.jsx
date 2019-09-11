import React, { Component } from 'react'

export class Footer extends Component {
    render() {
        return (
            <div className="card" style={footerStyle}>
                <p className="text-grey card-subtitle" style={textStyle}>
                    <a className="tab-item" target="_blank" rel="noopener noreferrer" href="https://github.com/Rod911/Song-Records/issues">Feedback & Bug reports</a> &copy; Malcolm Rodrigues 
                </p>
            </div>
        )
    }
}

const footerStyle = {
    backgroundColor: "#F7F8F9",
    padding: ".5rem",
    textAlign: "center"
}

const textStyle = {
    color: "#66758C",
    margin: "0 auto"
}
export default Footer
