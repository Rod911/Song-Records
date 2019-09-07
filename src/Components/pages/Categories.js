import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	sortableContainer,
	sortableElement,
	sortableHandle,
} from 'react-sortable-hoc';
import { Link } from 'react-router-dom';

const arrayMove = (arr, old_index, new_index) => {
	if (new_index >= arr.length) {
		var k = new_index - arr.length + 1;
		while (k--) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
};

const DragHandle = sortableHandle(() =>
	<div className="tile-icon scrubber" style={{ "cursor": "grab" }}>
		<i className="icon icon-menu centered"></i>
	</div>
);

const SortableItem = sortableElement(({ value }) => {
	// check for loading screen
	return value.type === "div" ?
		value
		:
		<div className="tile tile-centered" >
			<DragHandle />
			{value}
		</div>
});

const SortableContainer = sortableContainer(({ children }) => {
	return <div className="sortable-list" >{children}</div>;
});

export class Categories extends Component {
	
	state = {
		newTitle : ""
	}

	onSortEnd = ({ oldIndex, newIndex }) => {

		this.setState({ categories: this.props.categories });
		this.setState(({ categories }) => ({
			categories: arrayMove(categories, oldIndex, newIndex),
		}));
		this.props.rearrange(this.state.categories);
	};
	
	onChange = (e) => this.setState({ newTitle: e.target.value });
	
	onSubmit = (e) => {
		e.preventDefault();
		if(this.state.newTitle !== ""){
			this.props.addCategory(this.state.newTitle);
			this.setState({newTitle: ""});
		}
	}
	render() {
		let list = this.props.categories;
		let categories = [];
		let user = this.props.user;
		if (list[0] === false){
			categories.push(<div className="loading loading-lg" key="loading" />);
		} else if (list[0] === null) { 
			categories.push(
				<div className="empty">
					<p className="empty-title h5">Category list is empty</p>
					<p className="empty-subtitle">Add some using above form</p>
				</div>
			);
		} else {
			list.forEach(item => {
				if (item !== null) {
					let div = (
						<>
							<div className="tile-content" key={item}>
								<div className="tile-title">
									{item}
								</div>
							</div>
							{
								(user === "coordinator" || user === "admin") && (
									<div className="tile-action">
										<button className="btn btn-link" onClick={() => { this.props.del(item) }}><i className="icon icon-delete" ></i></button>
									</div>
								)
							}
						</>
					);
					
					categories.push(div);
				}
			});
		}
		return (
			<div className="container categories column col-6 col-md-8 col-xs-12">
				{(user === "coordinator" || user === "admin") && (
					<form method="POST" onSubmit={this.onSubmit} className="">
						<div className="form-group input-group">
							<input
								className="form-input"
								type="text"
								name="categoryName"
								id="categoryName"
								placeholder="New Category"
								required
								value={this.state.newTitle}
								onChange={this.onChange}
							/>
							<input
								className="input-group-btn btn btn-primary"
								type="submit"
								value="Add"
							/>
						</div>
						{
							(this.props.duplicateCategoryAdded) && (
							<div className="toast toast-warning">
								That name is already taken
							</div>)
						}
						<div className="divider" />
					</form>
				)}

				<SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
						{categories.map((value, index) => {
							let key = "";
						try {
							key = value;
							key = value.props.children[0].key;
							
						} finally {
							return (
								<SortableItem key={key} index={index} value={value} />
							)
						}
						
					})}
				</SortableContainer>
				<Link className="btn btn-link btn-block" to="/songs" >Go to song list</Link>
			</div>
		);
	}
}

Categories.propTypes = {
	categories: PropTypes.array.isRequired,
	user: PropTypes.string.isRequired,
	del: PropTypes.func.isRequired,
	addCategory: PropTypes.func.isRequired,
	duplicateCategoryAdded: PropTypes.bool.isRequired,
	rearrange: PropTypes.func.isRequired
};
export default Categories;
