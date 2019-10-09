import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './addSong.css';

class LyricStanza extends Component {

	onChange = (pageIndex, stanzaIndex, data) => {
		const section = document.getElementById("section-" + pageIndex + "-" + stanzaIndex);
		section.style.height = 'auto';
		section.style.height = (section.scrollHeight + 2) + 'px';
		this.props.stanzaUpdate(pageIndex, stanzaIndex, data);
	};

	render() {
		const stanzaIndex = this.props.stanzaIndex;
		const pageIndex = this.props.pageIndex;
		return (
			<textarea
				className="form-input lyrics-section"
				name={"stanza-" + stanzaIndex}
				onChange={e => { this.onChange(pageIndex, stanzaIndex, e.target.value) }}
				id={"section-" + pageIndex + "-" + stanzaIndex}
				key={"stanza-" + pageIndex + "-" + stanzaIndex}
				placeholder={"Stanza " + (stanzaIndex + 1)}
				required
			></textarea>
		)
	}
}

LyricStanza.propTypes = {
	stanzaIndex: PropTypes.number.isRequired,
	pageIndex: PropTypes.number.isRequired,
	stanzaUpdate: PropTypes.func.isRequired
}

class LyricPage extends Component {
	state = {
		lyricStanzaCount: 1,
		pageIndex: -1
	};

	componentDidMount() {
		this.setState({ pageIndex: this.props.pageIndex });
	}

	addStanza = () => {
		this.setState({ lyricStanzaCount: this.state.lyricStanzaCount + 1 });
	}

	render() {
		const pageIndex = this.state.pageIndex;
		let stanzas = [];
		for (let index = 0; index < this.state.lyricStanzaCount; index++) {
			stanzas.push(
				<LyricStanza
					pageIndex={this.state.pageIndex}
					stanzaIndex={index}
					key={index}
					stanzaUpdate={this.props.stanzaUpdate}
				/>
			)
		}
		return <div
			className="lyric-page"
			key={"page-" + pageIndex}
		>
			<h4>Page {pageIndex + 1}</h4>
			<div className="stanzas">
				{stanzas}
			</div>
			<button className="btn btn-primary add-stanza" type="button" onClick={() => this.addStanza()} >Add section/stanza</button>
		</div>;
	}

}

LyricPage.propTypes = {
	pageIndex: PropTypes.number.isRequired,
	stanzaUpdate: PropTypes.func.isRequired
}

export class AddSong extends Component {

	state = {
		title: "",
		lyricsPageCount: 1,
		pages: [[""]]
	};

	onChange = (field, data) => {
		this.setState({ [field]: data });
		this.dismissToast();
	};

	addPage = () => {
		// let lyricsPages = [...this.state.lyricsPages, this.createPage(this.state.pageCount)];
		let pages = [...this.state.pages];
		pages.push([""]);
		this.setState({
			lyricsPageCount: (this.state.lyricsPageCount + 1),
			pages: [...pages]
		});
	}

	stanzaUpdate = (pageIndex, stanzaIndex, data) => {
		let pages = [...this.state.pages];
		pages[pageIndex][stanzaIndex] = data;
		this.setState({ pages: [...pages] })
	}

	addSongSubmit = (e) => {
		// e.preventDefault();
		if (this.state.title !== "") {
			this.props.addSongSubmit(this.state.title.toLowerCase(), this.state.pages);
			this.setState({
				title: "",
				lyricsPageCount: 0,
				pages: []
			},this.addPage);
		} else {
			return false;
		}
	}

	dismissToast = () => this.props.dismissToast()

	render() {
		const pageCount = this.state.lyricsPageCount;
		const pages = [];
		for (let i = 0; i < pageCount; i++) {
			pages.push(
				<LyricPage
					pageIndex={i}
					key={i}
					stanzaUpdate={this.stanzaUpdate}
				/>)
		}

		const songAdded = this.props.songAdded;
		let toastDiv;
		if (songAdded.new) {
			let toastMessage = "";
			let toastClass = "";
			if (songAdded.added) {
				toastMessage = "Song has been added";
				toastClass = "toast-success";
			} else {
				toastMessage = "Failed to add: " + songAdded.err;
				toastClass = "toast-error";
			}
			toastDiv = (
				<div>
					<div className="divider" />
					<div className={"toast " + toastClass} >
						<button className="btn btn-clear float-right" onClick={this.dismissToast}></button>
						{toastMessage}
					</div>
				</div>
			);
		} else {
			toastDiv = (<></>);
		}
		return (
			<div className="container column col-6 col-md-8 col-xs-12">
				<form method="post" onSubmit={this.addSongSubmit}>
					<h3>Add new song</h3>
					<div className="songContainer">
						<input
							className="titleInput form-input"
							type="text"
							name="title"
							id="title"
							value={this.state.title}
							placeholder="Song title"
							onChange={e => { this.onChange("title", e.target.value) }}
							required
						/>
						<div className="lyricsSection">
							{pages}
						</div>
					</div>
				</form>
				<div className="fabContainer">
					<button className="btn btn-primary add-page" onClick={this.addPage} >Add Page</button>
				</div>
				<input type="submit" value="Add" onClick={this.addSongSubmit} className="btn btn-block" />

				<div id="toastContainer">
					{toastDiv}
				</div>
			</div>
		)
	}
}


AddSong.propTypes = {
	addSongSubmit: PropTypes.func.isRequired,
	songAdded: PropTypes.object.isRequired,
	dismissToast: PropTypes.func.isRequired
}

export default AddSong
