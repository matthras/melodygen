import React, { Component } from 'react';

class MarkovChainRow extends Component {
  constructor(props) {
    super(props);
    this.handleMCchange = this.handleMCchange.bind(this);
  }
  handleMCchange(e) {
    const coordinates = e.target.getAttribute('data-markovchainref').split('');
    let newRow = this.props.matrixRow.slice(1);
    newRow[coordinates[1]] = parseFloat(e.target.value);
    this.props.onMCchange(newRow, coordinates[0]);
  } 
  render() {
    // Key indexes of each cell are set up so that when any value of the Markov Chain is changed, the key references the correct entry and no further number wrangling is needed. 
    const columns = this.props.matrixRow.map( (cell, index) =>
    (index===0) 
      ? <td key={"leftLabel"+this.props.rowIndex}>{cell}</td> 
      : <td key={this.props.rowIndex+","+(index-1)}>
          <input 
            key={this.props.rowIndex+","+(index-1)} 
            data-markovchainref={this.props.rowIndex.toString()+(index-1)} className="markovchainInput" 
            type="number" 
            min="0" 
            max="1" 
            step="0.01" 
            value={cell} 
            onChange={this.handleMCchange} >
          </input>
        </td>
    );    
    return (
      <tr>{columns}</tr>
    );
  }
}

export class MarkovChain extends Component {
  constructor(props) {
    super()
  }
  render() {
    const topLabels = this.props.pitchClasses.map( (label, index) => 
    <td key={"topLabel"+index}>{label}</td> 
    );
    // Concatenates the pitch class labels to the left of the Markov chain so that they're included in the table.
    const includeLeftLabels = this.props.matrix.map( 
      (row,index) => [this.props.pitchClasses[index]].concat(row)
    )
    const matrixRows = includeLeftLabels.map( (row,index) =>
      <MarkovChainRow 
        key={"markovchainRow"+index} 
        matrixRow={row} 
        rowIndex={index}
        onMCchange={this.props.onMCchange}
      />
    );
    return (
      <table>
        <tbody>
        <tr><td></td>{topLabels}</tr>
        {matrixRows}
        </tbody>
      </table>
    )
  } 
}