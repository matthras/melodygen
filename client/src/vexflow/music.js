Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Music = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This class implements some standard music theory routines.

var _vex = require('./vex');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Music = exports.Music = function () {
  function Music() {
    _classCallCheck(this, Music);
  }

  _createClass(Music, [{
    key: 'isValidNoteValue',
    value: function isValidNoteValue(note) {
      if (note == null || note < 0 || note >= Music.NUM_TONES) {
        return false;
      }
      return true;
    }
  }, {
    key: 'isValidIntervalValue',
    value: function isValidIntervalValue(interval) {
      return this.isValidNoteValue(interval);
    }
  }, {
    key: 'getNoteParts',
    value: function getNoteParts(noteString) {
      if (!noteString || noteString.length < 1) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid note name: ' + noteString);
      }

      if (noteString.length > 3) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid note name: ' + noteString);
      }

      var note = noteString.toLowerCase();

      var regex = /^([cdefgab])(b|bb|n|#|##)?$/;
      var match = regex.exec(note);

      if (match != null) {
        var root = match[1];
        var accidental = match[2];

        return {
          root: root,
          accidental: accidental
        };
      } else {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid note name: ' + noteString);
      }
    }
  }, {
    key: 'getKeyParts',
    value: function getKeyParts(keyString) {
      if (!keyString || keyString.length < 1) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid key: ' + keyString);
      }

      var key = keyString.toLowerCase();

      // Support Major, Minor, Melodic Minor, and Harmonic Minor key types.
      var regex = /^([cdefgab])(b|#)?(mel|harm|m|M)?$/;
      var match = regex.exec(key);

      if (match != null) {
        var root = match[1];
        var accidental = match[2];
        var type = match[3];

        // Unspecified type implies major
        if (!type) type = 'M';

        return {
          root: root,
          accidental: accidental,
          type: type
        };
      } else {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid key: ' + keyString);
      }
    }
  }, {
    key: 'getNoteValue',
    value: function getNoteValue(noteString) {
      var value = Music.noteValues[noteString];
      if (value == null) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid note name: ' + noteString);
      }

      return value.int_val;
    }
  }, {
    key: 'getIntervalValue',
    value: function getIntervalValue(intervalString) {
      var value = Music.intervals[intervalString];
      if (value == null) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid interval name: ${intervalString}');
      }

      return value;
    }
  }, {
    key: 'getCanonicalNoteName',
    value: function getCanonicalNoteName(noteValue) {
      if (!this.isValidNoteValue(noteValue)) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid note value: ' + noteValue);
      }

      return Music.canonical_notes[noteValue];
    }
  }, {
    key: 'getCanonicalIntervalName',
    value: function getCanonicalIntervalName(intervalValue) {
      if (!this.isValidIntervalValue(intervalValue)) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid interval value: ' + intervalValue);
      }

      return Music.diatonic_intervals[intervalValue];
    }

    /* Given a note, interval, and interval direction, product the
     * relative note.
     */

  }, {
    key: 'getRelativeNoteValue',
    value: function getRelativeNoteValue(noteValue, intervalValue, direction) {
      if (direction == null) direction = 1;

      if (direction !== 1 && direction !== -1) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid direction: ' + direction);
      }

      var sum = (noteValue + direction * intervalValue) % Music.NUM_TONES;
      if (sum < 0) sum += Music.NUM_TONES;

      return sum;
    }
  }, {
    key: 'getRelativeNoteName',
    value: function getRelativeNoteName(root, noteValue) {
      var parts = this.getNoteParts(root);
      var rootValue = this.getNoteValue(parts.root);
      var interval = noteValue - rootValue;

      if (Math.abs(interval) > Music.NUM_TONES - 3) {
        var multiplier = 1;
        if (interval > 0) multiplier = -1;

        // Possibly wrap around. (Add +1 for modulo operator)
        var reverse_interval = (noteValue + 1 + (rootValue + 1)) % Music.NUM_TONES * multiplier;

        if (Math.abs(reverse_interval) > 2) {
          throw new _vex.Vex.RERR('BadArguments', 'Notes not related: ' + root + ', ' + noteValue + ')');
        } else {
          interval = reverse_interval;
        }
      }

      if (Math.abs(interval) > 2) {
        throw new _vex.Vex.RERR('BadArguments', 'Notes not related: ' + root + ', ' + noteValue + ')');
      }

      var relativeNoteName = parts.root;
      if (interval > 0) {
        for (var i = 1; i <= interval; ++i) {
          relativeNoteName += '#';
        }
      } else if (interval < 0) {
        for (var _i = -1; _i >= interval; --_i) {
          relativeNoteName += 'b';
        }
      }

      return relativeNoteName;
    }

    /* Return scale tones, given intervals. Each successive interval is
     * relative to the previous one, e.g., Major Scale:
     *
     *   TTSTTTS = [2,2,1,2,2,2,1]
     *
     * When used with key = 0, returns C scale (which is isomorphic to
     * interval list).
     */

  }, {
    key: 'getScaleTones',
    value: function getScaleTones(key, intervals) {
      var tones = [key];

      var nextNote = key;
      for (var i = 0; i < intervals.length; i += 1) {
        nextNote = this.getRelativeNoteValue(nextNote, intervals[i]);
        if (nextNote !== key) tones.push(nextNote);
      }

      return tones;
    }

    /* Returns the interval of a note, given a diatonic scale.
     *
     * E.g., Given the scale C, and the note E, returns M3
     */

  }, {
    key: 'getIntervalBetween',
    value: function getIntervalBetween(note1, note2, direction) {
      if (direction == null) direction = 1;

      if (direction !== 1 && direction !== -1) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid direction: ' + direction);
      }

      if (!this.isValidNoteValue(note1) || !this.isValidNoteValue(note2)) {
        throw new _vex.Vex.RERR('BadArguments', 'Invalid notes: ' + note1 + ', ' + note2);
      }

      var difference = direction === 1 ? note2 - note1 : note1 - note2;

      if (difference < 0) difference += Music.NUM_TONES;

      return difference;
    }

    // Create a scale map that represents the pitch state for a
    // `keySignature`. For example, passing a `G` to `keySignature` would
    // return a scale map with every note naturalized except for `F` which
    // has an `F#` state.

  }, {
    key: 'createScaleMap',
    value: function createScaleMap(keySignature) {
      var keySigParts = this.getKeyParts(keySignature);
      var scaleName = Music.scaleTypes[keySigParts.type];

      var keySigString = keySigParts.root;
      if (keySigParts.accidental) keySigString += keySigParts.accidental;

      if (!scaleName) throw new _vex.Vex.RERR('BadArguments', 'Unsupported key type: ' + keySignature);

      var scale = this.getScaleTones(this.getNoteValue(keySigString), scaleName);
      var noteLocation = Music.root_indices[keySigParts.root];

      var scaleMap = {};
      for (var i = 0; i < Music.roots.length; ++i) {
        var index = (noteLocation + i) % Music.roots.length;
        var rootName = Music.roots[index];
        var noteName = this.getRelativeNoteName(rootName, scale[i]);

        if (noteName.length === 1) {
          noteName += 'n';
        }

        scaleMap[rootName] = noteName;
      }

      return scaleMap;
    }
  }], [{
    key: 'NUM_TONES',
    get: function get() {
      return 12;
    }
  }, {
    key: 'roots',
    get: function get() {
      return ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
    }
  }, {
    key: 'root_values',
    get: function get() {
      return [0, 2, 4, 5, 7, 9, 11];
    }
  }, {
    key: 'root_indices',
    get: function get() {
      return {
        'c': 0,
        'd': 1,
        'e': 2,
        'f': 3,
        'g': 4,
        'a': 5,
        'b': 6
      };
    }
  }, {
    key: 'canonical_notes',
    get: function get() {
      return ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    }
  }, {
    key: 'diatonic_intervals',
    get: function get() {
      return ['unison', 'm2', 'M2', 'm3', 'M3', 'p4', 'dim5', 'p5', 'm6', 'M6', 'b7', 'M7', 'octave'];
    }
  }, {
    key: 'diatonic_accidentals',
    get: function get() {
      return {
        'unison': { note: 0, accidental: 0 },
        'm2': { note: 1, accidental: -1 },
        'M2': { note: 1, accidental: 0 },
        'm3': { note: 2, accidental: -1 },
        'M3': { note: 2, accidental: 0 },
        'p4': { note: 3, accidental: 0 },
        'dim5': { note: 4, accidental: -1 },
        'p5': { note: 4, accidental: 0 },
        'm6': { note: 5, accidental: -1 },
        'M6': { note: 5, accidental: 0 },
        'b7': { note: 6, accidental: -1 },
        'M7': { note: 6, accidental: 0 },
        'octave': { note: 7, accidental: 0 }
      };
    }
  }, {
    key: 'intervals',
    get: function get() {
      return {
        'u': 0, 'unison': 0,
        'm2': 1, 'b2': 1, 'min2': 1, 'S': 1, 'H': 1,
        '2': 2, 'M2': 2, 'maj2': 2, 'T': 2, 'W': 2,
        'm3': 3, 'b3': 3, 'min3': 3,
        'M3': 4, '3': 4, 'maj3': 4,
        '4': 5, 'p4': 5,
        '#4': 6, 'b5': 6, 'aug4': 6, 'dim5': 6,
        '5': 7, 'p5': 7,
        '#5': 8, 'b6': 8, 'aug5': 8,
        '6': 9, 'M6': 9, 'maj6': 9,
        'b7': 10, 'm7': 10, 'min7': 10, 'dom7': 10,
        'M7': 11, 'maj7': 11,
        '8': 12, 'octave': 12
      };
    }
  }, {
    key: 'scales',
    get: function get() {
      return {
        major: [2, 2, 1, 2, 2, 2, 1],
        dorian: [2, 1, 2, 2, 2, 1, 2],
        mixolydian: [2, 2, 1, 2, 2, 1, 2],
        minor: [2, 1, 2, 2, 1, 2, 2]
      };
    }
  }, {
    key: 'scaleTypes',
    get: function get() {
      return {
        'M': Music.scales.major,
        'm': Music.scales.minor
      };
    }
  }, {
    key: 'accidentals',
    get: function get() {
      return ['bb', 'b', 'n', '#', '##'];
    }
  }, {
    key: 'noteValues',
    get: function get() {
      return {
        'c': { root_index: 0, int_val: 0 },
        'cn': { root_index: 0, int_val: 0 },
        'c#': { root_index: 0, int_val: 1 },
        'c##': { root_index: 0, int_val: 2 },
        'cb': { root_index: 0, int_val: 11 },
        'cbb': { root_index: 0, int_val: 10 },
        'd': { root_index: 1, int_val: 2 },
        'dn': { root_index: 1, int_val: 2 },
        'd#': { root_index: 1, int_val: 3 },
        'd##': { root_index: 1, int_val: 4 },
        'db': { root_index: 1, int_val: 1 },
        'dbb': { root_index: 1, int_val: 0 },
        'e': { root_index: 2, int_val: 4 },
        'en': { root_index: 2, int_val: 4 },
        'e#': { root_index: 2, int_val: 5 },
        'e##': { root_index: 2, int_val: 6 },
        'eb': { root_index: 2, int_val: 3 },
        'ebb': { root_index: 2, int_val: 2 },
        'f': { root_index: 3, int_val: 5 },
        'fn': { root_index: 3, int_val: 5 },
        'f#': { root_index: 3, int_val: 6 },
        'f##': { root_index: 3, int_val: 7 },
        'fb': { root_index: 3, int_val: 4 },
        'fbb': { root_index: 3, int_val: 3 },
        'g': { root_index: 4, int_val: 7 },
        'gn': { root_index: 4, int_val: 7 },
        'g#': { root_index: 4, int_val: 8 },
        'g##': { root_index: 4, int_val: 9 },
        'gb': { root_index: 4, int_val: 6 },
        'gbb': { root_index: 4, int_val: 5 },
        'a': { root_index: 5, int_val: 9 },
        'an': { root_index: 5, int_val: 9 },
        'a#': { root_index: 5, int_val: 10 },
        'a##': { root_index: 5, int_val: 11 },
        'ab': { root_index: 5, int_val: 8 },
        'abb': { root_index: 5, int_val: 7 },
        'b': { root_index: 6, int_val: 11 },
        'bn': { root_index: 6, int_val: 11 },
        'b#': { root_index: 6, int_val: 0 },
        'b##': { root_index: 6, int_val: 1 },
        'bb': { root_index: 6, int_val: 10 },
        'bbb': { root_index: 6, int_val: 9 }
      };
    }
  }]);

  return Music;
}();