import React, { Component } from 'react';

export class keySignatureOptions extends Component{
  constructor(props) {
    super(props)
    this.state={ 
      keySignatures: [
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

    )
  }
}