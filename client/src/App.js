import React, { Component } from 'react';
import './App.css';
import Header from './components/Header.js';
import Options from './components/Options.js';
import MusicScore from './components/MusicScore.js';

class App extends Component {
  state = {
    users: [ ],
    anacrusis: false,
    nPitches: 4,
    nPitchClasses: 3,
    pitchClasses: ['C','D','E'],
    markovChain: [
      [0.4, 0.2, 0.4],
      [0.5, 0.3, 0.2],
      [0.1, 0.4, 0.5]
    ],
    noteSequence: ['C','D','E','F'],
    nBeats: 4,
    beatValue: 4
  }

  startingPitch() {
    // If anacrusis, return random roll between 4th degree or 7th degree, else start with tonic.
    if(this.state.anacrusis) {

    } else {
      
    }
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

  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <Header />
        <MusicScore 
          nBeats={this.state.nBeats}
          beatValue={this.state.beatValue}
          nPitches={this.state.nPitches}
          timeSignature={this.state.timeSignature}
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
