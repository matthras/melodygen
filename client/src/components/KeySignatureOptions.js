import React, { Component } from 'react';

export class KeySignatureOptions extends Component{
  constructor(props) {
    super(props)
    this.state={ 
      keySignatures: [
        // Sharps/Flats, Major Key, Minor Key
        [7, 'C#', 'A#'],
        [6, 'F#', 'D#'],
        [5, 'B', 'G#'],
        [4, 'E', 'C#'],
        [3, 'A', 'F#'],
        [2, 'D', 'B'],
        [1, 'G', 'E'],
        [0, 'C', 'A'],
        [-1, 'F', 'D'],
        [-2, 'Bb', 'G'],
        [-3, 'Eb', 'C'],
        [-4, 'Ab', 'F'],
        [-5, 'Db', 'Bb'],
        [-6, 'Gb', 'Eb'],
        [-7, 'Cb', 'Ab']
      ],
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