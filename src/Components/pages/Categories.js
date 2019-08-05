import React, { Component } from 'react'
import PropTypes from 'prop-types';
import 'spectre.css/dist/spectre-icons.css';

export class Categories extends Component {
    
    state = {
        newTitle : ""
    }
    
    onChange = (e) => this.setState({newTitle: e.target.value});
    onSubmit = (e) => {
		e.preventDefault();
		if(this.state.newTitle !== ""){
			this.props.addCategory(this.state.newTitle);
			this.setState({newTitle: ''})
		}
	}
    render() {
        let list = this.props.categories;
        let categories = [];
        let user = this.props.user;

        if(list.length === 0){
            categories.push(<div className="loading loading-lg" key="loading" />)
        } else {
            list.forEach(item => {
                let div = (<div className="tile tile-centered" key={item}>
                    <div className="tile-icon">
                        <i className="icon icon-bookmark centered"></i>
                    </div>
                    <div className="tile-content">
                        <div className="tile-title">
                            {item}
                        </div>
                    </div>
                    {
                        user === "coordinator" && (
                            <div className="tile-action">
                                <button className="btn btn-link" onClick={this.props.del.bind(this, list.indexOf(item))}><i className="icon icon-delete" ></i></button>
                            </div>
                        )
                    }
                </div>);
                categories.push(div);
            });
        }
        return (
            <div className="container categories column col-6 col-md-8 col-xs-12">
                {
                    user === "coordinator" && (
                        <form method="POST" onSubmit={this.onSubmit} className="" >
                            <div className="form-group input-group">
                                <input className="form-input" type="text" name="categoryName" id="categoryName" placeholder="New Category" required  value={this.state.newTitle} onChange={this.onChange} />
                                <input className="form-input btn btn-primary ml-1" type="submit" value="Add"/>
                            </div>
                            <div className="divider" />
                        </form>
                    )
                }
                <div className="">
                    {categories}
                </div>
            </div>
        )
    }
}
Categories.propTypes = {
    categories: PropTypes.array.isRequired,
    user: PropTypes.string.isRequired,
    del: PropTypes.func.isRequired,
    addCategory: PropTypes.func.isRequired
}
export default Categories
