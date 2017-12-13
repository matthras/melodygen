Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Barline = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tables = require('./tables');

var _stavemodifier = require('./stavemodifier');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// Author Larry Kuhns 2011

var Barline = exports.Barline = function (_StaveModifier) {
  _inherits(Barline, _StaveModifier);

  _createClass(Barline, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'barlines';
    }
  }, {
    key: 'type',
    get: function get() {
      return {
        SINGLE: 1,
        DOUBLE: 2,
        END: 3,
        REPEAT_BEGIN: 4,
        REPEAT_END: 5,
        REPEAT_BOTH: 6,
        NONE: 7
      };
    }
  }, {
    key: 'typeString',
    get: function get() {
      return {
        single: Barline.type.SINGLE,
        double: Barline.type.DOUBLE,
        end: Barline.type.END,
        repeatBegin: Barline.type.REPEAT_BEGIN,
        repeatEnd: Barline.type.REPEAT_END,
        repeatBoth: Barline.type.REPEAT_BOTH,
        none: Barline.type.NONE
      };
    }

    /**
     * @constructor
     */

  }]);

  function Barline(type) {
    _classCallCheck(this, Barline);

    var _this = _possibleConstructorReturn(this, (Barline.__proto__ || Object.getPrototypeOf(Barline)).call(this));

    _this.setAttribute('type', 'Barline');
    _this.thickness = _tables.Flow.STAVE_LINE_THICKNESS;

    var TYPE = Barline.type;
    _this.widths = {};
    _this.widths[TYPE.SINGLE] = 5;
    _this.widths[TYPE.DOUBLE] = 5;
    _this.widths[TYPE.END] = 5;
    _this.widths[TYPE.REPEAT_BEGIN] = 5;
    _this.widths[TYPE.REPEAT_END] = 5;
    _this.widths[TYPE.REPEAT_BOTH] = 5;
    _this.widths[TYPE.NONE] = 5;

    _this.paddings = {};
    _this.paddings[TYPE.SINGLE] = 0;
    _this.paddings[TYPE.DOUBLE] = 0;
    _this.paddings[TYPE.END] = 0;
    _this.paddings[TYPE.REPEAT_BEGIN] = 15;
    _this.paddings[TYPE.REPEAT_END] = 15;
    _this.paddings[TYPE.REPEAT_BOTH] = 15;
    _this.paddings[TYPE.NONE] = 0;

    _this.setPosition(_stavemodifier.StaveModifier.Position.BEGIN);
    _this.setType(type);
    return _this;
  }

  _createClass(Barline, [{
    key: 'getCategory',
    value: function getCategory() {
      return Barline.CATEGORY;
    }
  }, {
    key: 'getType',
    value: function getType() {
      return this.type;
    }
  }, {
    key: 'setType',
    value: function setType(type) {
      this.type = typeof type === 'string' ? Barline.typeString[type] : type;

      this.setWidth(this.widths[this.type]);
      this.setPadding(this.paddings[this.type]);
      return this;
    }

    // Draw barlines

  }, {
    key: 'draw',
    value: function draw(stave) {
      stave.checkContext();
      this.setRendered();

      switch (this.type) {
        case Barline.type.SINGLE:
          this.drawVerticalBar(stave, this.x, false);
          break;
        case Barline.type.DOUBLE:
          this.drawVerticalBar(stave, this.x, true);
          break;
        case Barline.type.END:
          this.drawVerticalEndBar(stave, this.x);
          break;
        case Barline.type.REPEAT_BEGIN:
          // If the barline is shifted over (in front of clef/time/key)
          // Draw vertical bar at the beginning.
          this.drawRepeatBar(stave, this.x, true);
          if (stave.getX() !== this.x) {
            this.drawVerticalBar(stave, stave.getX());
          }

          break;
        case Barline.type.REPEAT_END:
          this.drawRepeatBar(stave, this.x, false);
          break;
        case Barline.type.REPEAT_BOTH:
          this.drawRepeatBar(stave, this.x, false);
          this.drawRepeatBar(stave, this.x, true);
          break;
        default:
          // Default is NONE, so nothing to draw
          break;
      }
    }
  }, {
    key: 'drawVerticalBar',
    value: function drawVerticalBar(stave, x, double_bar) {
      stave.checkContext();
      var topY = stave.getTopLineTopY();
      var botY = stave.getBottomLineBottomY();
      if (double_bar) {
        stave.context.fillRect(x - 3, topY, 1, botY - topY);
      }
      stave.context.fillRect(x, topY, 1, botY - topY);
    }
  }, {
    key: 'drawVerticalEndBar',
    value: function drawVerticalEndBar(stave, x) {
      stave.checkContext();
      var topY = stave.getTopLineTopY();
      var botY = stave.getBottomLineBottomY();
      stave.context.fillRect(x - 5, topY, 1, botY - topY);
      stave.context.fillRect(x - 2, topY, 3, botY - topY);
    }
  }, {
    key: 'drawRepeatBar',
    value: function drawRepeatBar(stave, x, begin) {
      stave.checkContext();

      var topY = stave.getTopLineTopY();
      var botY = stave.getBottomLineBottomY();
      var x_shift = 3;

      if (!begin) {
        x_shift = -5;
      }

      stave.context.fillRect(x + x_shift, topY, 1, botY - topY);
      stave.context.fillRect(x - 2, topY, 3, botY - topY);

      var dot_radius = 2;

      // Shift dots left or right
      if (begin) {
        x_shift += 4;
      } else {
        x_shift -= 4;
      }

      var dot_x = x + x_shift + dot_radius / 2;

      // calculate the y offset based on number of stave lines
      var y_offset = (stave.getNumLines() - 1) * stave.getSpacingBetweenLines();
      y_offset = y_offset / 2 - stave.getSpacingBetweenLines() / 2;
      var dot_y = topY + y_offset + dot_radius / 2;

      // draw the top repeat dot
      stave.context.beginPath();
      stave.context.arc(dot_x, dot_y, dot_radius, 0, Math.PI * 2, false);
      stave.context.fill();

      // draw the bottom repeat dot
      dot_y += stave.getSpacingBetweenLines();
      stave.context.beginPath();
      stave.context.arc(dot_x, dot_y, dot_radius, 0, Math.PI * 2, false);
      stave.context.fill();
    }
  }]);

  return Barline;
}(_stavemodifier.StaveModifier);