import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './addSong.css';

export class AddSong extends Component {
	state = {
		title: "",
		lyrics: []
	};

	onChange = (field, data) => {
		this.setState({ [field]: data })
		this.dismissToast();
	};

	addSongSubmit = (e) => {
		e.preventDefault();
		if (this.state.lyrics !== "" && this.state.title !== "") {	
			this.props.addSongSubmit(this.state.title, this.state.lyrics);
			this.setState({title: "", lyrics: ""})
		}
	}
	
	dismissToast = () => {
		this.props.dismissToast();
	}

	componentDidMount() {
		document.getElementById("lyricsSection").addEventListener("input", e => {
			console.log(e);
		})
	}
	
	render() {
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
						{/* <textarea
							className="form-input"
							name="songLyrics"
							id="singLyrics"
							rows="10"
							value={this.state.lyrics}
							placeholder="Song Lyrics"
							onChange={e => { this.onChange("lyrics", e.target.value) }}
							required
						></textarea> */}
						<div className="lyricsInput" onClick={() => { document.querySelectorAll(".lyricsSection")[document.querySelectorAll(".lyricsSection").length - 1].focus() }}>
							<div className="lyricsSection" id="lyricsSection" contentEditable>
								<div><br/></div>
							</div>
						</div>
					</div>
					<div className="fabContainer">
						<button role="button" className="btn btn-primary"><i className="icon icon-plus"></i></button>
					</div>
					<input type="submit" value="Add" className="btn btn-block"/>
				</form>

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
	dismissToast:PropTypes.func.isRequired
}

export default AddSong
