// Component holding all the options that users can tweak to modify the settings for the score.
import React, { Component } from 'react';

// Props received:
// nPitchClasses = # of Pitch Classes (integer)
// pitchClasses = the notes/pitch classes considered (array of strings)

class Options extends Component {
  constructor(props){
    super(props);
    this.handlenBarsChange = this.handlenBarsChange.bind(this);
  }

  handlenBarsChange(e){
    this.props.onnBarsChange(e.target.value);
  }

  render() {
      return(
          <div>
              Number of Bars: <input type="number" value={this.props.nBars} onChange={this.handlenBarsChange} />
          </div>
      )
  }
        
}

export default Options;