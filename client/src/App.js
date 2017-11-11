import React, { Component } from 'react';
import './App.css';
import Options from './components/Options.js';
import MusicScore from './components/MusicScore.js';

class App extends Component {
  state = {
    users: [ ],
    nPitchClasses: 3,
    pitchClasses: ['C','D','E']
  }

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(users => this.setState({ users }));
  }

  render() {
    return (
      <div className="App">
        <h1>Users</h1>
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
        <MusicScore />
        <Options nPitchClasses={this.state.nPitchClasses} pitchClasses={this.state.pitchClasses} />
      </div>
    );
  }
}

export default App;
