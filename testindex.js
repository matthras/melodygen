var pitchClasses = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
var octaves = [0, 1, 2, 3, 4, 5, 6, 7, 8];

var markovChain = [
    [0.4, 0.2, 0.4],
    [0.5, 0.3, 0.2],
    [0.1, 0.4, 0.5]
];

var states = ['A','B','C'];

// Sequence of notes
var noteSequence = ['A'];
var firstState = states.indexOf(noteSequence[0]);
// console.log(states.indexOf(noteSequence[0]));
var diceRoll = Math.random();
console.log(diceRoll)

var secondState;
var probabilityRange = markovChain[firstState][0];
for(var i = 0; i < states.length; i++) {
    console.log("markovChain State Being Addressed:", i);
    if(diceRoll <= probabilityRange) {
        console.log("We've found a match!");
        secondState = i;
        break;
    } else {
        console.log("Nope, try again");
        probabilityRange += markovChain[firstState][i+1]
        console.log("Updated upper bound", probabilityRange);
    }
}
console.log("secondState:", secondState);
noteSequence.push(states[secondState]);

function getNextPitch(currentPitch){
    var markovChainRow = markovChain[currentPitch];
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

// Time signature - set these in state, and switch when the time signature is selected.
function updateTimeSignature() {
    var selectedTimeSignature = document.getElementById("timeSignature");
    if(selectedTimeSignature === '2/4' || selectedTimeSignature === '3/4' || selectedTimeSignature === '4/4'){
        timeSignatureType = 'simple';
    } else if (selectedTimeSignature === '6/8') {
        timeSignatureType = 'compound';
    }
}

function updateNumberOfBars() {

}

function calculatenumberofBeats() {

}

var simpleRhythms = ['crotchet', 'quaver quaver', 'minim'];
var simpleRhythmTimeUnits = [1, 1, 2];

function generateRhythm(nBeats, nBars = 4, timeSignatureType) {
    var totalTimeUnits = nBeats*nBars;
    for(var bar = 0; b < nBars; b++) {
        for(var beat = 1; beat < nBeats+1; beat++){
            // Select a rhuthm piece that fits into the number of remaining time units
        }
    }
}

document.getElementById("pitchClasses").innerHTML = noteSequence;