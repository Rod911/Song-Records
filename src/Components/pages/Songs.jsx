import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/database';
import history from '../../history';

String.prototype.capitalize = function () {
    return this.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};
export class Songs extends Component {

    constructor() {
        super();
        this.unlisten = history.listen(() => {
            this.searchUrl();
        });
    }

    state = {
        newTitle: "",
        songList: []
    }
    
    componentWillUnmount() {
        this.unlisten();
    }

    componentDidMount() { 
        this.sector = this.props.sector;
        this.searchUrl();
    }
    
    onChange = (e) => this.setState({ newTitle: e.target.value });

    onSubmit = e => {
        e.preventDefault();
        const term = this.state.newTitle.toLowerCase();
        history.push('/songs?q=' + term);
    }

    searchUrl = () => {
        const query = new URLSearchParams(history.location.search);
        const title = query.get('q') || "";
        this.setState({ newTitle: title });
        
        if (title !== "") {
            const database = firebase.database();
            const rootRef = database.ref("sectors/" + this.sector + "/songs");
            let songsRef = rootRef.orderByChild("Name").equalTo(title.toLowerCase());
            songsRef.on("value", snap => {
                if (snap.exists()) {
                    let list = Object.entries(snap.val()).map(song => {
                        return ({
                            Name: song[1].Name,
                            Lyrics: song[1].Lyrics,
                            id: song[0]
                        })
                    });
                    this.setState({ songList: list });
                } else {
                    this.setState({ songList: [{Name: "No results", Lyrics: "", id: 0 }] });
                }
            });
        } else {
            this.setState({ songList: [] });
        }
    }

    render() {
        let songList = [];
        if (this.state.songList !== null) { 
            songList = this.state.songList
        }
        let songDivs = [];
        songList.forEach(song => {
            let lyrics = "";
            if (song.Lyrics !== "") {
                lyrics = song.Lyrics[0][0].split('\n');
            }
            if (song.Name !== "No results") {
                songDivs.push(
                    <div className="column col-6 col-xl-12" key={song.id} style={ gridCard }>
                        <div className="card" style={ cardStyle }>
                            <div className="card-header">
                                <div className="card-title h5 text-capitalize"> {song.Name} </div>
                            </div>
                            <div className="card-body" style={{whiteSpace: "pre-line"}}>
                                {lyrics.map(line => <div key={lyrics.indexOf(line)}>{line}</div>)}
                            </div>
                            <div className="card-footer">
                                <Link to={"/songs/view/" + song.id} className="btn float-right">Open</Link>
                            </div>
                        </div>
                    </div>
                )
            } else {
                songDivs.push(
                    <div className="column col-6 col-xl-12" key="empty" style={ gridCard }>
                        <div className="empty" style={ cardStyle }>
                            <div className="empty-icon">
                                <i className="icon icon-flag icon-4x"></i>
                            </div>
                            <div className="empty-title h5">Did not find any matches</div>
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
                            value={this.state.newTitle.capitalize()}
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
                                <div className="panel-body columns" style={ gridLayout }>
                                    { songDivs }
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

const gridLayout = {
    paddingBottom: "0.8rem",
}

const gridCard = {
    padding: ".4rem"
}

const cardStyle = {
    boxShadow: "0 0.25rem 1rem rgba(48,55,66,.15)"
} 

Songs.propTypes = {
    sector: PropTypes.string.isRequired
};
export default Songs
