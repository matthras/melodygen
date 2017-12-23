import React, { Component } from 'react';

const PitchRangeBound = (props) => {
  const { fullPitchRange, pitchBound, boundType } = props;
  // if I adjust the upper bound, I still want to choose an upper bound, ranging from lower bound to end
  // if I adjust the lower bound, I still want to choose a lower bound, ranging from start to upper bound
  const adjustedPitchRange = (boundType==="upper") 
    ? fullPitchRange.slice(0,fullPitchRange.indexOf(pitchBound)) 
    : fullPitchRange.slice(fullPitchRange.indexOf(pitchBound))
  const adjustedPitchRangeOptions = adjustedPitchRange.map( (pitch) => {
    return(
      <option value={pitch} key={pitch}>
        {pitch}
      </option>
    )
  });
  return adjustedPitchRangeOptions
}

export class PitchRangeOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lowerPitch: 'c/4',
      upperPitch: 'c/5',
      pitchClasses: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#','b'],
      fullPitchRange: [], // Generated in componentWillMount()
    }
    this.adjustlowerPitch = this.adjustlowerPitch.bind(this);
    this.adjustupperPitch = this.adjustupperPitch.bind(this);
  }
  adjustlowerPitch(event) {
    const lowerPitch = event.target.value;
    this.setState({lowerPitch})
    const fullPitchRange = this.state.fullPitchRange;
    const workingPitchRange = fullPitchRange.slice(fullPitchRange.indexOf(lowerPitch), fullPitchRange.indexOf(this.state.upperPitch)+1)
    this.props.workingPitchRangeChange(workingPitchRange)
  }
  adjustupperPitch(event) {
    const upperPitch = event.target.value;
    this.setState({upperPitch})
    const fullPitchRange = this.state.fullPitchRange;
    const workingPitchRange = fullPitchRange.slice(fullPitchRange.indexOf(this.state.lowerPitch), fullPitchRange.indexOf(upperPitch)+1)
    this.props.workingPitchRangeChange(workingPitchRange)
  }

  componentWillMount() {
    let fullPitchRange = [];
    fullPitchRange.push('a/0');
    fullPitchRange.push('a#/0');
    fullPitchRange.push('b/0');
    for(let p = 1; p < 8; p++){
      for(let pc = 0; pc < this.state.pitchClasses.length; pc++){
        fullPitchRange.push(this.state.pitchClasses[pc]+'/'+p);
      }
    }
    fullPitchRange.push('c/8');
    this.setState({fullPitchRange})
  }
  render() {
    return (
     <div id="pitchRangeOptions">
      <b>Pitch Range</b> <br />
      <select onChange={this.adjustlowerPitch} value={this.state.lowerPitch}>
        <PitchRangeBound fullPitchRange={this.state.fullPitchRange} pitchBound={this.state.upperPitch} boundType="upper" />
      </select>
      to
      <select onChange={this.adjustupperPitch} value={this.state.upperPitch}>
        <PitchRangeBound fullPitchRange={this.state.fullPitchRange} pitchBound={this.state.lowerPitch} boundType="lower" />
      </select>
     </div> 
    )
  }
}