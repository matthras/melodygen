import React, { Component } from 'react';
import './App.css';
import Header from './components/Header.js';
import Options from './components/Options.js';
import MusicScore from './components/MusicScore.js';

class App extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      users: [ ],
      anacrusis: false,
      clef: "treble",
      nPitches: 4,
      nPitchClasses: 3,
      pitchClasses: ['C','D','E', 'F', 'G', 'A', 'B'],
      noteLengthClasses: [1, 2, 4, 8, 16], // Whole note, minim, crotchet, quaver, semiquaver.
      markovChain: [
        [0.4, 0.2, 0.4],
        [0.5, 0.3, 0.2],
        [0.1, 0.4, 0.5]
      ],
      noteSequence: ['C','D','E','F'],
      nBeats: 4,
      beatValue: 4
    }
    
    this.generateNewScore = this.generateNewScore.bind(this);
    this.getNextPitch = this.getNextPitch.bind(this);
    this.startingPitch = this.startingPitch.bind(this);
  }
  

  startingPitch() {
    // If anacrusis, return random roll between 4th degree or 7th degree, else start with tonic.
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
  
  generateNewScore() {
    let newNoteSequence = [];
    newNoteSequence.push(this.startingPitch());
    let currentPitch = 0;
    for(let n = 1; n < this.state.nPitches; n++){
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
        />
        <Options 
          nPitchClasses={this.state.nPitchClasses} 
          pitchClasses={this.state.pitchClasses} 
        />
      </div>
    );
  }
}

export default App;
