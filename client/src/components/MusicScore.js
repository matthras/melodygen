// Component to display the music score
import React, { Component } from 'react';
import Vex from 'vexflow';
import { Accidental } from 'vexflow/src/accidental';
import { Stave } from 'vexflow/src/stave';
import { StaveNote } from 'vexflow/src/stavenote';
import { Voice } from 'vexflow/src/voice';
import { Formatter } from 'vexflow/src/formatter';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';

class MusicScore extends Component {
  // Receives encoded music through props.
  // Renders the actual music onto the page based on stuff passed down from props.
  // Q: How do I make this work with that music score library?
  constructor(props) {
    super(props);
  }
  runVexFlowCode(context) {
    const stave = new stave(100, 150, 200);
    stave.setContext(context);
    stave.setClef('treble');
    stave.setTimeSignature('4/4');
    stave.setText('VexFlow on React!',3);
    stave.draw();

    const notes = [
      new StaveNote({clef: "treble", keys: ["c/4", "e/4"], duration: "q" })
        .addAccidental(0, new Accidental("##")).addDotToAll(),
      new StaveNote({clef: "treble", keys: ["d/4"], duration: "q" }),
      new StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" }),
      new StaveNote({clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q" })
    ];

    const voice = new Voice({num_beats: 4,  beat_value: 4});
    voice.addTickables(notes);

    const formatter = new Formatter().joinVoices([voice]).formatToStave([voice], stave);
    voice.draw(context, stave);
  }
  render() {
    const context = new ReactNativeSVGContext(NotoFontPack, { width: 400, height: 400 });
    this.runVexFlowCode(context);

    return(
      <div id="musicScore">
          { context.render() }
      </div>
    )
  }
}

export default MusicScore;