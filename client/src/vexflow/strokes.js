Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stroke = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _modifier = require('./modifier');

var _stavenote = require('./stavenote');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author: Larry Kuhns
//
// ## Description
// This file implements the `Stroke` class which renders chord strokes
// that can be arpeggiated, brushed, rasquedo, etc.

var Stroke = exports.Stroke = function (_Modifier) {
  _inherits(Stroke, _Modifier);

  _createClass(Stroke, null, [{
    key: 'format',


    // Arrange strokes inside `ModifierContext`
    value: function format(strokes, state) {
      var left_shift = state.left_shift;
      var stroke_spacing = 0;

      if (!strokes || strokes.length === 0) return this;

      var strokeList = strokes.map(function (stroke) {
        var note = stroke.getNote();
        if (note instanceof _stavenote.StaveNote) {
          var _note$getKeyProps$str = note.getKeyProps()[stroke.getIndex()],
              line = _note$getKeyProps$str.line,
              displaced = _note$getKeyProps$str.displaced;

          var shift = displaced ? note.getExtraLeftPx() : 0;
          return { line: line, shift: shift, stroke: stroke };
        } else {
          var string = note.getPositions()[stroke.getIndex()].str;

          return { line: string, shift: 0, stroke: stroke };
        }
      });

      var strokeShift = left_shift;

      // There can only be one stroke .. if more than one, they overlay each other
      var xShift = strokeList.reduce(function (xShift, _ref) {
        var stroke = _ref.stroke,
            shift = _ref.shift;

        stroke.setXShift(strokeShift + shift);
        return Math.max(stroke.getWidth() + stroke_spacing, xShift);
      }, 0);

      state.left_shift += xShift;
      return true;
    }
  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'strokes';
    }
  }, {
    key: 'Type',
    get: function get() {
      return {
        BRUSH_DOWN: 1,
        BRUSH_UP: 2,
        ROLL_DOWN: 3, // Arpegiated chord
        ROLL_UP: 4, // Arpegiated chord
        RASQUEDO_DOWN: 5,
        RASQUEDO_UP: 6
      };
    }
  }]);

  function Stroke(type, options) {
    _classCallCheck(this, Stroke);

    var _this = _possibleConstructorReturn(this, (Stroke.__proto__ || Object.getPrototypeOf(Stroke)).call(this));

    _this.setAttribute('type', 'Stroke');

    _this.note = null;
    _this.options = _vex.Vex.Merge({}, options);

    // multi voice - span stroke across all voices if true
    _this.all_voices = 'all_voices' in _this.options ? _this.options.all_voices : true;

    // multi voice - end note of stroke, set in draw()
    _this.note_end = null;
    _this.index = null;
    _this.type = type;
    _this.position = _modifier.Modifier.Position.LEFT;

    _this.render_options = {
      font_scale: 38,
      stroke_px: 3,
      stroke_spacing: 10
    };

    _this.font = {
      family: 'serif',
      size: 10,
      weight: 'bold italic'
    };

    _this.setXShift(0);
    _this.setWidth(10);
    return _this;
  }

  _createClass(Stroke, [{
    key: 'getCategory',
    value: function getCategory() {
      return Stroke.CATEGORY;
    }
  }, {
    key: 'getPosition',
    value: function getPosition() {
      return this.position;
    }
  }, {
    key: 'addEndNote',
    value: function addEndNote(note) {
      this.note_end = note;return this;
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      this.setRendered();

      if (!(this.note && this.index != null)) {
        throw new _vex.Vex.RERR('NoAttachedNote', "Can't draw stroke without a note and index.");
      }

      var start = this.note.getModifierStartXY(this.position, this.index);
      var ys = this.note.getYs();
      var topY = start.y;
      var botY = start.y;
      var x = start.x - 5;
      var line_space = this.note.stave.options.spacing_between_lines_px;

      var notes = this.getModifierContext().getModifiers(this.note.getCategory());
      for (var i = 0; i < notes.length; i++) {
        ys = notes[i].getYs();
        for (var n = 0; n < ys.length; n++) {
          if (this.note === notes[i] || this.all_voices) {
            topY = _vex.Vex.Min(topY, ys[n]);
            botY = _vex.Vex.Max(botY, ys[n]);
          }
        }
      }

      var arrow = void 0;
      var arrow_shift_x = void 0;
      var arrow_y = void 0;
      var text_shift_x = void 0;
      var text_y = void 0;
      switch (this.type) {
        case Stroke.Type.BRUSH_DOWN:
          arrow = 'vc3';
          arrow_shift_x = -3;
          arrow_y = topY - line_space / 2 + 10;
          botY += line_space / 2;
          break;
        case Stroke.Type.BRUSH_UP:
          arrow = 'v11';
          arrow_shift_x = 0.5;
          arrow_y = botY + line_space / 2;
          topY -= line_space / 2;
          break;
        case Stroke.Type.ROLL_DOWN:
        case Stroke.Type.RASQUEDO_DOWN:
          arrow = 'vc3';
          arrow_shift_x = -3;
          text_shift_x = this.x_shift + arrow_shift_x - 2;
          if (this.note instanceof _stavenote.StaveNote) {
            topY += 1.5 * line_space;
            if ((botY - topY) % 2 !== 0) {
              botY += 0.5 * line_space;
            } else {
              botY += line_space;
            }
            arrow_y = topY - line_space;
            text_y = botY + line_space + 2;
          } else {
            topY += 1.5 * line_space;
            botY += line_space;
            arrow_y = topY - 0.75 * line_space;
            text_y = botY + 0.25 * line_space;
          }
          break;
        case Stroke.Type.ROLL_UP:
        case Stroke.Type.RASQUEDO_UP:
          arrow = 'v52';
          arrow_shift_x = -4;
          text_shift_x = this.x_shift + arrow_shift_x - 1;
          if (this.note instanceof _stavenote.StaveNote) {
            arrow_y = line_space / 2;
            topY += 0.5 * line_space;
            if ((botY - topY) % 2 === 0) {
              botY += line_space / 2;
            }
            arrow_y = botY + 0.5 * line_space;
            text_y = topY - 1.25 * line_space;
          } else {
            topY += 0.25 * line_space;
            botY += 0.5 * line_space;
            arrow_y = botY + 0.25 * line_space;
            text_y = topY - line_space;
          }
          break;
        default:
          throw new _vex.Vex.RERR('InvalidType', 'The stroke type ' + this.type + ' does not exist');
      }

      // Draw the stroke
      if (this.type === Stroke.Type.BRUSH_DOWN || this.type === Stroke.Type.BRUSH_UP) {
        this.context.fillRect(x + this.x_shift, topY, 1, botY - topY);
      } else {
        if (this.note instanceof _stavenote.StaveNote) {
          for (var _i = topY; _i <= botY; _i += line_space) {
            _glyph.Glyph.renderGlyph(this.context, x + this.x_shift - 4, _i, this.render_options.font_scale, 'va3');
          }
        } else {
          var _i2 = void 0;
          for (_i2 = topY; _i2 <= botY; _i2 += 10) {
            _glyph.Glyph.renderGlyph(this.context, x + this.x_shift - 4, _i2, this.render_options.font_scale, 'va3');
          }
          if (this.type === Stroke.Type.RASQUEDO_DOWN) {
            text_y = _i2 + 0.25 * line_space;
          }
        }
      }

      // Draw the arrow head
      _glyph.Glyph.renderGlyph(this.context, x + this.x_shift + arrow_shift_x, arrow_y, this.render_options.font_scale, arrow);

      // Draw the rasquedo "R"
      if (this.type === Stroke.Type.RASQUEDO_DOWN || this.type === Stroke.Type.RASQUEDO_UP) {
        this.context.save();
        this.context.setFont(this.font.family, this.font.size, this.font.weight);
        this.context.fillText('R', x + text_shift_x, text_y);
        this.context.restore();
      }
    }
  }]);

  return Stroke;
}(_modifier.Modifier);