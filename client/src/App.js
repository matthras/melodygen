import React, { Component } from 'react';
import './App.css';
import Header from './components/Header.js';
import Options from './components/Options.js';
import MusicScore from './components/MusicScore.js';

class App extends Component {
  state = {
    users: [ ],
    nPitchClasses: 3,
    pitchClasses: ['C','D','E']
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <Header />
        <MusicScore />
        <Options nPitchClasses={this.state.nPitchClasses} pitchClasses={this.state.pitchClasses} />
      </div>
    );
  }
}

export default App;
