// Component to display the music score
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
  // Receives encoded music through props.
  // Renders the actual music onto the page based on stuff passed down from props.
  // Q: How do I make this work with that music score library?
  convertMusicNote(note) {
    switch(note){
      case 'C':
        return "c/4";
      case 'D':
        return "d/4";
      case 'E':
        return "e/4";
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
    stave.addClef("treble").addTimeSignature(this.props.timeSignature);
    // Construct notes array
    const noteSequence = this.props.noteSequence;
    let notes = [];
    for(let n = 0; n < this.props.nPitches; n++){
      notes.push(new StaveNote({
        clef: "treble",
        keys: [this.convertMusicNote(noteSequence[n])],
        duration: "q"        
      }));
    }
    // Create a voice in 4/4 and add notes
    const voice = new Voice({num_beats: this.props.nBeats, beat_value:this.props.beatValue}).addTickables(notes);
    // Render voices
    voice.draw(context, stave);
  }

  componentDidMount() {
    const div = document.getElementById("musicScore");
    let renderer = new Renderer(div, 3);
    renderer.resize(500,500);
    let context = renderer.getContext();
    let stave = new Stave(10, 40, 400);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    var notes = [
      new StaveNote({clef: "treble", keys: ["c/5"], duration: "q" }),
      new StaveNote({clef: "treble", keys: ["d/4"], duration: "q" }),
      new StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" }),
      new StaveNote({clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q" })
    ];
    
    var notes2 = [
      new StaveNote({clef: "treble", keys: ["c/4"], duration: "w" })
    ];
    
    // Create a voice in 4/4 and add above notes
    var voices = [
      new Voice({num_beats: 4,  beat_value: 4}).addTickables(notes),
      new Voice({num_beats: 4,  beat_value: 4}).addTickables(notes2)]
    
    // Format and justify the notes to 400 pixels.
    var formatter = new Formatter().joinVoices(voices).format(voices, 400);
    
    // Render voices
    voices.forEach(function(v) { v.draw(context, stave); })
  }

  // Invoked immediately after updating occurs.
  // Meant for updating the score, since we can only attach the score when the DOM has re-rendered.
  componentDidUpdate() {

  }

  render() {
    return(
      <div id="musicScore">
      </div>
    )
  }
}

export default MusicScore;