import React, { Component } from 'react';
import './App.css';
import Header from './components/Header.js';
import Options from './components/Options.js';
import MusicScore from './components/MusicScore.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [ ],
      anacrusis: false,
      nPitches: 6,
      nPitchClasses: 3,
      pitchClasses: ['C','D','E'],
      markovChain: [
        [0.4, 0.2, 0.4],
        [0.5, 0.3, 0.2],
        [0.1, 0.4, 0.5]
      ],
      noteSequence: [],
    }
    this.getNextPitch = this.getNextPitch.bind(this);
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
        <MusicScore />
        <Options 
          nPitchClasses={this.state.nPitchClasses} 
          pitchClasses={this.state.pitchClasses} 
        />
      </div>
    );
  }
}

export default App;
