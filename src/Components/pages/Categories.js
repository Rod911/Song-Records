import React, { Component } from 'react'
import { ReactComponent as Loading } from '../asset/Loading.svg';
import PropTypes from 'prop-types';

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
            categories.push(<Loading height="128px" key={"loading"}/>)
        } else {
            list.forEach(item => {
                let div = (<div key={item}>
                    <p>{item}</p>
                    {
                        user === "coordinator" && (
                            <button onClick={this.props.del.bind(this, list.indexOf(item))}>&times;</button>
                        )
                    }
                </div>);
                categories.push(div);
            });
        }
        return (
            <div className="categories">
                {
                    user === "coordinator" && (
                        <form method="POST" onSubmit={this.onSubmit} >
                            <input type="text" name="categoryName" id="categoryName" placeholder="New Category" required  value={this.state.newTitle} onChange={this.onChange} />
                            <input type="submit" value="Add"/>
                        </form>
                    )
                }
                {categories}
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
