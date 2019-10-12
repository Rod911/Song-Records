import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/database';
import createBrowserHistory from '../../history';

export class AllSongs extends Component {
    constructor() {
        super();
        this.songsPerPage = 1;
    }

    state = {
        songs: [],
        songCount: 0,
        page: 0,
        loading: true,
        visibleList: [],
    }

    componentDidMount() {
        createBrowserHistory.listen(location => {
            const page = parseInt(location.pathname.split('/')[3]);
            this.setState({ page: page });
            this.loadPage(page);
        });
        const page = parseInt(createBrowserHistory.location.pathname.split('/')[3]);
        this.setState({ page: page })
        this.loadList();
    }

    loadList = () => {
        const sector = this.props.sector;
        const database = firebase.database();
        const songRef = database.ref("sectors/" + sector + "/songs");
        let list = [];
        songRef.once("value", snap => {
            list = Object.entries(snap.val()).map(song => {
                return ({
                    Name: song[1].Name,
                    Lyrics: song[1].Lyrics,
                    id: song[0]
                })
            });
            this.setState({ songs: list, songCount: list.length });
            this.loadPage(this.state.page);
        });
    }

    loadPage = (page) => {
        const start = Math.floor(page - 1 / this.songsPerPage);
        const visible = this.state.songs.slice(start, start + this.songsPerPage);
        this.setState({ visibleList: visible, loading: false });
    }

    render() {

        if (this.state.loading) {
            return (
                <div className="container column col-6 col-xl-12" key="empty" style={gridCard}>
                    <div className="" >
                        <div className="loading loading-lg"></div>
                    </div>
                </div>
            )
        }

        let songList = this.state.visibleList;

        if (songList.length === 0) {
            return (
                <div className="container column col-6 col-xl-12" key="empty" style={gridCard}>
                    <div className="empty" style={cardStyle}>
                        <div className="empty-icon">
                            <i className="icon icon-flag icon-4x"></i>
                        </div>
                        <div className="empty-title h5">Your library is empty</div>
                    </div>
                </div>
            )
        } else {
            const page = this.state.page
            const songCount = this.state.songCount
            const songsPerPage = this.songsPerPage;
            const maxPages = Math.ceil(songCount / songsPerPage);
            const isLastPage = maxPages === page;
            const isFirstPage = page === 1;
            const prevPage = page - 1;
            const nextPage = page + 1;

            let songDivs = [];
            songList.forEach(song => {
                let lyrics = "";
                if (song.Lyrics !== "") {
                    lyrics = song.Lyrics[0][0];
                }

                songDivs.push(
                    <div className="column col-6 col-xl-12" key={song.id} style={gridCard}>
                        <div className="card" style={cardStyle}>
                            <div className="card-header">
                                <div className="card-title h5 text-capitalize"> {song.Name} </div>
                            </div>
                            <div className="card-body" style={{ whiteSpace: "pre-line" }}>
                                {lyrics}
                            </div>
                            <div className="card-footer">
                                <Link to={"/songs/view/" + song.id} className="btn float-right">Open</Link>
                            </div>
                        </div>
                    </div>
                )
            });

            const pageLinks = [];
            for (let index = 1; index <= maxPages; index++) {
                const active = index === page ? "active" : "";
                pageLinks.push(
                    <li className={"page-item " + active} key={"page-" + index}>
                        <Link to={"/songs/all/" + index} onClick={() => { this.setState({ page: index }); this.loadPage(index) }} >{index}</Link>
                    </li>
                )
            }
            return (
                <div className="container column col-6 col-md-8 col-xs-12">
                    <div className="songList">
                        <div className="panel-header">
                            <div className="panel-title h3">All Songs</div>
                        </div>
                        <div className="panel-body columns" style={gridLayout}>
                            {songDivs}
                        </div>
                    </div>
                    {/* <div className="pagination p-centered">
                        <div className="btn-group btn-group-block">

                            <Link to={"/songs/all/" + prevPage} onClick={() => { this.setState({ page: prevPage }); this.loadPage(prevPage) }} className="btn btn-action btn-sm input-group-btn" disabled={isFirstPage}><i className="icon icon-arrow-left"></i></Link>
                            {
                                pageLinks
                            }
                            <Link to={"/songs/all/" + nextPage} onClick={() => { this.setState({ page: nextPage }); this.loadPage(nextPage) }} className="btn btn-action btn-sm input-group-btn" disabled={isLastPage}><i className="icon icon-arrow-right"></i></Link>
                        </div>
                    </div> */}
                    <ul className="pagination">
                        <li className="page-item">
                            <Link to={"/songs/all/" + prevPage} onClick={() => { this.setState({ page: prevPage }); this.loadPage(prevPage) }} className="" disabled={isFirstPage}>Prev</Link>
                        </li>
                        {pageLinks}
                        <li className="page-item">
                            <Link to={"/songs/all/" + nextPage} onClick={() => { this.setState({ page: nextPage }); this.loadPage(nextPage) }} className="" disabled={isLastPage}>Next</Link>
                        </li>
                    </ul>

                </div>
            )
        }
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


AllSongs.propTypes = {
    sector: PropTypes.string.isRequired,
}

export default AllSongs
