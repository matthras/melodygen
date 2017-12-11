import React, { Component } from 'react';

export class KeySignatureOptions extends Component{
  constructor(props) {
    super(props)
    this.state={
      nSharpsFlats: [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7],
      majorKeys: ['Cb', 'Gb', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'],
      minorKeys: ['Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#']
    }
  }
  render() {
    const nSharpFlatsOptions = this.state.nSharpsFlats.map( (num) => {
      return (
        <option value={num}>
          {(num < 0) ? Math.abs(num)+' flats' : num + ' sharps'} 
        </option>
      )
    })
    const majorOptions = this.state.majorKeys.map( (key) => {
      return (
        <option value={key}>
          {key + ' major'}
        </option>
      )
    })
    const minorOptions = this.state.minorKeys.map( (key) => {
      return(
        <option value={key}>
          {key + ' minor'}
        </option>
      )
    })
    return (
      <div id="keySignatureOptions">
        <b>Key Signature</b> <br />
        [Feature Under Construction!] <br />
        [Only C Major For Now!] <br />
        <select value={this.props.nSharpsFlats}>
          {nSharpFlatsOptions}
        </select>
        <select>
          {majorOptions}
          {minorOptions}
        </select>
      </div>
    )
  }
}