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
    return (
      <div id="keySignatureOptions">
        <b>Key Signature</b> <br />
        <select value={this.props.keySignature} onChange={this.keySignatureChange}>
          <option value="Cmaj">C Major</option>
        </select>
      </div>
    )
  }
}