// Component to display the music score
import React, { Component } from 'react';
import Vex from 'vexflow';

class MusicScore extends Component {
    // Receives encoded music through props.
    // Renders the actual music onto the page based on stuff passed down from props.
    // Q: How do I make this work with that music score library?
    render() {
        return(
            <div id="musicScore">
                This is the textplaceholder for the music score! Lah di dah!
            </div>
        )
    }
}

export default MusicScore;