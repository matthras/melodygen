// Component to display the music score.
// Role: ONLY to render the music score based on props passed down from App. It doesn't do any calculations whatsoever.
import React, { Component } from 'react';
import { Accidental } from 'vexflow/src/accidental';
import { Stave } from 'vexflow/src/stave';
import { StaveNote } from 'vexflow/src/stavenote';
import { Voice } from 'vexflow/src/voice';
import { Formatter } from 'vexflow/src/formatter';
import { Renderer } from 'vexflow/src/renderer';
import { Beam } from 'vexflow/src/beam';

class MusicScore extends Component {
  constructor(props) {
    super(props);
    this.generateMusicScore = this.generateMusicScore.bind(this);
    this.constructContext = this.constructContext.bind(this);
    this.constructStaves = this.constructStaves.bind(this);
    this.constructNotes = this.constructNotes.bind(this);
    this.constructVoices = this.constructVoices.bind(this);
  }

  constructContext() {
    const div = document.getElementById("musicScore");
    let renderer = new Renderer(div, 3);
    renderer.resize(800,500);
    return renderer.getContext();
  }
  // Need to add key signature
  constructStaves(nBars, clef, context) {
    let horizontalPosition = 10;
    let verticalPosition = 40;
    let staves = [];
    for(let bar = 0; bar < nBars; bar++){
      let stave = new Stave(horizontalPosition, verticalPosition, 400);
      // If the bar is even, then add the clef, since we're only having two bars per line.
      if(bar % 2 === 0) {
        stave.addClef(clef);
        horizontalPosition = 410;
      } else {
        verticalPosition += 100;
        horizontalPosition = 10;
      }
      // If it's the very first bar, then add the time signature.
      if(bar === 0) {
        const timeSignature = this.props.nBeats.toString() + "/" + this.props.beatValue.toString();
        stave.addTimeSignature(timeSignature);
      }
      stave.setContext(context).draw();
      staves.push(stave);
    }
    return staves;
  }

  constructNotes(nBars, noteSequence, rhythmSequence) {
    let notes = [];
    for(let bar = 0; bar < nBars; bar++){
      let barNotes = [];
      for(let n = 0; n < rhythmSequence[bar].length; n++){
        notes.push(new StaveNote({
          clef: this.props.clef,
          keys: [noteSequence[bar][n]],
          duration: rhythmSequence[bar][n].toString()       
        }));
      }
      notes.push(barNotes);
    }
    return notes;
  }

  constructVoices(nBars, nBeats, beatValue, notes) {
    let voices = [];
    for(let bar = 0; bar < nBars; bar++) {
      const voice = new Voice({
        num_beats: nBeats,
        beat_value: beatValue
      }).addTickables(notes[bar]);
      voices.push(voice);
    }
    return voices;
  }

  generateMusicScore() {    
    let context = this.constructContext();
    // Construct stave
    const staves = this.constructStaves(this.props.nBars, this.props.clef, context);
    // Construct notes array
    let notes = this.constructNotes(this.props.nBars, this.props.noteSequence, this.props.rhythmSequence);
    // Create a voice in 4/4 and add notes
    const voices = this.constructVoices(this.props.nBars, this.props.nBeats, this.props.beatValue, notes);
    // Automatically generate beams
    const beams = Beam.generateBeams(notes);
    // Render voices
    const formatter = new Formatter().joinVoices([voice]).format([voice], 400);
    for(let bar = 0; bar < this.props.nBars; bar++) {
      Formatter.FormatAndDraw(context, staves[bar], notes)
      voice.draw(context, staves[bar]);
    }
    // Draw beams
    beams.forEach(function(b) {b.setContext(context).draw()});
  }

  componentWillUpdate() {
    // Before re-rendering a new score, remove all instances of old score by removing all child nodes. 
    const musicScoreDiv = document.getElementById("musicScore");
    while(musicScoreDiv.firstChild) {
      musicScoreDiv.removeChild(musicScoreDiv.firstChild);
    }
  }

  componentDidMount() {
    this.generateMusicScore();
  }

  // Invoked immediately after updating occurs.
  // Meant for updating the score, since we can only attach the score when the DOM has re-rendered.
  componentDidUpdate() {
    this.generateMusicScore();
  }

  render() {
    return(
      <div id="musicScore">
      </div>
    )
  }
}

export default MusicScore;