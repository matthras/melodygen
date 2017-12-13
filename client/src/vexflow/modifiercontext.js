Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModifierContext = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This class implements various types of modifiers to notes (e.g. bends,
// fingering positions etc.)

var _vex = require('./vex');

var _stavenote = require('./stavenote');

var _dot = require('./dot');

var _frethandfinger = require('./frethandfinger');

var _accidental = require('./accidental');

var _notesubgroup = require('./notesubgroup');

var _gracenotegroup = require('./gracenotegroup');

var _strokes = require('./strokes');

var _stringnumber = require('./stringnumber');

var _articulation = require('./articulation');

var _ornament = require('./ornament');

var _annotation = require('./annotation');

var _bend = require('./bend');

var _vibrato = require('./vibrato');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// To enable logging for this class. Set `Vex.Flow.ModifierContext.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (ModifierContext.DEBUG) _vex.Vex.L('Vex.Flow.ModifierContext', args);
}

var ModifierContext = exports.ModifierContext = function () {
  function ModifierContext() {
    _classCallCheck(this, ModifierContext);

    // Current modifiers
    this.modifiers = {};

    // Formatting data.
    this.preFormatted = false;
    this.postFormatted = false;
    this.width = 0;
    this.spacing = 0;
    this.state = {
      left_shift: 0,
      right_shift: 0,
      text_line: 0,
      top_text_line: 0
    };

    // Add new modifiers to this array. The ordering is significant -- lower
    // modifiers are formatted and rendered before higher ones.
    this.PREFORMAT = [_stavenote.StaveNote, _dot.Dot, _frethandfinger.FretHandFinger, _accidental.Accidental, _gracenotegroup.GraceNoteGroup, _notesubgroup.NoteSubGroup, _strokes.Stroke, _stringnumber.StringNumber, _articulation.Articulation, _ornament.Ornament, _annotation.Annotation, _bend.Bend, _vibrato.Vibrato];

    // If post-formatting is required for an element, add it to this array.
    this.POSTFORMAT = [_stavenote.StaveNote];
  }

  _createClass(ModifierContext, [{
    key: 'addModifier',
    value: function addModifier(modifier) {
      var type = modifier.getCategory();
      if (!this.modifiers[type]) this.modifiers[type] = [];
      this.modifiers[type].push(modifier);
      modifier.setModifierContext(this);
      this.preFormatted = false;
      return this;
    }
  }, {
    key: 'getModifiers',
    value: function getModifiers(type) {
      return this.modifiers[type];
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }
  }, {
    key: 'getExtraLeftPx',
    value: function getExtraLeftPx() {
      return this.state.left_shift;
    }
  }, {
    key: 'getExtraRightPx',
    value: function getExtraRightPx() {
      return this.state.right_shift;
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.state;
    }
  }, {
    key: 'getMetrics',
    value: function getMetrics() {
      if (!this.formatted) {
        throw new _vex.Vex.RERR('UnformattedModifier', 'Unformatted modifier has no metrics.');
      }

      return {
        width: this.state.left_shift + this.state.right_shift + this.spacing,
        spacing: this.spacing,
        extra_left_px: this.state.left_shift,
        extra_right_px: this.state.right_shift
      };
    }
  }, {
    key: 'preFormat',
    value: function preFormat() {
      var _this = this;

      if (this.preFormatted) return;
      this.PREFORMAT.forEach(function (modifier) {
        L('Preformatting ModifierContext: ', modifier.CATEGORY);
        modifier.format(_this.getModifiers(modifier.CATEGORY), _this.state, _this);
      });

      // Update width of this modifier context
      this.width = this.state.left_shift + this.state.right_shift;
      this.preFormatted = true;
    }
  }, {
    key: 'postFormat',
    value: function postFormat() {
      var _this2 = this;

      if (this.postFormatted) return;
      this.POSTFORMAT.forEach(function (modifier) {
        L('Postformatting ModifierContext: ', modifier.CATEGORY);
        modifier.postFormat(_this2.getModifiers(modifier.CATEGORY), _this2);
      });
    }
  }]);

  return ModifierContext;
}();