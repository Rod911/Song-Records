import React, { Component } from 'react'
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/database';

export class AllSongs extends Component {
    state = {
        songs: [],
    }

    componentDidMount() {
        const sector = this.props.sector;
        const database = firebase.database();
        const songRef = database.ref("sectors/" + sector + "/songs");
        songRef.on("value", snap => {
            // const songs = [...this.state.songs];
            // const songListItem
            console.log(snap.val())
        });
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

AllSongs.propTypes = {
    sector: PropTypes.string.isRequired
}

export default AllSongs
