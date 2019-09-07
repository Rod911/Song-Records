import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export class AddSong extends PureComponent {
	state = {
		title: "",
		lyrics: "",
		songAdded: false
	};

	onChange = (field, data) => this.setState({ [field]: data });

	addSongSubmit = (e) => {
		e.preventDefault();
		if (this.state.lyrics !== "" && this.state.title !== "") {	
			this.props.addSongSubmit(this.state.title, this.state.lyrics);
			this.setState({title: "", lyrics: ""})
		}
	} 
	
	render() {
		const songAdded = this.props.songAdded;
        return (
			<div className="container column col-6 col-md-8 col-xs-12">
				<form method="post" onSubmit={this.addSongSubmit}>
					<h3>Add new song</h3>
					<input
						className="form-input"
						type="text"
						name="title"
						id="title"
						placeholder="Song title"
						onChange={e => { this.onChange("title", e.target.value) }}
						required
					/>
					<textarea
						className="form-input"
						name="songLyrics"
						id="singLyrics"
						rows="10"
						placeholder="Song Lyrics"
						onChange={e => { this.onChange("lyrics", e.target.value) }}
						required
					>{this.state.lyrics}</textarea>
					{/* <CKEditor
						editor={ClassicEditor}
						onInit={editor => {
							// fix config(remove image input)
						}}
						onChange={(event, editor) => {
							const data = editor.getData();
							this.onChange("lyrics", data)
						}}
						data={this.state.lyrics}
						required
					/> */}
					<input type="submit" value="Add" className="btn btn-block"/>
				</form>
				{/* toast songAdded */}
			</div>
        )
    }
}

AddSong.propTypes = {
	addSongSubmit: PropTypes.func.isRequired,
	songAdded: PropTypes.object.isRequired
}

export default AddSong
