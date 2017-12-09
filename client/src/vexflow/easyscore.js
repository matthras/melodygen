'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EasyScore = exports.X = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// This class implements a parser for a simple language to generate
// VexFlow objects.

var _vex = require('./vex');

var _stavenote = require('./stavenote');

var _parser = require('./parser');

var _articulation = require('./articulation');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// To enable logging for this class. Set `Vex.Flow.EasyScore.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (EasyScore.DEBUG) _vex.Vex.L('Vex.Flow.EasyScore', args);
}

var X = exports.X = _vex.Vex.MakeException('EasyScoreError');

var Grammar = function () {
  function Grammar(builder) {
    _classCallCheck(this, Grammar);

    this.builder = builder;
  }

  _createClass(Grammar, [{
    key: 'begin',
    value: function begin() {
      return this.LINE;
    }
  }, {
    key: 'LINE',
    value: function LINE() {
      return {
        expect: [this.PIECE, this.PIECES, this.EOL]
      };
    }
  }, {
    key: 'PIECE',
    value: function PIECE() {
      var _this = this;

      return {
        expect: [this.CHORDORNOTE, this.PARAMS],
        run: function run() {
          return _this.builder.commitPiece();
        }
      };
    }
  }, {
    key: 'PIECES',
    value: function PIECES() {
      return {
        expect: [this.COMMA, this.PIECE],
        zeroOrMore: true
      };
    }
  }, {
    key: 'PARAMS',
    value: function PARAMS() {
      return {
        expect: [this.DURATION, this.TYPE, this.DOTS, this.OPTS]
      };
    }
  }, {
    key: 'CHORDORNOTE',
    value: function CHORDORNOTE() {
      return {
        expect: [this.CHORD, this.SINGLENOTE],
        or: true
      };
    }
  }, {
    key: 'CHORD',
    value: function CHORD() {
      var _this2 = this;

      return {
        expect: [this.LPAREN, this.NOTES, this.RPAREN],
        run: function run(state) {
          return _this2.builder.addChord(state.matches[1]);
        }
      };
    }
  }, {
    key: 'NOTES',
    value: function NOTES() {
      return {
        expect: [this.NOTE],
        oneOrMore: true
      };
    }
  }, {
    key: 'NOTE',
    value: function NOTE() {
      return {
        expect: [this.NOTENAME, this.ACCIDENTAL, this.OCTAVE]
      };
    }
  }, {
    key: 'SINGLENOTE',
    value: function SINGLENOTE() {
      var _this3 = this;

      return {
        expect: [this.NOTENAME, this.ACCIDENTAL, this.OCTAVE],
        run: function run(state) {
          return _this3.builder.addSingleNote(state.matches[0], state.matches[1], state.matches[2]);
        }
      };
    }
  }, {
    key: 'ACCIDENTAL',
    value: function ACCIDENTAL() {
      return {
        expect: [this.ACCIDENTALS],
        maybe: true
      };
    }
  }, {
    key: 'DOTS',
    value: function DOTS() {
      var _this4 = this;

      return {
        expect: [this.DOT],
        zeroOrMore: true,
        run: function run(state) {
          return _this4.builder.setNoteDots(state.matches[0]);
        }
      };
    }
  }, {
    key: 'TYPE',
    value: function TYPE() {
      var _this5 = this;

      return {
        expect: [this.SLASH, this.MAYBESLASH, this.TYPES],
        maybe: true,
        run: function run(state) {
          return _this5.builder.setNoteType(state.matches[2]);
        }
      };
    }
  }, {
    key: 'DURATION',
    value: function DURATION() {
      var _this6 = this;

      return {
        expect: [this.SLASH, this.DURATIONS],
        maybe: true,
        run: function run(state) {
          return _this6.builder.setNoteDuration(state.matches[1]);
        }
      };
    }
  }, {
    key: 'OPTS',
    value: function OPTS() {
      return {
        expect: [this.LBRACKET, this.KEYVAL, this.KEYVALS, this.RBRACKET],
        maybe: true
      };
    }
  }, {
    key: 'KEYVALS',
    value: function KEYVALS() {
      return {
        expect: [this.COMMA, this.KEYVAL],
        zeroOrMore: true
      };
    }
  }, {
    key: 'KEYVAL',
    value: function KEYVAL() {
      var _this7 = this;

      var unquote = function unquote(str) {
        return str.slice(1, -1);
      };

      return {
        expect: [this.KEY, this.EQUALS, this.VAL],
        run: function run(state) {
          return _this7.builder.addNoteOption(state.matches[0], unquote(state.matches[2]));
        }
      };
    }
  }, {
    key: 'VAL',
    value: function VAL() {
      return {
        expect: [this.SVAL, this.DVAL],
        or: true
      };
    }
  }, {
    key: 'KEY',
    value: function KEY() {
      return { token: '[a-zA-Z][a-zA-Z0-9]*' };
    }
  }, {
    key: 'DVAL',
    value: function DVAL() {
      return { token: '["][^"]*["]' };
    }
  }, {
    key: 'SVAL',
    value: function SVAL() {
      return { token: "['][^']*[']" };
    }
  }, {
    key: 'NOTENAME',
    value: function NOTENAME() {
      return { token: '[a-gA-G]' };
    }
  }, {
    key: 'OCTAVE',
    value: function OCTAVE() {
      return { token: '[0-9]+' };
    }
  }, {
    key: 'ACCIDENTALS',
    value: function ACCIDENTALS() {
      return { token: 'bbs|bb|bss|bs|b|db|d|##|#|n|\\+\\+-|\\+-|\\+\\+|\\+|k|o' };
    }
  }, {
    key: 'DURATIONS',
    value: function DURATIONS() {
      return { token: '[0-9whq]+' };
    }
  }, {
    key: 'TYPES',
    value: function TYPES() {
      return { token: '[rRsSxX]' };
    }
  }, {
    key: 'LPAREN',
    value: function LPAREN() {
      return { token: '[(]' };
    }
  }, {
    key: 'RPAREN',
    value: function RPAREN() {
      return { token: '[)]' };
    }
  }, {
    key: 'COMMA',
    value: function COMMA() {
      return { token: '[,]' };
    }
  }, {
    key: 'DOT',
    value: function DOT() {
      return { token: '[.]' };
    }
  }, {
    key: 'SLASH',
    value: function SLASH() {
      return { token: '[/]' };
    }
  }, {
    key: 'MAYBESLASH',
    value: function MAYBESLASH() {
      return { token: '[/]?' };
    }
  }, {
    key: 'EQUALS',
    value: function EQUALS() {
      return { token: '[=]' };
    }
  }, {
    key: 'LBRACKET',
    value: function LBRACKET() {
      return { token: '\\[' };
    }
  }, {
    key: 'RBRACKET',
    value: function RBRACKET() {
      return { token: '\\]' };
    }
  }, {
    key: 'EOL',
    value: function EOL() {
      return { token: '$' };
    }
  }]);

  return Grammar;
}();

var Builder = function () {
  function Builder(factory) {
    _classCallCheck(this, Builder);

    this.factory = factory;
    this.commitHooks = [];
    this.reset();
  }

  _createClass(Builder, [{
    key: 'reset',
    value: function reset() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.options = {
        stem: 'auto',
        clef: 'treble'
      };
      this.elements = {
        notes: [],
        accidentals: []
      };
      this.rollingDuration = '8';
      this.resetPiece();
      Object.assign(this.options, options);
    }
  }, {
    key: 'getFactory',
    value: function getFactory() {
      return this.factory;
    }
  }, {
    key: 'getElements',
    value: function getElements() {
      return this.elements;
    }
  }, {
    key: 'addCommitHook',
    value: function addCommitHook(commitHook) {
      this.commitHooks.push(commitHook);
    }
  }, {
    key: 'resetPiece',
    value: function resetPiece() {
      L('resetPiece');
      this.piece = {
        chord: [],
        duration: this.rollingDuration,
        dots: 0,
        type: undefined,
        options: {}
      };
    }
  }, {
    key: 'setNoteDots',
    value: function setNoteDots(dots) {
      L('setNoteDots:', dots);
      if (dots) this.piece.dots = dots.length;
    }
  }, {
    key: 'setNoteDuration',
    value: function setNoteDuration(duration) {
      L('setNoteDuration:', duration);
      this.rollingDuration = this.piece.duration = duration || this.rollingDuration;
    }
  }, {
    key: 'setNoteType',
    value: function setNoteType(type) {
      L('setNoteType:', type);
      if (type) this.piece.type = type;
    }
  }, {
    key: 'addNoteOption',
    value: function addNoteOption(key, value) {
      L('addNoteOption: key:', key, 'value:', value);
      this.piece.options[key] = value;
    }
  }, {
    key: 'addNote',
    value: function addNote(key, accid, octave) {
      L('addNote:', key, accid, octave);
      this.piece.chord.push({ key: key, accid: accid, octave: octave });
    }
  }, {
    key: 'addSingleNote',
    value: function addSingleNote(key, accid, octave) {
      L('addSingleNote:', key, accid, octave);
      this.addNote(key, accid, octave);
    }
  }, {
    key: 'addChord',
    value: function addChord(notes) {
      var _this8 = this;

      L('startChord');
      if (_typeof(notes[0]) !== 'object') {
        this.addSingleNote(notes[0]);
      } else {
        notes.forEach(function (n) {
          if (n) _this8.addNote.apply(_this8, _toConsumableArray(n));
        });
      }
      L('endChord');
    }
  }, {
    key: 'commitPiece',
    value: function commitPiece() {
      var _this9 = this;

      L('commitPiece');
      var factory = this.factory;


      if (!factory) return;

      var options = Object.assign({}, this.options, this.piece.options);
      var stem = options.stem,
          clef = options.clef;

      var autoStem = stem.toLowerCase() === 'auto';
      var stemDirection = !autoStem && stem.toLowerCase() === 'up' ? _stavenote.StaveNote.STEM_UP : _stavenote.StaveNote.STEM_DOWN;

      // Build StaveNotes.
      var _piece = this.piece,
          chord = _piece.chord,
          duration = _piece.duration,
          dots = _piece.dots,
          type = _piece.type;

      var keys = chord.map(function (note) {
        return note.key + '/' + note.octave;
      });
      var note = factory.StaveNote({
        keys: keys,
        duration: duration,
        dots: dots,
        type: type,
        clef: clef,
        auto_stem: autoStem
      });
      if (!autoStem) note.setStemDirection(stemDirection);

      // Attach accidentals.
      var accids = chord.map(function (note) {
        return note.accid || null;
      });
      accids.forEach(function (accid, i) {
        if (accid) note.addAccidental(i, factory.Accidental({ type: accid }));
      });

      // Attach dots.
      for (var i = 0; i < dots; i++) {
        note.addDotToAll();
      }this.commitHooks.forEach(function (fn) {
        return fn(options, note, _this9);
      });

      this.elements.notes.push(note);
      this.elements.accidentals.concat(accids);
      this.resetPiece();
    }
  }]);

  return Builder;
}();

function setId(_ref, note) {
  var id = _ref.id;

  if (id === undefined) return;

  note.setAttribute('id', id);
}

function setClass(options, note) {
  if (!options.class) return;

  var commaSeparatedRegex = /\s*,\s*/;

  options.class.split(commaSeparatedRegex).forEach(function (className) {
    return note.addClass(className);
  });
}

var EasyScore = exports.EasyScore = function () {
  function EasyScore() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EasyScore);

    this.setOptions(options);
    this.defaults = {
      clef: 'treble',
      time: '4/4',
      stem: 'auto'
    };
  }

  _createClass(EasyScore, [{
    key: 'set',
    value: function set(defaults) {
      Object.assign(this.defaults, defaults);
      return this;
    }
  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      var _this10 = this;

      this.options = Object.assign({
        factory: null,
        builder: null,
        commitHooks: [setId, setClass, _articulation.Articulation.easyScoreHook],
        throwOnError: false
      }, options);

      this.factory = this.options.factory;
      this.builder = this.options.builder || new Builder(this.factory);
      this.grammar = new Grammar(this.builder);
      this.parser = new _parser.Parser(this.grammar);
      this.options.commitHooks.forEach(function (commitHook) {
        return _this10.addCommitHook(commitHook);
      });
      return this;
    }
  }, {
    key: 'setContext',
    value: function setContext(context) {
      if (this.factory) this.factory.setContext(context);
      return this;
    }
  }, {
    key: 'parse',
    value: function parse(line) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.builder.reset(options);
      var result = this.parser.parse(line);
      if (!result.success && this.options.throwOnError) {
        throw new X('Error parsing line: ' + line, result);
      }
      return result;
    }
  }, {
    key: 'beam',
    value: function beam(notes) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.factory.Beam({ notes: notes, options: options });
      return notes;
    }
  }, {
    key: 'tuplet',
    value: function tuplet(notes) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.factory.Tuplet({ notes: notes, options: options });
      return notes;
    }
  }, {
    key: 'notes',
    value: function notes(line) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options = Object.assign({ clef: this.defaults.clef, stem: this.defaults.stem }, options);
      this.parse(line, options);
      return this.builder.getElements().notes;
    }
  }, {
    key: 'voice',
    value: function voice(notes, voiceOptions) {
      voiceOptions = Object.assign({ time: this.defaults.time }, voiceOptions);
      return this.factory.Voice(voiceOptions).addTickables(notes);
    }
  }, {
    key: 'addCommitHook',
    value: function addCommitHook(commitHook) {
      return this.builder.addCommitHook(commitHook);
    }
  }]);

  return EasyScore;
}();