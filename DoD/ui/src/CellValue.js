import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SuggestionList from './SuggestionList';

class CellValue extends Component {

    constructor(props) {
        super(props);
        this.rowId = props.rowId;
        this.columnId = props.columnId;
        this.cellKey = this.rowId + "-" + this.columnId;
        this.onVSChange = props.onVSChange;
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleUserClickingSuggestion = this.handleUserClickingSuggestion.bind(this);

        // to hold state of the actual cell, managed so we can change it with the suggestion cick event
        this.state = {
            cellValue: ""
        };
    }

    findSuggestions(input_text) {
        var payload = {};
        payload['input_text'] = input_text;
        var body = JSON.stringify(payload);

        console.log(payload);

        var response = fetch("http://127.0.0.1:5000/suggest_field", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: body
            })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log("SUCCESS");
                    var listResults = [];
                    var id = 0;
                    for (var key in result) {
                        var elementString = {};
                        elementString['id'] = id;
                        id = id + 1;
                        elementString['attributeName'] = key
                        elementString['originRelation'] = result[key];
                        listResults.push(elementString);
                    }
                    // Create new suggestion list, remove previous and place new
                    var el = <SuggestionList rowId={this.rowId} colId={this.columnId} suggestions={listResults} onSuggestionClick={this.handleUserClickingSuggestion}/>
                    ReactDOM.unmountComponentAtNode(document.getElementById('suggestions'));
                    ReactDOM.render(el, document.getElementById('suggestions'));
//                    ReactDOM.render(el, document.getElementById(this.cellKey));
                },
                (error) => {
                    console.log("ERROR: " + error);
                }
            )
        console.log(response);
    }

    handleUserClickingSuggestion(rowId, colId, newValue) {
        console.log("CellValue user clicked " + rowId + " cid: " + colId + " value: " + newValue);
        this.setState({
            cellValue: newValue
        });
        this.onVSChange(rowId, colId, newValue);
    }

    handleChange(event) {
        // Obtain value and set it in the state
        var newValue = event.target.value;
        this.setState({
            cellValue: newValue
        });

        this.onVSChange(this.rowId, this.columnId, newValue);
        // Also, if this is the header row, then we suggest options to complete
        if (this.rowId == 0) {
            this.findSuggestions(newValue);
        }
    }

    handleClick(event) {
        // remove any suggestion list that may have been rendered before
        ReactDOM.unmountComponentAtNode(document.getElementById('suggestions'));
    }


    render() {
        return (
            <td>
			    <input type="text" id={this.cellKey} name="ip-display"
                   pattern="[A-Za-z\s]+"
                   maxLength="30"
                   minLength="0"
                   value={this.state.cellValue}
                   onChange={this.handleChange}
                   onClick={this.handleClick}
                />
		    </td>
		)
    }

}

export default CellValue;