import React, { Component } from "react";
import PropTypes from "prop-types";
import "spectre.css/dist/spectre-icons.css";

class DatePicker extends Component{
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.date = this.props.date || this.nextSunday(new Date());
		this.props.updateDate(this.date);
	}

	nextSunday = (today) => {
		let daysLeft = 7 - today.getDay();
		if (daysLeft === 7) {
			if (today.getHours() < 12) {
				daysLeft = 0;
			}
		}
		let nextSunday = new Date(today.getTime());
		nextSunday.setTime(nextSunday.getTime() + daysLeft * 86400000);
		return nextSunday.toISOString().substring(0, 10);
	}
	
	onChange = (e) => {
		this.date = e.target.value;
		this.props.updateDate(this.date);
	}

	changeDate = (e) => {
		let newDate = new Date(this.date);
		switch (e.target.name) {
		case "prev":
			newDate.setTime(newDate.getTime() - 6.048e+8);
			break;
		case "next":
			newDate.setTime(newDate.getTime() + 6.048e+8);
			break;
		default: break;
		}
		this.date = newDate.toISOString().substring(0, 10);
		this.props.updateDate(this.date);
	}

	render(){
		return(
			<div className="datePicker form-horizontal">
				<div className="form-group">
					<div className="col-3 ">
						<label className="form-label" htmlFor="selectDate">Select Date</label>
					</div>
					<div className="col-9 ">
						<div className="input-group">
							<button className="btn" type="button" name="prev" id="prevBtn" onClick={this.changeDate} title="Previous week" >◀</button>
							<input className="form-input" type="date" name="selectDate" id="selectDate" onChange={this.onChange} value={this.date} required />
							<button className="btn" type="button" name="next" id="nextBtn" onClick={this.changeDate} title="Next week" >▶</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

DatePicker.propTypes = {
	updateDate: PropTypes.func.isRequired,
	date: PropTypes.string
};

export default DatePicker;