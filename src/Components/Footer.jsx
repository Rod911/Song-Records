import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Footer extends Component {
    render() {
        return (
            <footer className={"card footer " + this.props.currentTheme}>
                <p className="text-grey card-subtitle" >
                    <a className="tab-item" target="_blank" rel="noopener noreferrer" href="https://github.com/Rod911/Song-Records/issues">Feedback & Bug reports</a> &copy; Malcolm Rodrigues
                </p>
            </footer>
        )
    }
}

Footer.propTypes = {
    currentTheme: PropTypes.string.isRequired
}

export default Footer
