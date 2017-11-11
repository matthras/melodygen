// Component holding all the options that users can tweak to modify the settings for the score.
import React, { Component } from 'react';

// Props received:
// nPitchClasses = # of Pitch Classes (integer)
// pitchClasses = the notes/pitch classes considered (array of strings)

class Options extends Component {
    render() {
        return(
            <div>
                The number of pitch classes are {this.props.nPitchClasses} with pitches {this.props.pitchClasses}
            </div>
        )
    }
        
}

export default Options;