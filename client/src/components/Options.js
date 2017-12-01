// Component holding all the options that users can tweak to modify the settings for the score.
import React, { Component } from 'react';

function MarkovChainRow(props) {
  const columns = props.matrixRow.map( (cell) =>
    <td>{cell}</td>
  );
  return (
    <tr>{columns}</tr>
  );
}

function MarkovChain(props) {
  const matrixRows = props.matrix.map( (row) =>
    <MarkovChainRow matrixRow={row} />
  )
  return (
    <table>
      <tbody>
      {matrixRows}
      </tbody>
    </table>
  )  
}

class Options extends Component {
  constructor(props){
    super(props);
    this.handlenBarsChange = this.handlenBarsChange.bind(this);
    this.handlenBeatsChange = this.handlenBeatsChange.bind(this);
    this.handlebeatValueChange = this.handlebeatValueChange.bind(this);
  }

  handlenBarsChange(e){
    this.props.onnBarsChange(e.target.value);
  }

  handlenBeatsChange(e) {
    this.props.onnBeatsChange(e.target.value);
  }

  handlebeatValueChange(e) {
    this.props.onbeatValueChange(e.target.value);
  }

  render() {
    return(
      <div>
          Number of Bars: <input type="number" value={this.props.nBars} onChange={this.handlenBarsChange} /> <br />
          Time Signature: <br />
          Number of Beats: <input type="number" value={this.props.nBeats} onChange={this.handlenBeatsChange} /> <br />
          Beat Value: <select value={this.props.beatValue} onChange={this.handlebeatValueChange}>
            <option value="4">4</option>
          </select> <br />
          <MarkovChain matrix={this.props.markovChain} />
      </div>
    )
  } // beatValue additional options e.g. 2, 8, 16, etc. to be added later
        
}

export default Options;