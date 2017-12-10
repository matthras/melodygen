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
      // Stuff that happens at the start of a score.
      anacrusis: false,
      clef: "treble",
      nBeats: 4, // Time signature
      beatValue: 4, // Time signature
      // Library of Constants - None of these should ever change from the initial setup.
      majorScaleIntervals: [2, 2, 1, 2, 2, 2, 1],
      minorScaleIntervals: [2, 1, 2, 2, 1, 2, 1],
      pitchClasses: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#','b'],
      fullPitchRange: [], // Generated in componentwillmount()
      noteLengthClasses: [1, 2, 4, 8, 16], // Whole note, minim, crotchet, quaver, semiquaver.
      // Initial Conditions
      workingPitchRange: ['c/4','d/4','e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'],
      workingpitchRangeBottom: 'c/4',
      workingpitchRangeTop: 'c/5',
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
      noteSequence: [['c/4','d/4','e/4','f/4'],['g/4', 'a/4', 'b/4', 'c/5'],['c/5', 'b/4', 'a/4', 'g/4'],['f/4','e/4','d/4','c/4']],
      rhythmSequence: [[4, 4, 4, 4],[4,4,4,4],[4,4,4,4],[4,4,4,4]],
      nBars: 4,
      renderNewScore: true
    }
    this.generateRhythmSequence = this.generateRhythmSequence.bind(this);
    this.generateNewScore = this.generateNewScore.bind(this);
    this.getNextPitch = this.getNextPitch.bind(this);
    this.startingPitch = this.startingPitch.bind(this);
    this.preventRendering = this.preventRendering.bind(this);
    this.generatePitchRange = this.generatePitchRange.bind(this);
    this.enharmonicEquivalent = this.enharmonicEquivalent.bind(this);
    // Change handlers for <Options>
    this.nBarsChange = this.nBarsChange.bind(this);
    this.nBeatsChange = this.nBeatsChange.bind(this);
    this.beatValueChange = this.beatValueChange.bind(this);
    this.markovchainChange = this.markovchainChange.bind(this);
  }
  preventRendering() {
    this.setState({renderNewScore: false})
  }
  // Takes a sharpened or flattened note, and returns the enharmonic equivalent.
  enharmonicEquivalent(note) {
    const splitNote = note.split('');
    const accidental = (splitNote[1]==='#') ? 'b' : '#';
    const newNote = (splitNote[1]==='#') ? splitNote[0].charCodeAt(0)+1 : splitNote[0].charCodeAt(0)-1;
    return newNote+accidental;
  }
  nBarsChange(num) {
    this.setState({nBars: num});
  }
  nBeatsChange(num) {
    this.setState({nBeats: num});
  }
  beatValueChange(num) {
    this.setState({beatValue: num});
  }
  markovchainChange(row, rowIndex) {
    let newMarkovChain = this.state.markovChain;
    newMarkovChain[rowIndex] = row;
    this.setState({markovChain: newMarkovChain})
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

  // Generates a new rhythm - at the moment it's designed to have one element per beat, so combinations such as quaver-quaver, or 4 semiquavers, are all contained within subarrays. One flattened array per bar.
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
    // Before re-rendering a new score, remove all instances of old score by removing all child nodes. 
    const musicScoreDiv = document.getElementById("musicScore");
    while(musicScoreDiv.firstChild) {
      musicScoreDiv.removeChild(musicScoreDiv.firstChild);
    }
    // Generating New Score
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
        notesBar.push(this.state.workingPitchRange[currentPitch]);
      }
      newNoteSequence.push(notesBar);
    }
    this.setState({
      noteSequence: newNoteSequence, 
      rhythmSequence: newRhythmSequence,
      renderNewScore: true
    });
  }

  generatePitchRange(bottomPitch = 'a/0', topPitch = 'c/8') {
    // Test: bottomPitch and topPitch MUST be in 'letter'/'number' form
    if(this.state.fullPitchRange.length===0){
      // Generate full pitch range A0 to C8 (88 key piano)
      // A0 to C8, number starts on C e.g. A0, A#0, B0, C1, etc.
      // This should only happen at the start in componentWillMount()
      let fullPitchRange = [];
      fullPitchRange.push('a/0');
      fullPitchRange.push('a#/0');
      fullPitchRange.push('b/0');
      for(let p = 1; p < 8; p++){
        for(let pc = 0; pc < this.state.pitchClasses.length; pc++){
          fullPitchRange.push(this.state.pitchClasses[pc]+'/'+p);
        }
      }
      fullPitchRange.push('c/8');
      this.setState({fullPitchRange})
    } else {
      const fullPitchRange = this.state.fullPitchRange;
      const workingPitchRange = fullPitchRange.slice(fullPitchRange.indexOf(bottomPitch), fullPitchRange.indexOf(topPitch)+1)
      this.setState({workingPitchRange})
    }
  }

  componentWillMount() {
    this.generatePitchRange()
  }

  render() {
    return (
      <div className="App container">
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
            renderNewScore={this.state.renderNewScore}
            preventRendering={this.preventRendering}
          />
          <Options  
            workingPitchRange={this.state.workingPitchRange} 
            clef={this.state.clef}
            nBars={this.state.nBars}
            markovChain={this.state.markovChain}
            nBeats={this.state.nBeats}
            beatValue={this.state.beatValue}
            nBarsChange={this.nBarsChange}
            nBeatsChange={this.nBeatsChange}
            beatValueChange={this.beatValueChange}
            markovchainChange={this.markovchainChange}
          />
      </div>
    );
  }
}

export default App;