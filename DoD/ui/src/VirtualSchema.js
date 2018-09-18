import React, { Component } from 'react';
import VirtualSchemaControl from './VirtualSchemaControl';
import CellValue from './CellValue';


function TableRow(props) {
	var row_columns = [];
	for (var j = 0; j < props.columns; j++) {
		row_columns.push(<CellValue key={j} rowId={props.rowId} columnId={j} onVSChange={props.onVSChange}/>);
	}
	return (
		<tr>{row_columns}</tr>
	)
}

function Table(props) {

	var table_rows = [];
	// - 1 because a row is always reserved for the header
	for (var i = 1; i < props.rows; i++) {
		table_rows.push(<TableRow key={i} rowId={i} columns={props.columns} onVSChange={props.onVSChange}/>);
	}
	
	return (
		<table>
			<thead>
				<TableRow key={0} rowId={0} columns={props.columns} onVSChange={props.onVSChange}/>
			</thead>
			<tbody>
				{table_rows}
			</tbody>
		</table>
	)
}

class VirtualSchema extends React.Component {
	constructor(props) {
		super(props);
		
		this.addRow = this.addRow.bind(this);
		this.removeRow = this.removeRow.bind(this);
		this.addColumn = this.addColumn.bind(this);
		this.removeColumn = this.removeColumn.bind(this);
		this.changeVS = this.changeVS.bind(this);
		this.findView = this.findView.bind(this);

		this.state = {
			rows: 3,
			columns: 3,
			virtualSchemaValues: {} // key: "i"-"j" -> value
		};
	}

	changeVS(rowId, columnId, newValue) {
	    console.log(this);
	    this.setState((prevState) => {
            console.log(prevState);
            var cellId = rowId + "-" + columnId;
            prevState.virtualSchemaValues[cellId] = newValue;
            return {virtualSchemaValues: prevState.virtualSchemaValues};
	    });
	}

	addRow() {
		this.setState((prevState) => {
				return {rows: prevState.rows + 1};
			}
		);
	}
	
	addColumn() {
		this.setState((prevState) => {
				return {columns: prevState.columns + 1};
			}
		);
	}
	
	removeRow() {
		this.setState((prevState) => {
				if (prevState.rows - 1 < 0) {
					return {rows: 0};
				} else {
					return {rows: prevState.rows - 1};
				}
			}
		);
	}
	
	removeColumn() {
		this.setState((prevState) => {
				if (prevState.columns - 1 < 1) {
					return {columns: 1};
				} else {
					return {columns: prevState.columns - 1};
				}
			}
		);
	}

	findView() {
	    var vsDefinition = this.state.virtualSchemaValues;
        console.log(vsDefinition);

        var payload = {};
        payload['payload'] = JSON.stringify(vsDefinition);
        var body = JSON.stringify(payload);

        var response = fetch("http://127.0.0.1:5000/testpost", {
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
                    console.log("SUCCESS: " + JSON.stringify(result));
                },
                (error) => {
                    console.log("ERROR: " + error);
                }
            )
        console.log(response);
	}

	render() {
		return (
			<div className="VirtualSchemaTable">

				<Table rows={this.state.rows} columns={this.state.columns} onVSChange={this.changeVS} />
				<VirtualSchemaControl add_row={this.addRow}
									  remove_row={this.removeRow}
									  add_column={this.addColumn}
									  remove_column={this.removeColumn}
									  find_view={this.findView}
				/>
			</div>
		)
	}
	
}

export default VirtualSchema;