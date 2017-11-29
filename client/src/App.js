import React, { Component } from 'react';
import './App.css';
import './skeleton.css';
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
      pitchClasses: ['c/4','d/4','e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'],
      noteLengthClasses: [1, 2, 4, 8, 16], // Whole note, minim, crotchet, quaver, semiquaver.
      markovChain: [
        [0.25, 0.25, 0.25, 0, 0.25, 0, 0, 0],
        [0.2, 0.2, 0.2, 0.2, 0, 0.2, 0, 0],
        [0.1, 0.2, 0.2, 0.2, 0.2, 0, 0.1, 0],
        [0, 0, 0.2, 0.2, 0.2, 0.2, 0.2, 0],
        [0, 0, 0.2, 0.2, 0.2, 0.2, 0.2, 0],
        [0, 0, 0.2, 0.2, 0.2, 0.2, 0.2, 0],
        [0, 0, 0, 0, 0.2, 0.2, 0.3, 0.3],
        [0, 0, 0, 0, 0.2, 0.2, 0.3, 0.3],
      ],
      noteSequence: [['c/4','d/4','e/4','f/4'],['g/4', 'a/4', 'b/4', 'c/5']],
      rhythmSequence: [[4, 4, 4, 4],[4,4,4,4]],
      nBars: 2,
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
    return this.state.anacrusis ? 'g/4' : 'c/4'
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

  // Generates a new rhythm - at the moment it's designed to have one element per beat, so combinations such as quaver-quaver, or 4 semiquavers, are all contained within subarrays. The returned array is flattened out in generateNewScore()
  generateRhythmSequence() {
    let newRhythmSequence = [];
    for(let bar = 0; bar < this.state.nBars; bar++){
      let rhythmBar = [];
      for(let b = 0; b < this.state.nBeats; b++){
        rhythmBar.push( Math.random()> 0.25 ? 4 : [8, 8])
      }
      newRhythmSequence.push([].concat(...rhythmBar));
    }
    return newRhythmSequence;
  }

  generateNewScore() {
    let newRhythmSequence = this.generateRhythmSequence();
    let newNoteSequence = [];
    let currentPitch = 0; // Dependent on result of startingPitch() which is currently the tonic.
    for(let bar = 0; bar < this.state.nBars; bar++) {
      let notesBar = [];
      for(let r = 0; r < newRhythmSequence[bar].length; r++) {
        if(bar===0){
          notesBar.push(this.startingPitch());
        }
        currentPitch = this.getNextPitch(currentPitch);
        notesBar.push(this.state.pitchClasses[currentPitch]);
      }
      newNoteSequence.push(notesBar);
    }
    this.setState({
      noteSequence: newNoteSequence, 
      rhythmSequence: newRhythmSequence
    });
  }

  render() {
    return (
      <div className="App container">
        <div className="row">
          <Header />
          <button onClick={this.generateNewScore}>
            Generate Music!
          </button>
          <MusicScore
            clef={this.state.clef}
            nBars={this.state.nBars} 
            nBeats={this.state.nBeats}
            beatValue={this.state.beatValue}
            noteSequence={this.state.noteSequence}
            rhythmSequence={this.state.rhythmSequence}
          />
          <Options  
            pitchClasses={this.state.pitchClasses} 
          />
        </div>
      </div>
    );
  }
}

export default App;