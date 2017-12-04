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
      <div className="row">
        <div className="five columns">
          Number of Bars: <input type="number" value={this.props.nBars} onChange={this.handlenBarsChange} /> <br />
          Time Signature: <br />
          Number of Beats: <input type="number" value={this.props.nBeats} onChange={this.handlenBeatsChange} /> <br />
          Beat Value: <select value={this.props.beatValue} onChange={this.handlebeatValueChange}>
            <option value="4">4</option>
          </select>
        </div>
        <div className="seven columns">
          Markov Chain Instructions: <br />
          <ul>
            <li>All entries should be between 0 and 1.</li>
            <li>Each row must add up to 1.</li>
          </ul>
          In future there will be checks in place to ensure any edited Markov Chian adheres to the above rules.
          <MarkovChain matrix={this.props.markovChain} pitchClasses={this.props.pitchClasses} />
        </div>
      </div>
    )
  } // beatValue additional options e.g. 2, 8, 16, etc. to be added later
        
}

export default Options;