'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraceNoteGroup = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _modifier = require('./modifier');

var _formatter = require('./formatter');

var _voice = require('./voice');

var _beam = require('./beam');

var _stavetie = require('./stavetie');

var _tabtie = require('./tabtie');

var _stavenote = require('./stavenote');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This file implements `GraceNoteGroup` which is used to format and
// render grace notes.

// To enable logging for this class. Set `Vex.Flow.GraceNoteGroup.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (GraceNoteGroup.DEBUG) _vex.Vex.L('Vex.Flow.GraceNoteGroup', args);
}

var GraceNoteGroup = exports.GraceNoteGroup = function (_Modifier) {
  _inherits(GraceNoteGroup, _Modifier);

  _createClass(GraceNoteGroup, null, [{
    key: 'format',


    // Arrange groups inside a `ModifierContext`
    value: function format(gracenote_groups, state) {
      var group_spacing_stave = 4;
      var group_spacing_tab = 0;

      if (!gracenote_groups || gracenote_groups.length === 0) return false;

      var group_list = [];
      var prev_note = null;
      var shiftL = 0;

      for (var i = 0; i < gracenote_groups.length; ++i) {
        var gracenote_group = gracenote_groups[i];
        var note = gracenote_group.getNote();
        var is_stavenote = note.getCategory() === _stavenote.StaveNote.CATEGORY;
        var spacing = is_stavenote ? group_spacing_stave : group_spacing_tab;

        if (is_stavenote && note !== prev_note) {
          // Iterate through all notes to get the displaced pixels
          for (var n = 0; n < note.keys.length; ++n) {
            var props_tmp = note.getKeyProps()[n];
            shiftL = props_tmp.displaced ? note.getExtraLeftPx() : shiftL;
          }
          prev_note = note;
        }

        group_list.push({ shift: shiftL, gracenote_group: gracenote_group, spacing: spacing });
      }

      // If first note left shift in case it is displaced
      var group_shift = group_list[0].shift;
      var formatWidth = void 0;
      for (var _i = 0; _i < group_list.length; ++_i) {
        var _gracenote_group = group_list[_i].gracenote_group;
        _gracenote_group.preFormat();
        formatWidth = _gracenote_group.getWidth() + group_list[_i].spacing;
        group_shift = Math.max(formatWidth, group_shift);
      }

      for (var _i2 = 0; _i2 < group_list.length; ++_i2) {
        var _gracenote_group2 = group_list[_i2].gracenote_group;
        formatWidth = _gracenote_group2.getWidth() + group_list[_i2].spacing;
        _gracenote_group2.setSpacingFromNextModifier(group_shift - Math.min(formatWidth, group_shift));
      }

      state.left_shift += group_shift;
      return true;
    }

    // ## Prototype Methods
    //
    // `GraceNoteGroup` inherits from `Modifier` and is placed inside a
    // `ModifierContext`.

  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'gracenotegroups';
    }
  }]);

  function GraceNoteGroup(grace_notes, show_slur) {
    var _ret;

    _classCallCheck(this, GraceNoteGroup);

    var _this = _possibleConstructorReturn(this, (GraceNoteGroup.__proto__ || Object.getPrototypeOf(GraceNoteGroup)).call(this));

    _this.setAttribute('type', 'GraceNoteGroup');

    _this.note = null;
    _this.index = null;
    _this.position = _modifier.Modifier.Position.LEFT;
    _this.grace_notes = grace_notes;
    _this.width = 0;

    _this.preFormatted = false;

    _this.show_slur = show_slur;
    _this.slur = null;

    _this.formatter = new _formatter.Formatter();
    _this.voice = new _voice.Voice({
      num_beats: 4,
      beat_value: 4,
      resolution: _tables.Flow.RESOLUTION
    }).setStrict(false);

    _this.render_options = {
      slur_y_shift: 0
    };

    _this.voice.addTickables(_this.grace_notes);

    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  _createClass(GraceNoteGroup, [{
    key: 'getCategory',
    value: function getCategory() {
      return GraceNoteGroup.CATEGORY;
    }
  }, {
    key: 'preFormat',
    value: function preFormat() {
      if (this.preFormatted) return;

      this.formatter.joinVoices([this.voice]).format([this.voice], 0);
      this.setWidth(this.formatter.getMinTotalWidth());
      this.preFormatted = true;
    }
  }, {
    key: 'beamNotes',
    value: function beamNotes() {
      if (this.grace_notes.length > 1) {
        var beam = new _beam.Beam(this.grace_notes);

        beam.render_options.beam_width = 3;
        beam.render_options.partial_beam_length = 4;

        this.beam = beam;
      }

      return this;
    }
  }, {
    key: 'setNote',
    value: function setNote(note) {
      this.note = note;
    }
  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      this.width = width;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }
  }, {
    key: 'getGraceNotes',
    value: function getGraceNotes() {
      return this.grace_notes;
    }
  }, {
    key: 'draw',
    value: function draw() {
      var _this2 = this;

      this.checkContext();

      var note = this.getNote();

      L('Drawing grace note group for:', note);

      if (!(note && this.index !== null)) {
        throw new _vex.Vex.RuntimeError('NoAttachedNote', "Can't draw grace note without a parent note and parent note index.");
      }

      this.setRendered();
      var that = this;
      function alignGraceNotesWithNote(grace_notes, note) {
        // Shift over the tick contexts of each note
        // So that th aligned with the note
        var tickContext = note.getTickContext();
        var extraPx = tickContext.getExtraPx();
        var x = tickContext.getX() - extraPx.left - extraPx.extraLeft + that.getSpacingFromNextModifier();

        grace_notes.forEach(function (graceNote) {
          var tick_context = graceNote.getTickContext();
          var x_offset = tick_context.getX();
          graceNote.setStave(note.stave);
          tick_context.setX(x + x_offset);
        });
      }

      alignGraceNotesWithNote(this.grace_notes, note, this.width);

      // Draw notes
      this.grace_notes.forEach(function (graceNote) {
        graceNote.setContext(_this2.context).draw();
      });

      // Draw beam
      if (this.beam) {
        this.beam.setContext(this.context).draw();
      }

      if (this.show_slur) {
        // Create and draw slur
        var is_stavenote = this.getNote().getCategory() === _stavenote.StaveNote.CATEGORY;
        var TieClass = is_stavenote ? _stavetie.StaveTie : _tabtie.TabTie;

        this.slur = new TieClass({
          last_note: this.grace_notes[0],
          first_note: note,
          first_indices: [0],
          last_indices: [0]
        });

        this.slur.render_options.cp2 = 12;
        this.slur.render_options.y_shift = (is_stavenote ? 7 : 5) + this.render_options.slur_y_shift;
        this.slur.setContext(this.context).draw();
      }
    }
  }]);

  return GraceNoteGroup;
}(_modifier.Modifier);