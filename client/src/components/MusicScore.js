// Component to display the music score.
// Role: ONLY to render the music score based on props passed down from App. It doesn't do any calculations whatsoever.
import React, { Component } from 'react';
import { Accidental } from '../vexflow/accidental';
import { Stave } from '../vexflow/stave';
import { StaveNote } from '../vexflow/stavenote';
import { Voice } from '../vexflow/voice';
import { Formatter } from '../vexflow/formatter';
import { Renderer } from '../vexflow/renderer';
import { Beam } from '../vexflow/beam';

class MusicScore extends Component {
  constructor(props) {
    super(props);
    this.generateMusicScore = this.generateMusicScore.bind(this);
    this.constructContext = this.constructContext.bind(this);
    this.constructStaves = this.constructStaves.bind(this);
    this.constructNotes = this.constructNotes.bind(this);
    this.constructVoices = this.constructVoices.bind(this);
  }

  constructContext(nBars) {
    const div = document.getElementById("musicScore");
    let renderer = new Renderer(div, 3);
    renderer.resize(820,125*(Math.ceil(nBars/2)));
    return renderer.getContext();
  }
  // Need to add key signature
  constructStaves(nBars, clef, context) {
    let horizontalPosition = 10;
    let verticalPosition = 20;
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
        barNotes.push(new StaveNote({
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

  constructBeams(nBars, notes){
    let beams = [];
    for(let bar = 0; bar < nBars; bar++) {
      beams.push(Beam.generateBeams(notes[bar]));
    }
    return beams;   
  }

  generateMusicScore() {    
    if(this.props.renderNewScore) {
      const nBars = this.props.nBars;
      let context = this.constructContext(nBars);
      // Construct stave
      const staves = this.constructStaves(nBars, this.props.clef, context);
      // Construct notes array
      let notes = this.constructNotes(nBars, this.props.noteSequence, this.props.rhythmSequence);
      // Create a voice in 4/4 and add notes
      const voices = this.constructVoices(nBars, this.props.nBeats, this.props.beatValue, notes);
      // Automatically generate beams
      const beams = this.constructBeams(nBars, notes);
      // Render voices
      for(let bar = 0; bar < this.props.nBars; bar++) {
        let formatter = new Formatter().joinVoices([voices[bar]]).format([voices[bar]], 400);
        Formatter.FormatAndDraw(context, staves[bar], notes[bar])
        voices[bar].draw(context, staves[bar]);
        beams[bar].forEach(function(b) {b.setContext(context).draw()});
      }
      this.props.preventRendering();
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
      <div id="musicScore" className="row">
      </div>
    )
  }
}

export default MusicScore;