'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dot = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _modifier = require('./modifier');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
//
// This class implements dot modifiers for notes.

var Dot = exports.Dot = function (_Modifier) {
  _inherits(Dot, _Modifier);

  _createClass(Dot, null, [{
    key: 'format',


    // Arrange dots inside a ModifierContext.
    value: function format(dots, state) {
      var right_shift = state.right_shift;
      var dot_spacing = 1;

      if (!dots || dots.length === 0) return false;

      var dot_list = [];
      for (var i = 0; i < dots.length; ++i) {
        var dot = dots[i];
        var note = dot.getNote();

        var props = void 0;
        var shift = void 0;
        // Only StaveNote has .getKeyProps()
        if (typeof note.getKeyProps === 'function') {
          props = note.getKeyProps()[dot.getIndex()];
          shift = props.displaced ? note.getExtraRightPx() : 0;
        } else {
          // Else it's a TabNote
          props = { line: 0.5 }; // Shim key props for dot placement
          shift = 0;
        }

        dot_list.push({ line: props.line, shift: shift, note: note, dot: dot });
      }

      // Sort dots by line number.
      dot_list.sort(function (a, b) {
        return b.line - a.line;
      });

      var dot_shift = right_shift;
      var x_width = 0;
      var last_line = null;
      var last_note = null;
      var prev_dotted_space = null;
      var half_shiftY = 0;

      for (var _i = 0; _i < dot_list.length; ++_i) {
        var _dot_list$_i = dot_list[_i],
            _dot = _dot_list$_i.dot,
            _note = _dot_list$_i.note,
            _shift = _dot_list$_i.shift,
            line = _dot_list$_i.line;

        // Reset the position of the dot every line.

        if (line !== last_line || _note !== last_note) {
          dot_shift = _shift;
        }

        if (!_note.isRest() && line !== last_line) {
          if (Math.abs(line % 1) === 0.5) {
            // note is on a space, so no dot shift
            half_shiftY = 0;
          } else if (!_note.isRest()) {
            // note is on a line, so shift dot to space above the line
            half_shiftY = 0.5;
            if (last_note != null && !last_note.isRest() && last_line - line === 0.5) {
              // previous note on a space, so shift dot to space below the line
              half_shiftY = -0.5;
            } else if (line + half_shiftY === prev_dotted_space) {
              // previous space is dotted, so shift dot to space below the line
              half_shiftY = -0.5;
            }
          }
        }

        // convert half_shiftY to a multiplier for dots.draw()
        _dot.dot_shiftY = -half_shiftY;
        prev_dotted_space = line + half_shiftY;

        _dot.setXShift(dot_shift);
        dot_shift += _dot.getWidth() + dot_spacing; // spacing
        x_width = dot_shift > x_width ? dot_shift : x_width;
        last_line = line;
        last_note = _note;
      }

      // Update state.
      state.right_shift += x_width;
      return true;
    }

    /**
     * @constructor
     */

  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'dots';
    }
  }]);

  function Dot() {
    _classCallCheck(this, Dot);

    var _this = _possibleConstructorReturn(this, (Dot.__proto__ || Object.getPrototypeOf(Dot)).call(this));

    _this.setAttribute('type', 'Dot');

    _this.note = null;
    _this.index = null;
    _this.position = _modifier.Modifier.Position.RIGHT;

    _this.radius = 2;
    _this.setWidth(5);
    _this.dot_shiftY = 0;
    return _this;
  }

  _createClass(Dot, [{
    key: 'getCategory',
    value: function getCategory() {
      return Dot.CATEGORY;
    }
  }, {
    key: 'setNote',
    value: function setNote(note) {
      this.note = note;

      if (this.note.getCategory() === 'gracenotes') {
        this.radius *= 0.50;
        this.setWidth(3);
      }
    }
  }, {
    key: 'setDotShiftY',
    value: function setDotShiftY(y) {
      this.dot_shiftY = y;return this;
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      this.setRendered();

      if (!this.note || this.index === null) {
        throw new _vex.Vex.RERR('NoAttachedNote', "Can't draw dot without a note and index.");
      }

      var lineSpace = this.note.stave.options.spacing_between_lines_px;

      var start = this.note.getModifierStartXY(this.position, this.index);

      // Set the starting y coordinate to the base of the stem for TabNotes
      if (this.note.getCategory() === 'tabnotes') {
        start.y = this.note.getStemExtents().baseY;
      }

      var x = start.x + this.x_shift + this.width - this.radius;
      var y = start.y + this.y_shift + this.dot_shiftY * lineSpace;
      var ctx = this.context;

      ctx.beginPath();
      ctx.arc(x, y, this.radius, 0, Math.PI * 2, false);
      ctx.fill();
    }
  }]);

  return Dot;
}(_modifier.Modifier);