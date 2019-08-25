import React, { Component } from "react";
import PropTypes from "prop-types";

class Entries extends Component {
	
	handleChange = (e) => {
		const text = e.target.value;
		this.props.onChange(e, text);
	}

	render(){
		let list = this.props.categories;
		let data = this.props.data;
		let inputs = [];
		let uncategorisedList = [];
		let uncategorisedUL;

		if(list.length === 0){
			inputs.push(<div className="loading loading-lg" key="loading" />);
		} else {
			list.forEach(item => {
				let value = data[item] || "";
				// let value = (data ? (data[item] ? data[item] : "") : "");
				let div = 
					(<div className="form-group" key={item}>
						<div className="col-3 col-md-3 col-sm-3 col-xs-12">
							<label className="form-label" htmlFor={item}>{item}</label>
						</div>
						<div className="col-9 col-md-9 col-sm-9 col-xs-12">
							<input className="form-input" type="text" id={item} onChange={this.handleChange} value={value} />
						</div>
					</div>);
				inputs.push(div);
			});
			if(data){
				let dataArray = Object.entries(data);
				let uncategorised = dataArray.filter(obj => {
					return !(list.includes(obj[0]));
				});
				uncategorisedList = uncategorised.map(obj => {
					return(
						<div key={obj[0]} className="col-12 columns" style={{paddingTop:"12px", marginLeft:"4px"}} >
							<div className="column col-3 col-md-3 col-sm-3 col-xs-12">
								<p style={{ marginBottom: "16px" }}> {obj[0]} </p>
							</div>
							<div className="column columns col-9 col-md-9 col-sm-9 col-xs-12">
								<div className="column col-11">
									<p style={{ marginBottom: "16px" }}> {obj[1]} </p>
								</div>
								<div className="column col-1">
									<button type="button" className="btn btn-secondary btn-sm" key={obj[0]} onClick={this.props.clear.bind(this, obj[0])}><i className="icon icon-cross"></i></button>
								</div>
							</div>
						</div>
					);
				});
				
				uncategorisedUL = (
					(uncategorisedList.length > 0) ? (
						<div className="form-horizontal" >
							<div className="divider"></div>
							<h4>Uncategorised</h4>
							<div className="uncategorised-list form-group bg-secondary" style={{ marginLeft: "0.5 rem"}} >
								{uncategorisedList}
							</div>
						</div>
					)
						: (null)
				);
			}
		}

		return (
			<React.Fragment>
				<div className="form-horizontal">
					{inputs}
				</div>
				{uncategorisedUL}
			</React.Fragment>
		);
	}
}

Entries.propTypes = {
	onChange: PropTypes.func.isRequired,
	categories: PropTypes.array,
	data: PropTypes.object,
	clear: PropTypes.func
};

export default Entries;