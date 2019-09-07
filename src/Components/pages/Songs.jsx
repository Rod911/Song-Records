import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/database';

export class Songs extends Component {
    state = {
        newTitle: "",
        songList: []
    }

    componentDidMount() { 
        this.sector = this.props.sector;
    }
    
    onChange = (e) => this.setState({ newTitle: e.target.value });

    onSubmit = e => {
        e.preventDefault();
        const term = this.state.newTitle;
        this.setState({ newTitle: "" });
        if (term !== "") {
            const database = firebase.database();
            const rootRef = database.ref("sectors/" + this.sector + "/songs");
            let songsRef = rootRef.orderByChild("Name").equalTo(term.toLowerCase());
            songsRef.on("value", snap => {
                if (snap.val() !== null) {
                    this.setState({ songList: Object.values(snap.val()) });
                } else {
                    this.setState({ songList: [{Name: "No results", Lyrics: "", id: 0 }] });
                }
            });
        }
    }

    render() {
        let songList = [];
        if (this.state.songList !== null) { 
            songList = this.state.songList
        }
        let songDivs = [];
        Object.values(songList).forEach(song => {
            songDivs.push(
                <div className="tile" key={song.id}>
                    <div className="tile-icon"></div>
                    <div className="tile-content">
                        <p className="tile-title text-bold"> {song.Name} </p>
                        <div className="tile-subtitle"> {song.Lyrics.substring(0, 40)} </div>
                    </div>
                </div>
            )
        });

        return (
            <div className="container column col-6 col-md-8 col-xs-12">
                <h3>Song Search <ruby><rt>(Under Construction)</rt></ruby></h3>
                <form method="POST" onSubmit={this.onSubmit} >

                    <div className="form-group input-group">
                        <input
                            className="form-input"
                            type="text"
                            name="searchInput"
                            id="searchInput"
                            placeholder="Search Songs"
                            required
                            value={this.state.newTitle}
                            onChange={this.onChange}
                            autoComplete="off"
                        />
                        <input
                            className="input-group-btn btn btn-primary"
                            type="submit"
                            value="Search"
                        />
                    </div>
                </form>
                <div className="songList">
                    {   
                        songList.length === 0 ? (
                            <div className="empty"></div>
                        ) : (

                            <div className = "panel" >
                                <div className = "panel-header">
                                    <div className = "panel-title h6">Results</div>
                                </div>
                                <div className="panel-body">
                                    {songDivs}
                                </div>
                            </div >
                        )
                    }
                </div>
                <div className="btn-group btn-group-block">
                    <Link className="btn" to="/songs/add">Add new</Link>
                    <Link className="btn" to="/songs/all">See all</Link>
                </div>  
            </div>
        )
    }
}

Songs.propTypes = {
    sector: PropTypes.string.isRequired
};
export default Songs
