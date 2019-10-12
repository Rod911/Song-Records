import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/database';


export class ViewSong extends Component {
    state = {
        dbLoaded: false,
        songFound: false,
        songTitle: "",
        songLyrics: ""
    }

    componentDidMount() {
        const sector = this.props.sector;
        const id = this.props.id;
        const database = firebase.database();
        const songRef = database.ref("sectors/" + sector + "/songs/" + id);
        songRef.once("value", snap => {
            if (snap.exists()) {
                this.setState({ dbLoaded: true, songFound: true, songTitle: snap.val().Name, songLyrics: snap.val().Lyrics });
            } else {
                this.setState({ dbLoaded: true });
            }
        })

    }
    render() {
        let infoCard;
        if (this.state.dbLoaded) {
            if (this.state.songFound) {
                infoCard =
                    <div className="column col-6 col-sm-12" style={gridCard}>
                        <div className="card" style={cardStyle}>
                            <div className="card-header">
                                <div className="card-title h3 text-capitalize"> <u>{this.state.songTitle} </u></div>
                            </div>
                            <div className="card-body" style={{ whiteSpace: "pre-line", fontSize: "1rem" }}>
                                {this.state.songLyrics.map(page =>
                                    <div
                                        key={this.state.songLyrics.indexOf(page)}
                                        className="lyric-page-block mb-2 py-1">
                                        {page.map(stanza =>
                                            <div
                                                key={page.indexOf(stanza)}
                                                className="lyric-stanza-block mb-2 px-1 py-1">
                                                {stanza}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="card-footer">
                                <div className="btn-group btn-group-block" title="Under Construction ">
                                    <button className="btn btn-primary disabled">Edit</button>
                                    <button className="btn btn-error disabled">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
            } else {
                infoCard =
                    <div className="column col-6 col-sm-12" key="empty" style={gridCard}>
                        <div className="empty" style={cardStyle}>
                            <div className="empty-icon">
                                <i className="icon icon-stop icon-4x"></i>
                            </div>
                            <div className="empty-title h5">Could not find that song</div>
                            <div className="empty-subtitle">Song may have been deleted</div>
                        </div>
                    </div>
            }
        } else {
            infoCard =
                <div className="column col-6 col-sm-12" key="empty" style={gridCard}>
                    <div className="empty" style={cardStyle}>
                        <div className="loading loading-lg" key="loading" />
                    </div>
                </div>
        }
        return (
            <div className="container">
                {infoCard}
            </div>
        )
    }
}

// const gridLayout = {
//     paddingBottom: "0.8rem",
// }

const gridCard = {
    padding: ".4rem",
    margin: ".5rem auto"
}

const cardStyle = {
    boxShadow: "0 0.25rem 1rem rgba(48,55,66,.15)"
}

ViewSong.propTypes = {
    sector: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
}

export default ViewSong
