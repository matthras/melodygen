import React, { Component } from 'react';

function pitchRangeOptions(fullPitchRange, boundPitch, boundType) {
  // if upper bound, slice from c/0 to bound
  // if lower bound, slice from bound to end
  const adjustedPitchRange = (boundType==='upper') ? fullPitchRange.slice(fullPitchRange.indexOf(boundPitch)) : fullPitchRange.slice(fullPitchRange.indexOf(boundPitch))
  return adjustedPitchRange
}

export class PitchRangeOptions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lowerBound: 'c/4',
      upperBound: 'c/5'
    }
  }
  render() {
    const fullPitchRangeOptions = this.props.fullPitchRange.map( (pitch) => {
      return(
        <option value={pitch}>
          {pitch}
        </option>
      )
    })
    return (
     <div id="pitchRangeOptions">
      <b>Pitch Range</b> <br />
      <select>
        {fullPitchRangeOptions}
      </select>
      to
      <select>
        {fullPitchRangeOptions}
      </select>
     </div> 
    )
  }
}