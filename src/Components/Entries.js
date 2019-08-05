import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Entries extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    
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
            inputs.push(<div className="loading loading-lg" key="loading" />)
        } else {
            list.forEach(item => {
                let value = (data ? (data[item] ? data[item] : "") : "");
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
                })
                uncategorisedList = uncategorised.map(obj => {
                    return(
                    <li key={obj[0]}>
                        <p>{obj[0]} : {obj[1]}</p>
                        <button type="button" key={obj[0]} onClick={this.props.clear.bind(this, obj[0])}>&times;</button> 
                    </li>)
                })
                
                uncategorisedUL = (
                    (uncategorisedList.length > 0) ? (
                        <div>
                            <h4>Uncategorised</h4>
                            <ul className="uncategorised">
                                {uncategorisedList}
                            </ul>
                        </div>
                    )
                    : ("")
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
    clear: PropTypes.func.isRequired
}

export default Entries;