'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Factory = exports.X = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// @author Mohit Cheppudira
//
// ## Description
//
// This file implements a high level API around VexFlow. It will eventually
// become the canonical way to use VexFlow.
//
// *This API is currently DRAFT*

var _vex = require('./vex');

var _accidental = require('./accidental');

var _articulation = require('./articulation');

var _annotation = require('./annotation');

var _formatter = require('./formatter');

var _frethandfinger = require('./frethandfinger');

var _stringnumber = require('./stringnumber');

var _textdynamics = require('./textdynamics');

var _modifiercontext = require('./modifiercontext');

var _renderer = require('./renderer');

var _stave = require('./stave');

var _stavetie = require('./stavetie');

var _staveline = require('./staveline');

var _stavenote = require('./stavenote');

var _staveconnector = require('./staveconnector');

var _system = require('./system');

var _tickcontext = require('./tickcontext');

var _tuplet = require('./tuplet');

var _voice = require('./voice');

var _beam = require('./beam');

var _curve = require('./curve');

var _gracenote = require('./gracenote');

var _gracenotegroup = require('./gracenotegroup');

var _notesubgroup = require('./notesubgroup');

var _easyscore = require('./easyscore');

var _timesignote = require('./timesignote');

var _clefnote = require('./clefnote');

var _pedalmarking = require('./pedalmarking');

var _textbracket = require('./textbracket');

var _vibratobracket = require('./vibratobracket');

var _ghostnote = require('./ghostnote');

var _barnote = require('./barnote');

var _tabnote = require('./tabnote');

var _tabstave = require('./tabstave');

var _textnote = require('./textnote');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// To enable logging for this class. Set `Vex.Flow.Factory.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (Factory.DEBUG) _vex.Vex.L('Vex.Flow.Factory', args);
}

var X = exports.X = _vex.Vex.MakeException('FactoryError');

function setDefaults() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaults = arguments[1];

  var default_options = defaults.options;
  params = Object.assign(defaults, params);
  params.options = Object.assign(default_options, params.options);
  return params;
}

var Factory = exports.Factory = function () {
  function Factory(options) {
    _classCallCheck(this, Factory);

    L('New factory: ', options);
    var defaults = {
      stave: {
        space: 10
      },
      renderer: {
        context: null,
        elementId: '',
        backend: _renderer.Renderer.Backends.SVG,
        width: 500,
        height: 200,
        background: '#FFF'
      },
      font: {
        face: 'Arial',
        point: 10,
        style: ''
      }
    };

    this.options = defaults;
    this.setOptions(options);
  }

  _createClass(Factory, [{
    key: 'reset',
    value: function reset() {
      this.renderQ = [];
      this.systems = [];
      this.staves = [];
      this.voices = [];
      this.stave = null; // current stave
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.options;
    }
  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      var _arr = ['stave', 'renderer', 'font'];

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];
        Object.assign(this.options[key], options[key]);
      }
      if (this.options.renderer.elementId !== null || this.options.renderer.context) {
        this.initRenderer();
      }

      this.reset();
    }
  }, {
    key: 'initRenderer',
    value: function initRenderer() {
      var _options$renderer = this.options.renderer,
          elementId = _options$renderer.elementId,
          backend = _options$renderer.backend,
          width = _options$renderer.width,
          height = _options$renderer.height,
          background = _options$renderer.background;

      if (elementId === '') {
        throw new X('HTML DOM element not set in Factory');
      }

      this.context = _renderer.Renderer.buildContext(elementId, backend, width, height, background);
    }
  }, {
    key: 'getContext',
    value: function getContext() {
      return this.context;
    }
  }, {
    key: 'setContext',
    value: function setContext(context) {
      this.context = context;return this;
    }
  }, {
    key: 'getStave',
    value: function getStave() {
      return this.stave;
    }
  }, {
    key: 'getVoices',
    value: function getVoices() {
      return this.voices;
    }

    // Returns pixels from current stave spacing.

  }, {
    key: 'space',
    value: function space(spacing) {
      return this.options.stave.space * spacing;
    }
  }, {
    key: 'Stave',
    value: function Stave(params) {
      params = setDefaults(params, {
        x: 0,
        y: 0,
        width: this.options.renderer.width - this.space(1),
        options: {
          spacing_between_lines_px: this.options.stave.space
        }
      });

      var stave = new _stave.Stave(params.x, params.y, params.width, params.options);
      this.staves.push(stave);
      stave.setContext(this.context);
      this.stave = stave;
      return stave;
    }
  }, {
    key: 'TabStave',
    value: function TabStave(params) {
      params = setDefaults(params, {
        x: 0,
        y: 0,
        width: this.options.renderer.width - this.space(1),
        options: {
          spacing_between_lines_px: this.options.stave.space * 1.3
        }
      });

      var stave = new _tabstave.TabStave(params.x, params.y, params.width, params.options);
      this.staves.push(stave);
      stave.setContext(this.context);
      this.stave = stave;
      return stave;
    }
  }, {
    key: 'StaveNote',
    value: function StaveNote(noteStruct) {
      var note = new _stavenote.StaveNote(noteStruct);
      if (this.stave) note.setStave(this.stave);
      note.setContext(this.context);
      this.renderQ.push(note);
      return note;
    }
  }, {
    key: 'GhostNote',
    value: function GhostNote(noteStruct) {
      var ghostNote = new _ghostnote.GhostNote(noteStruct);
      if (this.stave) ghostNote.setStave(this.stave);
      ghostNote.setContext(this.context);
      this.renderQ.push(ghostNote);
      return ghostNote;
    }
  }, {
    key: 'TextNote',
    value: function TextNote(textNoteStruct) {
      var textNote = new _textnote.TextNote(textNoteStruct);
      if (this.stave) textNote.setStave(this.stave);
      textNote.setContext(this.context);
      this.renderQ.push(textNote);
      return textNote;
    }
  }, {
    key: 'BarNote',
    value: function BarNote(params) {
      params = setDefaults(params, {
        type: 'single',
        options: {}
      });

      var barNote = new _barnote.BarNote(params.type);
      if (this.stave) barNote.setStave(this.stave);
      barNote.setContext(this.context);
      this.renderQ.push(barNote);
      return barNote;
    }
  }, {
    key: 'ClefNote',
    value: function ClefNote(params) {
      params = setDefaults(params, {
        type: 'treble',
        options: {
          size: 'default'
        }
      });

      var clefNote = new _clefnote.ClefNote(params.type, params.options.size, params.options.annotation);
      if (this.stave) clefNote.setStave(this.stave);
      clefNote.setContext(this.context);
      this.renderQ.push(clefNote);
      return clefNote;
    }
  }, {
    key: 'TimeSigNote',
    value: function TimeSigNote(params) {
      params = setDefaults(params, {
        time: '4/4',
        options: {}
      });

      var timeSigNote = new _timesignote.TimeSigNote(params.time);
      if (this.stave) timeSigNote.setStave(this.stave);
      timeSigNote.setContext(this.context);
      this.renderQ.push(timeSigNote);
      return timeSigNote;
    }
  }, {
    key: 'TabNote',
    value: function TabNote(noteStruct) {
      var note = new _tabnote.TabNote(noteStruct);
      if (this.stave) note.setStave(this.stave);
      note.setContext(this.context);
      this.renderQ.push(note);
      return note;
    }
  }, {
    key: 'GraceNote',
    value: function GraceNote(noteStruct) {
      var note = new _gracenote.GraceNote(noteStruct);
      if (this.stave) note.setStave(this.stave);
      note.setContext(this.context);
      return note;
    }
  }, {
    key: 'GraceNoteGroup',
    value: function GraceNoteGroup(params) {
      var group = new _gracenotegroup.GraceNoteGroup(params.notes, params.slur);
      group.setContext(this.context);
      return group;
    }
  }, {
    key: 'Accidental',
    value: function Accidental(params) {
      params = setDefaults(params, {
        type: null,
        options: {}
      });

      var accid = new _accidental.Accidental(params.type);
      accid.setContext(this.context);
      return accid;
    }
  }, {
    key: 'Annotation',
    value: function Annotation(params) {
      params = setDefaults(params, {
        text: 'p',
        vJustify: 'below',
        hJustify: 'center',
        fontFamily: 'Times',
        fontSize: 14,
        fontWeight: 'bold italic',
        options: {}
      });

      var annotation = new _annotation.Annotation(params.text);
      annotation.setJustification(params.hJustify);
      annotation.setVerticalJustification(params.vJustify);
      annotation.setFont(params.fontFamily, params.fontSize, params.fontWeight);
      annotation.setContext(this.context);
      return annotation;
    }
  }, {
    key: 'Articulation',
    value: function Articulation(params) {
      params = setDefaults(params, {
        type: 'a.',
        position: 'above',
        options: {}
      });

      var articulation = new _articulation.Articulation(params.type);
      articulation.setPosition(params.position);
      articulation.setContext(this.context);
      return articulation;
    }
  }, {
    key: 'TextDynamics',
    value: function TextDynamics(params) {
      params = setDefaults(params, {
        text: 'p',
        duration: 'q',
        dots: 0,
        line: 0,
        options: {}
      });

      var text = new _textdynamics.TextDynamics({
        text: params.text,
        line: params.line,
        duration: params.duration,
        dots: params.dots
      });

      if (this.stave) text.setStave(this.stave);
      text.setContext(this.context);
      this.renderQ.push(text);
      return text;
    }
  }, {
    key: 'Fingering',
    value: function Fingering(params) {
      params = setDefaults(params, {
        number: '0',
        position: 'left',
        options: {}
      });

      var fingering = new _frethandfinger.FretHandFinger(params.number);
      fingering.setPosition(params.position);
      fingering.setContext(this.context);
      return fingering;
    }
  }, {
    key: 'StringNumber',
    value: function StringNumber(params) {
      params = setDefaults(params, {
        number: '0',
        position: 'left',
        options: {}
      });

      var stringNumber = new _stringnumber.StringNumber(params.number);
      stringNumber.setPosition(params.position);
      stringNumber.setContext(this.context);
      return stringNumber;
    }
  }, {
    key: 'TickContext',
    value: function TickContext() {
      return new _tickcontext.TickContext().setContext(this.context);
    }
  }, {
    key: 'ModifierContext',
    value: function ModifierContext() {
      return new _modifiercontext.ModifierContext();
    }
  }, {
    key: 'Voice',
    value: function Voice(params) {
      params = setDefaults(params, {
        time: '4/4',
        options: {}
      });
      var voice = new _voice.Voice(params.time);
      this.voices.push(voice);
      return voice;
    }
  }, {
    key: 'StaveConnector',
    value: function StaveConnector(params) {
      params = setDefaults(params, {
        top_stave: null,
        bottom_stave: null,
        type: 'double',
        options: {}
      });
      var connector = new _staveconnector.StaveConnector(params.top_stave, params.bottom_stave);
      connector.setType(params.type).setContext(this.context);
      this.renderQ.push(connector);
      return connector;
    }
  }, {
    key: 'Formatter',
    value: function Formatter() {
      return new _formatter.Formatter();
    }
  }, {
    key: 'Tuplet',
    value: function Tuplet(params) {
      params = setDefaults(params, {
        notes: [],
        options: {}
      });

      var tuplet = new _tuplet.Tuplet(params.notes, params.options).setContext(this.context);
      this.renderQ.push(tuplet);
      return tuplet;
    }
  }, {
    key: 'Beam',
    value: function Beam(params) {
      params = setDefaults(params, {
        notes: [],
        options: {
          autoStem: false,
          secondaryBeamBreaks: []
        }
      });

      var beam = new _beam.Beam(params.notes, params.options.autoStem).setContext(this.context);
      beam.breakSecondaryAt(params.options.secondaryBeamBreaks);
      this.renderQ.push(beam);
      return beam;
    }
  }, {
    key: 'Curve',
    value: function Curve(params) {
      params = setDefaults(params, {
        from: null,
        to: null,
        options: {}
      });

      var curve = new _curve.Curve(params.from, params.to, params.options).setContext(this.context);
      this.renderQ.push(curve);
      return curve;
    }
  }, {
    key: 'StaveTie',
    value: function StaveTie(params) {
      params = setDefaults(params, {
        from: null,
        to: null,
        first_indices: [0],
        last_indices: [0],
        text: null,
        options: {
          direction: undefined
        }
      });

      var tie = new _stavetie.StaveTie({
        first_note: params.from,
        last_note: params.to,
        first_indices: params.first_indices,
        last_indices: params.last_indices
      }, params.text);

      if (params.options.direction) tie.setDirection(params.options.direction);
      tie.setContext(this.context);
      this.renderQ.push(tie);
      return tie;
    }
  }, {
    key: 'StaveLine',
    value: function StaveLine(params) {
      params = setDefaults(params, {
        from: null,
        to: null,
        first_indices: [0],
        last_indices: [0],
        options: {}
      });

      var line = new _staveline.StaveLine({
        first_note: params.from,
        last_note: params.to,
        first_indices: params.first_indices,
        last_indices: params.last_indices
      });

      if (params.options.text) line.setText(params.options.text);
      if (params.options.font) line.setFont(params.options.font);

      line.setContext(this.context);
      this.renderQ.push(line);
      return line;
    }
  }, {
    key: 'VibratoBracket',
    value: function VibratoBracket(params) {
      params = setDefaults(params, {
        from: null,
        to: null,
        options: {
          harsh: false
        }
      });

      var vibratoBracket = new _vibratobracket.VibratoBracket({
        start: params.from,
        stop: params.to
      });

      if (params.options.line) vibratoBracket.setLine(params.options.line);
      if (params.options.harsh) vibratoBracket.setHarsh(params.options.harsh);

      vibratoBracket.setContext(this.context);
      this.renderQ.push(vibratoBracket);

      return vibratoBracket;
    }
  }, {
    key: 'TextBracket',
    value: function TextBracket(params) {
      params = setDefaults(params, {
        from: null,
        to: null,
        text: '',
        options: {
          superscript: '',
          position: 1
        }
      });

      var textBracket = new _textbracket.TextBracket({
        start: params.from,
        stop: params.to,
        text: params.text,
        superscript: params.options.superscript,
        position: params.options.position
      });

      if (params.options.line) textBracket.setLine(params.options.line);
      if (params.options.font) textBracket.setFont(params.options.font);

      textBracket.setContext(this.context);
      this.renderQ.push(textBracket);
      return textBracket;
    }
  }, {
    key: 'System',
    value: function System() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      params.factory = this;
      var system = new _system.System(params).setContext(this.context);
      this.systems.push(system);
      return system;
    }
  }, {
    key: 'EasyScore',
    value: function EasyScore() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      params.factory = this;
      return new _easyscore.EasyScore(params);
    }
  }, {
    key: 'PedalMarking',
    value: function PedalMarking() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      params = setDefaults(params, {
        notes: [],
        options: {
          style: 'mixed'
        }
      });

      var pedal = new _pedalmarking.PedalMarking(params.notes);
      pedal.setStyle(_pedalmarking.PedalMarking.StylesString[params.options.style]);
      pedal.setContext(this.context);
      this.renderQ.push(pedal);
      return pedal;
    }
  }, {
    key: 'NoteSubGroup',
    value: function NoteSubGroup() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      params = setDefaults(params, {
        notes: [],
        options: {}
      });

      var group = new _notesubgroup.NoteSubGroup(params.notes);
      group.setContext(this.context);
      return group;
    }
  }, {
    key: 'draw',
    value: function draw() {
      var _this = this;

      this.systems.forEach(function (i) {
        return i.setContext(_this.context).format();
      });
      this.staves.forEach(function (i) {
        return i.setContext(_this.context).draw();
      });
      this.voices.forEach(function (i) {
        return i.setContext(_this.context).draw();
      });
      this.renderQ.forEach(function (i) {
        if (!i.isRendered()) i.setContext(_this.context).draw();
      });
      this.systems.forEach(function (i) {
        return i.setContext(_this.context).draw();
      });
      this.reset();
    }
  }], [{
    key: 'newFromElementId',
    value: function newFromElementId(elementId) {
      var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
      var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

      return new Factory({ renderer: { elementId: elementId, width: width, height: height } });
    }
  }]);

  return Factory;
}();