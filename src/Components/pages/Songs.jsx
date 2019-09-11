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
            let lyrics = song.Lyrics.substring(0, 80);
            if (song.Name !== "No results") {
                songDivs.push(
                    <div className="column col-6 col-xl-12" key={song.id} style={{ padding: ".4rem"}}>
                        <div className="card" style={{ boxShadow: "0 0.25rem 1rem rgba(48,55,66,.15)"}}>
                            <div className="card-header">
                                <div className="card-title h5"> {song.Name} </div>
                            </div>
                            <div className="card-body" style={{whiteSpace: "pre-line"}}>
                                {lyrics}
                            </div>
                            <div className="card-footer">
                                <Link to={"/songs/view/" + song.id} className="btn float-right">Open</Link>
                            </div>
                        </div>
                    </div>
                )
            } else {
                songDivs.push(
                    <div className="column col-6 col-xl-12" key="empty" style={{ padding: ".4rem" }}>
                        <div className="empty" style={{ boxShadow: "0 0.25rem 1rem rgba(48,55,66,.15)" }}>
                            <div className="empty-icon">
                                <i className="icon icon-flag icon-4x"></i>
                            </div>
                            <div className="empty-title h5">Did not match any titles</div>
                        </div>
                    </div>
                )
            }
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
                            <div className="empty">
                                <div className="empty-icon">
                                    <i className="icon icon-search icon-4x"></i>
                                </div>
                                <div className="empty-title h5">Search something</div>
                            </div>
                        ) : (

                            <div className = "panel" >
                                <div className = "panel-header">
                                    <div className = "panel-title h5">Results</div>
                                </div>
                                <div className="panel-body columns" style={{paddingBottom: "0.8rem"}}>
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
