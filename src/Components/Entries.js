import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as Loading } from './asset/Loading.svg';

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
            inputs.push(<Loading height="128px" key={"loading"}/>)
        } else {
            list.forEach(item => {
                let value = (data ? (data[item] ? data[item] : "") : "");
                let div = 
                (<div key={item}>
                    <label htmlFor={item}>{item}</label>
                    <input type="text" id={item} onChange={this.handleChange} value={value} />
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
                <div className="list">
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