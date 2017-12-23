// Component holding all the options that users can tweak to modify the settings for the score.
import React, { Component } from 'react';
import { MarkovChain } from './MarkovChain.js';
import { KeySignatureOptions } from './KeySignatureOptions.js';
import { PitchRangeOptions } from './PitchRangeOptions.js';

class Options extends Component {
  constructor(props){
    super(props);
    this.nBarsChange = this.nBarsChange.bind(this);
    this.nBeatsChange = this.nBeatsChange.bind(this);
    this.beatValueChange = this.beatValueChange.bind(this);
  }

  nBarsChange(e){
    this.props.nBarsChange(e.target.value);
  }

  nBeatsChange(e) {
    this.props.nBeatsChange(e.target.value);
  }

  beatValueChange(e) {
    this.props.beatValueChange(e.target.value);
  }

  render() {
    return(
      <div id="Options">
      <div className="row">
        <div className="four columns">
          <b>Number of Bars</b> <br /> 
            <input 
              type="number" 
              value={this.props.nBars} 
              onChange={this.nBarsChange} 
              min="0"
              step="1"
            /> <br />
        </div>
        <div className="four columns">
          <b>Time Signature</b> <br />
          Number of Beats: 
            <input 
              type="number" 
              value={this.props.nBeats} 
              onChange={this.nBeatsChange}
              min="1"
              max="16"
              step="1" 
            /> <br />
          Beat Value: <select value={this.props.beatValue} onChange={this.beatValueChange}>
            <option value="4">4</option>
          </select>
        </div>
        <div className="four columns">
          <KeySignatureOptions />
          <PitchRangeOptions 
            fullPitchRange={this.props.fullPitchRange}
            workingPitchRangeChange={this.props.workingPitchRangeChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <MarkovChain 
            matrix={this.props.markovChain} 
            workingPitchRange={this.props.workingPitchRange} 
            markovchainChange={this.props.markovchainChange} />
        </div>
      </div>
      </div>
    )
  } // beatValue additional options e.g. 2, 8, 16, etc. to be added later
        
}

export default Options;