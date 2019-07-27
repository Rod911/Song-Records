import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        console.log({ today, nextSunday });
        return nextSunday.toISOString().substring(0, 10)
    }
    
    onChange = (e) => {
        this.date = e.target.value;
        this.props.updateDate(this.date);
    }
    render(){
        return(
            <div className="datePicker">
                <label htmlFor="selectDate">Select Date</label>
                <input type="date" name="selectDate" id="selectDate" onChange={this.onChange} value={this.date} required />
            </div>
        )
    }
}

DatePicker.propTypes = {
    updateDate: PropTypes.func.isRequired
}

export default DatePicker;