Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FretHandFinger = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _modifier = require('./modifier');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // VexFlow - Music Engraving for HTML5
// Copyright Mohit Muthanna 2010
// Author Larry Kuhns 2013
// Class to draws string numbers into the notation.

/**
 * @constructor
 */
var FretHandFinger = exports.FretHandFinger = function (_Modifier) {
  _inherits(FretHandFinger, _Modifier);

  _createClass(FretHandFinger, null, [{
    key: 'format',


    // Arrange fingerings inside a ModifierContext.
    value: function format(nums, state) {
      var left_shift = state.left_shift,
          right_shift = state.right_shift;

      var num_spacing = 1;

      if (!nums || nums.length === 0) return false;

      var nums_list = [];
      var prev_note = null;
      var shiftLeft = 0;
      var shiftRight = 0;

      for (var i = 0; i < nums.length; ++i) {
        var num = nums[i];
        var note = num.getNote();
        var pos = num.getPosition();
        var props = note.getKeyProps()[num.getIndex()];
        if (note !== prev_note) {
          for (var n = 0; n < note.keys.length; ++n) {
            var props_tmp = note.getKeyProps()[n];
            if (left_shift === 0) {
              shiftLeft = props_tmp.displaced ? note.getExtraLeftPx() : shiftLeft;
            }
            if (right_shift === 0) {
              shiftRight = props_tmp.displaced ? note.getExtraRightPx() : shiftRight;
            }
          }
          prev_note = note;
        }

        nums_list.push({
          note: note,
          num: num,
          pos: pos,
          line: props.line,
          shiftL: shiftLeft,
          shiftR: shiftRight
        });
      }

      // Sort fingernumbers by line number.
      nums_list.sort(function (a, b) {
        return b.line - a.line;
      });

      var numShiftL = 0;
      var numShiftR = 0;
      var xWidthL = 0;
      var xWidthR = 0;
      var lastLine = null;
      var lastNote = null;

      for (var _i = 0; _i < nums_list.length; ++_i) {
        var num_shift = 0;
        var _nums_list$_i = nums_list[_i],
            _note = _nums_list$_i.note,
            _pos = _nums_list$_i.pos,
            _num = _nums_list$_i.num,
            line = _nums_list$_i.line,
            shiftL = _nums_list$_i.shiftL,
            shiftR = _nums_list$_i.shiftR;

        // Reset the position of the string number every line.

        if (line !== lastLine || _note !== lastNote) {
          numShiftL = left_shift + shiftL;
          numShiftR = right_shift + shiftR;
        }

        var numWidth = _num.getWidth() + num_spacing;
        if (_pos === _modifier.Modifier.Position.LEFT) {
          _num.setXShift(left_shift + numShiftL);
          num_shift = left_shift + numWidth; // spacing
          xWidthL = num_shift > xWidthL ? num_shift : xWidthL;
        } else if (_pos === _modifier.Modifier.Position.RIGHT) {
          _num.setXShift(numShiftR);
          num_shift = shiftRight + numWidth; // spacing
          xWidthR = num_shift > xWidthR ? num_shift : xWidthR;
        }
        lastLine = line;
        lastNote = _note;
      }

      state.left_shift += xWidthL;
      state.right_shift += xWidthR;

      return true;
    }
  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'frethandfinger';
    }
  }]);

  function FretHandFinger(number) {
    _classCallCheck(this, FretHandFinger);

    var _this = _possibleConstructorReturn(this, (FretHandFinger.__proto__ || Object.getPrototypeOf(FretHandFinger)).call(this));

    _this.setAttribute('type', 'FretHandFinger');

    _this.note = null;
    _this.index = null;
    _this.finger = number;
    _this.width = 7;
    _this.position = _modifier.Modifier.Position.LEFT; // Default position above stem or note head
    _this.x_shift = 0;
    _this.y_shift = 0;
    _this.x_offset = 0; // Horizontal offset from default
    _this.y_offset = 0; // Vertical offset from default
    _this.font = {
      family: 'sans-serif',
      size: 9,
      weight: 'bold'
    };
    return _this;
  }

  _createClass(FretHandFinger, [{
    key: 'getCategory',
    value: function getCategory() {
      return FretHandFinger.CATEGORY;
    }
  }, {
    key: 'setFretHandFinger',
    value: function setFretHandFinger(number) {
      this.finger = number;return this;
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
    key: 'draw',
    value: function draw() {
      this.checkContext();

      if (!this.note || this.index == null) {
        throw new _vex.Vex.RERR('NoAttachedNote', "Can't draw string number without a note and index.");
      }

      this.setRendered();
      var ctx = this.context;
      var start = this.note.getModifierStartXY(this.position, this.index);
      var dot_x = start.x + this.x_shift + this.x_offset;
      var dot_y = start.y + this.y_shift + this.y_offset + 5;

      switch (this.position) {
        case _modifier.Modifier.Position.ABOVE:
          dot_x -= 4;
          dot_y -= 12;
          break;
        case _modifier.Modifier.Position.BELOW:
          dot_x -= 2;
          dot_y += 10;
          break;
        case _modifier.Modifier.Position.LEFT:
          dot_x -= this.width;
          break;
        case _modifier.Modifier.Position.RIGHT:
          dot_x += 1;
          break;
        default:
          throw new _vex.Vex.RERR('InvalidPostion', 'The position ' + this.position + ' does not exist');
      }

      ctx.save();
      ctx.setFont(this.font.family, this.font.size, this.font.weight);
      ctx.fillText('' + this.finger, dot_x, dot_y);
      ctx.restore();
    }
  }]);

  return FretHandFinger;
}(_modifier.Modifier);