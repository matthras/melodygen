'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoteSubGroup = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _modifier = require('./modifier');

var _formatter = require('./formatter');

var _voice = require('./voice');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author Taehoon Moon 2016
//
// ## Description
//
// This file implements `NoteSubGroup` which is used to format and
// render notes as a `Modifier`
// ex) ClefNote, TimeSigNote and BarNote.

var NoteSubGroup = exports.NoteSubGroup = function (_Modifier) {
  _inherits(NoteSubGroup, _Modifier);

  _createClass(NoteSubGroup, null, [{
    key: 'format',


    // Arrange groups inside a `ModifierContext`
    value: function format(groups, state) {
      if (!groups || groups.length === 0) return false;

      var width = 0;
      for (var i = 0; i < groups.length; ++i) {
        var group = groups[i];
        group.preFormat();
        width += group.getWidth();
      }

      state.left_shift += width;
      return true;
    }
  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'notesubgroup';
    }
  }]);

  function NoteSubGroup(subNotes) {
    var _ret;

    _classCallCheck(this, NoteSubGroup);

    var _this = _possibleConstructorReturn(this, (NoteSubGroup.__proto__ || Object.getPrototypeOf(NoteSubGroup)).call(this));

    _this.setAttribute('type', 'NoteSubGroup');

    _this.note = null;
    _this.index = null;
    _this.position = _modifier.Modifier.Position.LEFT;
    _this.subNotes = subNotes;
    _this.subNotes.forEach(function (subNote) {
      subNote.ignore_ticks = false;
    });
    _this.width = 0;
    _this.preFormatted = false;

    _this.formatter = new _formatter.Formatter();
    _this.voice = new _voice.Voice({
      num_beats: 4,
      beat_value: 4,
      resolution: _tables.Flow.RESOLUTION
    }).setStrict(false);

    _this.voice.addTickables(_this.subNotes);

    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  _createClass(NoteSubGroup, [{
    key: 'getCategory',
    value: function getCategory() {
      return NoteSubGroup.CATEGORY;
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
    key: 'draw',
    value: function draw() {
      var _this2 = this;

      this.checkContext();

      var note = this.getNote();

      if (!(note && this.index !== null)) {
        throw new _vex.Vex.RuntimeError('NoAttachedNote', "Can't draw notes without a parent note and parent note index.");
      }

      this.setRendered();
      var alignSubNotesWithNote = function alignSubNotesWithNote(subNotes, note) {
        // Shift over the tick contexts of each note
        var tickContext = note.getTickContext();
        var extraPx = tickContext.getExtraPx();
        var x = tickContext.getX() - extraPx.left - extraPx.extraLeft + _this2.getSpacingFromNextModifier();

        subNotes.forEach(function (subNote) {
          var tick_context = subNote.getTickContext();
          var x_offset = tick_context.getX();
          subNote.setStave(note.stave);
          tick_context.setX(x + x_offset);
        });
      };

      alignSubNotesWithNote(this.subNotes, note, this.width);

      // Draw notes
      this.subNotes.forEach(function (subNote) {
        return subNote.setContext(_this2.context).draw();
      });
    }
  }]);

  return NoteSubGroup;
}(_modifier.Modifier);