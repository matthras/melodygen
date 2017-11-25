import React, { Component } from 'react';
import './App.css';
import Header from './components/Header.js';
import Options from './components/Options.js';
import MusicScore from './components/MusicScore.js';

class App extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      anacrusis: false,
      clef: "treble",
      nPitches: 4, // Number of pitches, regardless of rhythm. Should be derived from number of individual notes as generated by rhythm.
      pitchClasses: ['C','D','E', 'F', 'G', 'A', 'B'],
      noteLengthClasses: [1, 2, 4, 8, 16], // Whole note, minim, crotchet, quaver, semiquaver.
      markovChain: [
        [0.4, 0.2, 0.4],
        [0.5, 0.3, 0.2],
        [0.1, 0.4, 0.5]
      ],
      noteSequence: ['C','D','E','F'],
      rhythmSequence: [4, 4, 4, 4],
      nBeats: 4,
      beatValue: 4
    }
    this.generateRhythmSequence = this.generateRhythmSequence.bind(this);
    this.generateNewScore = this.generateNewScore.bind(this);
    this.getNextPitch = this.getNextPitch.bind(this);
    this.startingPitch = this.startingPitch.bind(this);
  }

  startingPitch() {
    // Random roll for anacrusis. Maybe aim for 0.25 chance for an anacrusis?
    // If there is to be an anacrusis, return the dominant; else return the tonic.
    // Need to verify music theory concerning other possible anacrusis notes.
    return this.state.anacrusis ? 'G' : 'C'
  }

  getNextPitch(currentPitch) {
    var markovChainRow = this.state.markovChain[currentPitch];
    var diceRoll = Math.random();
    var probabilityUpperBound = markovChainRow[0];
    for(var i = 0; i < markovChainRow.length; i++) {
        if(diceRoll <= probabilityUpperBound) {
            return i; // Return a number or the next pitch?
        } else {
            probabilityUpperBound += markovChainRow[i+1]
        }
    }
    return "Error" // How to do error handling here?
  }
  
  generateRhythmSequence() {
    let newRhythmSequence = [];
    for(let b = 0; b < this.state.nBeats; b++){
      newRhythmSequence.push('q');
      //newRhythmSequence.push( Math.random()> 0.25 ? 'q' : ['s', 's'])
    }
    return newRhythmSequence;
  }

  generateNewScore() {
    const newRhythmSequence = this.generateRhythmSequence();
    let newNoteSequence = [];
    newNoteSequence.push(this.startingPitch());
    let currentPitch = 0; // This should correspond to the starting pitch
    for(let n = 1; n < newRhythmSequence.length; n++){
      currentPitch = this.getNextPitch(currentPitch);
      newNoteSequence.push(this.state.pitchClasses[currentPitch]);
    }
    this.setState({noteSequence: newNoteSequence});
  }

  render() {
    return (
      <div className="App">
        <Header />
        <button onClick={this.generateNewScore}>
          Generate Music!
        </button>
        <MusicScore
          clef={this.state.clef} 
          nBeats={this.state.nBeats}
          beatValue={this.state.beatValue}
          nPitches={this.state.nPitches}
          noteSequence={this.state.noteSequence}
          rhythmSequence={this.state.rhythmSequence}
        />
        <Options  
          pitchClasses={this.state.pitchClasses} 
        />
      </div>
    );
  }
}

export default App;
