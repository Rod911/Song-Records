import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DatePicker extends Component{
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.date = this.props.date || new Date().toISOString().substring(0, 10);
        this.props.updateDate(this.date);
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