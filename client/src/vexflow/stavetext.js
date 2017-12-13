Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaveText = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _stavemodifier = require('./stavemodifier');

var _textnote = require('./textnote');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author Taehoon Moon 2014

var StaveText = exports.StaveText = function (_StaveModifier) {
  _inherits(StaveText, _StaveModifier);

  _createClass(StaveText, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'stavetext';
    }
  }]);

  function StaveText(text, position, options) {
    _classCallCheck(this, StaveText);

    var _this = _possibleConstructorReturn(this, (StaveText.__proto__ || Object.getPrototypeOf(StaveText)).call(this));

    _this.setAttribute('type', 'StaveText');

    _this.setWidth(16);
    _this.text = text;
    _this.position = position;
    _this.options = {
      shift_x: 0,
      shift_y: 0,
      justification: _textnote.TextNote.Justification.CENTER
    };
    _vex.Vex.Merge(_this.options, options);

    _this.font = {
      family: 'times',
      size: 16,
      weight: 'normal'
    };
    return _this;
  }

  _createClass(StaveText, [{
    key: 'getCategory',
    value: function getCategory() {
      return StaveText.CATEGORY;
    }
  }, {
    key: 'setStaveText',
    value: function setStaveText(text) {
      this.text = text;return this;
    }
  }, {
    key: 'setShiftX',
    value: function setShiftX(x) {
      this.shift_x = x;return this;
    }
  }, {
    key: 'setShiftY',
    value: function setShiftY(y) {
      this.shift_y = y;return this;
    }
  }, {
    key: 'setFont',
    value: function setFont(font) {
      _vex.Vex.Merge(this.font, font);
    }
  }, {
    key: 'setText',
    value: function setText(text) {
      this.text = text;
    }
  }, {
    key: 'draw',
    value: function draw(stave) {
      var ctx = stave.checkContext();
      this.setRendered();

      ctx.save();
      ctx.lineWidth = 2;
      ctx.setFont(this.font.family, this.font.size, this.font.weight);
      var text_width = ctx.measureText('' + this.text).width;

      var x = void 0;
      var y = void 0;
      var Position = _stavemodifier.StaveModifier.Position;
      var Justification = _textnote.TextNote.Justification;
      switch (this.position) {
        case Position.LEFT:
        case Position.RIGHT:
          y = (stave.getYForLine(0) + stave.getBottomLineY()) / 2 + this.options.shift_y;
          if (this.position === Position.LEFT) {
            x = stave.getX() - text_width - 24 + this.options.shift_x;
          } else {
            x = stave.getX() + stave.getWidth() + 24 + this.options.shift_x;
          }
          break;
        case Position.ABOVE:
        case Position.BELOW:
          x = stave.getX() + this.options.shift_x;
          if (this.options.justification === Justification.CENTER) {
            x += stave.getWidth() / 2 - text_width / 2;
          } else if (this.options.justification === Justification.RIGHT) {
            x += stave.getWidth() - text_width;
          }

          if (this.position === Position.ABOVE) {
            y = stave.getYForTopText(2) + this.options.shift_y;
          } else {
            y = stave.getYForBottomText(2) + this.options.shift_y;
          }
          break;
        default:
          throw new _vex.Vex.RERR('InvalidPosition', 'Value Must be in Modifier.Position.');
      }

      ctx.fillText('' + this.text, x, y + 4);
      ctx.restore();
      return this;
    }
  }]);

  return StaveText;
}(_stavemodifier.StaveModifier);