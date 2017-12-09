'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tuning = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This class implements varies types of tunings for tablature.

var _vex = require('./vex');

var _tables = require('./tables');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tuning = exports.Tuning = function () {
  _createClass(Tuning, null, [{
    key: 'names',
    get: function get() {
      return {
        'standard': 'E/5,B/4,G/4,D/4,A/3,E/3',
        'dagdad': 'D/5,A/4,G/4,D/4,A/3,D/3',
        'dropd': 'E/5,B/4,G/4,D/4,A/3,D/3',
        'eb': 'Eb/5,Bb/4,Gb/4,Db/4,Ab/3,Db/3',
        'standardBanjo': 'D/5,B/4,G/4,D/4,G/5'
      };
    }
  }]);

  function Tuning() {
    var tuningString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'E/5,B/4,G/4,D/4,A/3,E/3,B/2,E/2';

    _classCallCheck(this, Tuning);

    // Default to standard tuning.
    this.setTuning(tuningString);
  }

  _createClass(Tuning, [{
    key: 'noteToInteger',
    value: function noteToInteger(noteString) {
      return _tables.Flow.keyProperties(noteString).int_value;
    }
  }, {
    key: 'setTuning',
    value: function setTuning(noteString) {
      if (Tuning.names[noteString]) {
        noteString = Tuning.names[noteString];
      }

      this.tuningString = noteString;
      this.tuningValues = [];
      this.numStrings = 0;

      var keys = noteString.split(/\s*,\s*/);
      if (keys.length === 0) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid tuning string: ' + noteString);
      }

      this.numStrings = keys.length;
      for (var i = 0; i < this.numStrings; ++i) {
        this.tuningValues[i] = this.noteToInteger(keys[i]);
      }
    }
  }, {
    key: 'getValueForString',
    value: function getValueForString(stringNum) {
      var s = parseInt(stringNum, 10);
      if (s < 1 || s > this.numStrings) {
        throw new _vex.Vex.RERR('BadArguments', 'String number must be between 1 and ' + this.numStrings + ':' + stringNum);
      }

      return this.tuningValues[s - 1];
    }
  }, {
    key: 'getValueForFret',
    value: function getValueForFret(fretNum, stringNum) {
      var stringValue = this.getValueForString(stringNum);
      var f = parseInt(fretNum, 10);

      if (f < 0) {
        throw new _vex.Vex.RERR('BadArguments', 'Fret number must be 0 or higher: ' + fretNum);
      }

      return stringValue + f;
    }
  }, {
    key: 'getNoteForFret',
    value: function getNoteForFret(fretNum, stringNum) {
      var noteValue = this.getValueForFret(fretNum, stringNum);

      var octave = Math.floor(noteValue / 12);
      var value = noteValue % 12;

      return _tables.Flow.integerToNote(value) + '/' + octave;
    }
  }]);

  return Tuning;
}();