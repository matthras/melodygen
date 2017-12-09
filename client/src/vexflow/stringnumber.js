'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StringNumber = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _modifier = require('./modifier');

var _renderer = require('./renderer');

var _stavenote = require('./stavenote');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author: Larry Kuhns
//
// ## Description
// This file implements the `StringNumber` class which renders string
// number annotations beside notes.

var StringNumber = exports.StringNumber = function (_Modifier) {
  _inherits(StringNumber, _Modifier);

  _createClass(StringNumber, null, [{
    key: 'format',


    // ## Static Methods
    // Arrange string numbers inside a `ModifierContext`
    value: function format(nums, state) {
      var left_shift = state.left_shift;
      var right_shift = state.right_shift;
      var num_spacing = 1;

      if (!nums || nums.length === 0) return this;

      var nums_list = [];
      var prev_note = null;
      var shift_left = 0;
      var shift_right = 0;

      var i = void 0;
      var num = void 0;
      var note = void 0;
      var pos = void 0;
      var props_tmp = void 0;
      for (i = 0; i < nums.length; ++i) {
        num = nums[i];
        note = num.getNote();

        for (i = 0; i < nums.length; ++i) {
          num = nums[i];
          note = num.getNote();
          pos = num.getPosition();
          var props = note.getKeyProps()[num.getIndex()];

          if (note !== prev_note) {
            for (var n = 0; n < note.keys.length; ++n) {
              props_tmp = note.getKeyProps()[n];
              if (left_shift === 0) {
                shift_left = props_tmp.displaced ? note.getExtraLeftPx() : shift_left;
              }
              if (right_shift === 0) {
                shift_right = props_tmp.displaced ? note.getExtraRightPx() : shift_right;
              }
            }
            prev_note = note;
          }

          nums_list.push({
            pos: pos,
            note: note,
            num: num,
            line: props.line,
            shiftL: shift_left,
            shiftR: shift_right
          });
        }
      }

      // Sort string numbers by line number.
      nums_list.sort(function (a, b) {
        return b.line - a.line;
      });

      // TODO: This variable never gets assigned to anything. Is that a bug or can this be removed?
      var num_shiftL = 0; // eslint-disable-line
      var num_shiftR = 0;
      var x_widthL = 0;
      var x_widthR = 0;
      var last_line = null;
      var last_note = null;
      for (i = 0; i < nums_list.length; ++i) {
        var num_shift = 0;
        note = nums_list[i].note;
        pos = nums_list[i].pos;
        num = nums_list[i].num;
        var line = nums_list[i].line;
        var shiftL = nums_list[i].shiftL;
        var shiftR = nums_list[i].shiftR;

        // Reset the position of the string number every line.
        if (line !== last_line || note !== last_note) {
          num_shiftL = left_shift + shiftL;
          num_shiftR = right_shift + shiftR;
        }

        var num_width = num.getWidth() + num_spacing;
        if (pos === _modifier.Modifier.Position.LEFT) {
          num.setXShift(left_shift);
          num_shift = shift_left + num_width; // spacing
          x_widthL = num_shift > x_widthL ? num_shift : x_widthL;
        } else if (pos === _modifier.Modifier.Position.RIGHT) {
          num.setXShift(num_shiftR);
          num_shift += num_width; // spacing
          x_widthR = num_shift > x_widthR ? num_shift : x_widthR;
        }
        last_line = line;
        last_note = note;
      }

      state.left_shift += x_widthL;
      state.right_shift += x_widthR;
      return true;
    }
  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'stringnumber';
    }
  }]);

  function StringNumber(number) {
    _classCallCheck(this, StringNumber);

    var _this = _possibleConstructorReturn(this, (StringNumber.__proto__ || Object.getPrototypeOf(StringNumber)).call(this));

    _this.setAttribute('type', 'StringNumber');

    _this.note = null;
    _this.last_note = null;
    _this.index = null;
    _this.string_number = number;
    _this.setWidth(20); // ???
    _this.position = _modifier.Modifier.Position.ABOVE; // Default position above stem or note head
    _this.x_shift = 0;
    _this.y_shift = 0;
    _this.x_offset = 0; // Horizontal offset from default
    _this.y_offset = 0; // Vertical offset from default
    _this.dashed = true; // true - draw dashed extension  false - no extension
    _this.leg = _renderer.Renderer.LineEndType.NONE; // draw upward/downward leg at the of extension line
    _this.radius = 8;
    _this.font = {
      family: 'sans-serif',
      size: 10,
      weight: 'bold'
    };
    return _this;
  }

  _createClass(StringNumber, [{
    key: 'getCategory',
    value: function getCategory() {
      return StringNumber.CATEGORY;
    }
  }, {
    key: 'getNote',
    value: function getNote() {
      return this.note;
    }
  }, {
    key: 'setNote',
    value: function setNote(note) {
      this.note = note;return this;
    }
  }, {
    key: 'getIndex',
    value: function getIndex() {
      return this.index;
    }
  }, {
    key: 'setIndex',
    value: function setIndex(index) {
      this.index = index;return this;
    }
  }, {
    key: 'setLineEndType',
    value: function setLineEndType(leg) {
      if (leg >= _renderer.Renderer.LineEndType.NONE && leg <= _renderer.Renderer.LineEndType.DOWN) {
        this.leg = leg;
      }
      return this;
    }
  }, {
    key: 'setStringNumber',
    value: function setStringNumber(number) {
      this.string_number = number;return this;
    }
  }, {
    key: 'setOffsetX',
    value: function setOffsetX(x) {
      this.x_offset = x;return this;
    }
  }, {
    key: 'setOffsetY',
    value: function setOffsetY(y) {
      this.y_offset = y;return this;
    }
  }, {
    key: 'setLastNote',
    value: function setLastNote(note) {
      this.last_note = note;return this;
    }
  }, {
    key: 'setDashed',
    value: function setDashed(dashed) {
      this.dashed = dashed;return this;
    }
  }, {
    key: 'draw',
    value: function draw() {
      var ctx = this.checkContext();
      if (!(this.note && this.index != null)) {
        throw new _vex.Vex.RERR('NoAttachedNote', "Can't draw string number without a note and index.");
      }
      this.setRendered();

      var line_space = this.note.stave.options.spacing_between_lines_px;

      var start = this.note.getModifierStartXY(this.position, this.index);
      var dot_x = start.x + this.x_shift + this.x_offset;
      var dot_y = start.y + this.y_shift + this.y_offset;

      switch (this.position) {
        case _modifier.Modifier.Position.ABOVE:
        case _modifier.Modifier.Position.BELOW:
          {
            var stem_ext = this.note.getStemExtents();
            var top = stem_ext.topY;
            var bottom = stem_ext.baseY + 2;

            if (this.note.stem_direction === _stavenote.StaveNote.STEM_DOWN) {
              top = stem_ext.baseY;
              bottom = stem_ext.topY - 2;
            }

            if (this.position === _modifier.Modifier.Position.ABOVE) {
              dot_y = this.note.hasStem() ? top - line_space * 1.75 : start.y - line_space * 1.75;
            } else {
              dot_y = this.note.hasStem() ? bottom + line_space * 1.5 : start.y + line_space * 1.75;
            }

            dot_y += this.y_shift + this.y_offset;

            break;
          }case _modifier.Modifier.Position.LEFT:
          dot_x -= this.radius / 2 + 5;
          break;
        case _modifier.Modifier.Position.RIGHT:
          dot_x += this.radius / 2 + 6;
          break;
        default:
          throw new _vex.Vex.RERR('InvalidPosition', 'The position ' + this.position + ' is invalid');
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(dot_x, dot_y, this.radius, 0, Math.PI * 2, false);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setFont(this.font.family, this.font.size, this.font.weight);
      var x = dot_x - ctx.measureText(this.string_number).width / 2;
      ctx.fillText('' + this.string_number, x, dot_y + 4.5);

      if (this.last_note != null) {
        var end = this.last_note.getStemX() - this.note.getX() + 5;
        ctx.strokeStyle = '#000000';
        ctx.lineCap = 'round';
        ctx.lineWidth = 0.6;
        if (this.dashed) {
          _renderer.Renderer.drawDashedLine(ctx, dot_x + 10, dot_y, dot_x + end, dot_y, [3, 3]);
        } else {
          _renderer.Renderer.drawDashedLine(ctx, dot_x + 10, dot_y, dot_x + end, dot_y, [3, 0]);
        }

        var len = void 0;
        var pattern = void 0;
        switch (this.leg) {
          case _renderer.Renderer.LineEndType.UP:
            len = -10;
            pattern = this.dashed ? [3, 3] : [3, 0];
            _renderer.Renderer.drawDashedLine(ctx, dot_x + end, dot_y, dot_x + end, dot_y + len, pattern);
            break;
          case _renderer.Renderer.LineEndType.DOWN:
            len = 10;
            pattern = this.dashed ? [3, 3] : [3, 0];
            _renderer.Renderer.drawDashedLine(ctx, dot_x + end, dot_y, dot_x + end, dot_y + len, pattern);
            break;
          default:
            break;
        }
      }

      ctx.restore();
    }
  }]);

  return StringNumber;
}(_modifier.Modifier);