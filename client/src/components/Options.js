// Component holding all the options that users can tweak to modify the settings for the score.
import React, { Component } from 'react';
import { MarkovChain } from './MarkovChain.js'

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
      <div id="Options">
      <div className="row">
        <div className="four columns">
          <b>Number of Bars</b> <br /> <input type="number" value={this.props.nBars} onChange={this.handlenBarsChange} /> <br />
        </div>
        <div className="four columns">
          <b>Time Signature</b> <br />
          Number of Beats: <input type="number" value={this.props.nBeats} onChange={this.handlenBeatsChange} /> <br />
          Beat Value: <select value={this.props.beatValue} onChange={this.handlebeatValueChange}>
            <option value="4">4</option>
          </select>
        </div>
        <div className="four columns">
          <b>Key Signature</b> <br />
          <select value={this.props.keySignature} onChange={this.handlekeySignatureChange}>
            <option value="Cmaj">C Major</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          Markov Chain Instructions: <br />
          <ul>
            <li>All entries should be between 0 and 1.</li>
            <li>Each row must add up to 1.</li>
          </ul>
          In future there will be checks in place to ensure any edited Markov Chain adheres to the above rules.
          <MarkovChain 
            matrix={this.props.markovChain} 
            pitchClasses={this.props.pitchClasses} 
            onMCchange={this.props.onMCchange} />
        </div>
      </div>
      </div>
    )
  } // beatValue additional options e.g. 2, 8, 16, etc. to be added later
        
}

export default Options;