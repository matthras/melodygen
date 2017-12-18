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
      lowerBound: 'c/4',
      upperBound: 'c/5',
      pitchClasses: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#','b'],
      fullPitchRange: [] // Generated in componentWillMount()
    }
    this.adjustLowerBound = this.adjustLowerBound.bind(this);
    this.adjustUpperBound = this.adjustUpperBound.bind(this);
  }
  adjustLowerBound(event) {
    this.setState({lowerBound: event.target.value})
  }
  adjustUpperBound(event) {
    this.setState({upperBound: event.target.value})
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
    const fullPitchRangeOptions = this.state.fullPitchRange.map( (pitch) => {
      return(
        <option value={pitch}>
          {pitch}
        </option>
      )
    })
    return (
     <div id="pitchRangeOptions">
      <b>Pitch Range</b> <br />
      <select onChange={this.adjustLowerBound} value={this.state.lowerBound}>
        <PitchRangeBound fullPitchRange={this.state.fullPitchRange} pitchBound={this.state.upperBound} boundType="upper" />
      </select>
      to
      <select onChange={this.adjustUpperBound} value={this.state.upperBound}>
        <PitchRangeBound fullPitchRange={this.state.fullPitchRange} pitchBound={this.state.lowerBound} boundType="lower" />
      </select>
     </div> 
    )
  }
}