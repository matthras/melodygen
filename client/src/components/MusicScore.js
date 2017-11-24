// Component to display the music score.
// Role: ONLY to render the music score based on props passed down from App. It doesn't do any calculations whatsoever.
import React, { Component } from 'react';
import { Accidental } from 'vexflow/src/accidental';
import { Stave } from 'vexflow/src/stave';
import { StaveNote } from 'vexflow/src/stavenote';
import { Voice } from 'vexflow/src/voice';
import { Formatter } from 'vexflow/src/formatter';
import { Renderer } from 'vexflow/src/renderer';

class MusicScore extends Component {
  constructor(props) {
    super(props);

    this.convertMusicNote = this.convertMusicNote.bind(this);
    this.generateMusicScore = this.generateMusicScore.bind(this);
  }
  // Possibly a redundant converter function and can be moved to parent component.
  convertMusicNote(note) {
    switch(note){
      case 'C':
        return "c/4";
      case 'D':
        return "d/4";
      case 'E':
        return "e/4";
      case 'F':
        return "f/4";
      default: 
        return "a/0";
    }
  }

  generateMusicScore() {
    // Construct context
    const div = document.getElementById("musicScore");
    let renderer = new Renderer(div, 3);
    renderer.resize(500,500);
    let context = renderer.getContext();
    // Construct stave
    let stave = new Stave(10, 40, 400);
    const timeSignature = this.props.nBeats.toString() + "/" + this.props.beatValue.toString();
    stave.addClef(this.props.clef).addTimeSignature(timeSignature);
    stave.setContext(context).draw();
    // Construct notes array
    const noteSequence = this.props.noteSequence;
    let notes = [];
    for(let n = 0; n < this.props.nPitches; n++){
      notes.push(new StaveNote({
        clef: this.props.clef,
        keys: [this.convertMusicNote(noteSequence[n])],
        duration: "q"        
      }));
    }
    // Create a voice in 4/4 and add notes
    const voice = new Voice({
      num_beats: this.props.nBeats, 
      beat_value:this.props.beatValue
    }).addTickables(notes);
    // Render voices
    const formatter = new Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);
  }

  componentWillUpdate() {
    // Before re-rendering a new score, remove all instances of old score. 
    const musicScoreDiv = document.getElementById("musicScore");
    while(musicScoreDiv.hasChildNodes()) {
      musicScoreDiv.removeChild;
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