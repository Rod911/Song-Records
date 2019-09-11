import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export class AddSong extends PureComponent {
	state = {
		title: "",
		lyrics: ""
	};

	onChange = (field, data) => this.setState({ [field]: data });

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
					<input
						className="form-input"
						type="text"
						name="title"
						id="title"
						value={this.state.title}
						placeholder="Song title"
						onChange={e => { this.onChange("title", e.target.value) }}
						required
					/>
					<textarea
						className="form-input"
						name="songLyrics"
						id="singLyrics"
						rows="10"
						value={this.state.lyrics}
						placeholder="Song Lyrics"
						onChange={e => { this.onChange("lyrics", e.target.value) }}
						required
					></textarea>
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
