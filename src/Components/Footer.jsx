import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Footer extends Component {
    render() {
        const ifLatest = (this.props.appVer === this.props.latestVer) ? <span className="footer-item d-invisible label">|</span> : (<span className="footer-item label label-success">Update Available</span>)
        return (
            <footer className={"card footer " + this.props.currentTheme}>
                <p className="text-grey card-subtitle" >
                    <a className="footer-item tab-item" target="_blank" rel="noopener noreferrer" href="https://github.com/Rod911/Song-Records/issues">
                        Feedback & Bug reports
                    </a>
                    <span className="footer-item">
                        &copy; Malcolm Rodrigues
                    </span>
                    {ifLatest}
                </p>
            </footer>
        )
    }
}

Footer.propTypes = {
    currentTheme: PropTypes.string.isRequired,
    appVer: PropTypes.string,
    latestVer: PropTypes.string
}

export default Footer
