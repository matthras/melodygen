Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Volta = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stavemodifier = require('./stavemodifier');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author Larry Kuhns 2011

var Volta = exports.Volta = function (_StaveModifier) {
  _inherits(Volta, _StaveModifier);

  _createClass(Volta, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'voltas';
    }
  }, {
    key: 'type',
    get: function get() {
      return {
        NONE: 1,
        BEGIN: 2,
        MID: 3,
        END: 4,
        BEGIN_END: 5
      };
    }
  }]);

  function Volta(type, number, x, y_shift) {
    _classCallCheck(this, Volta);

    var _this = _possibleConstructorReturn(this, (Volta.__proto__ || Object.getPrototypeOf(Volta)).call(this));

    _this.setAttribute('type', 'Volta');
    _this.volta = type;
    _this.x = x;
    _this.y_shift = y_shift;
    _this.number = number;
    _this.font = {
      family: 'sans-serif',
      size: 9,
      weight: 'bold'
    };
    return _this;
  }

  _createClass(Volta, [{
    key: 'getCategory',
    value: function getCategory() {
      return Volta.CATEGORY;
    }
  }, {
    key: 'setShiftY',
    value: function setShiftY(y) {
      this.y_shift = y;return this;
    }
  }, {
    key: 'draw',
    value: function draw(stave, x) {
      var ctx = stave.checkContext();
      this.setRendered();

      var width = stave.width;
      var top_y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
      var vert_height = 1.5 * stave.options.spacing_between_lines_px;
      switch (this.volta) {
        case Volta.type.BEGIN:
          ctx.fillRect(this.x + x, top_y, 1, vert_height);
          break;
        case Volta.type.END:
          width -= 5;
          ctx.fillRect(this.x + x + width, top_y, 1, vert_height);
          break;
        case Volta.type.BEGIN_END:
          width -= 3;
          ctx.fillRect(this.x + x, top_y, 1, vert_height);
          ctx.fillRect(this.x + x + width, top_y, 1, vert_height);
          break;
        default:
          break;
      }
      // If the beginning of a volta, draw measure number
      if (this.volta === Volta.type.BEGIN || this.volta === Volta.type.BEGIN_END) {
        ctx.save();
        ctx.setFont(this.font.family, this.font.size, this.font.weight);
        ctx.fillText(this.number, this.x + x + 5, top_y + 15);
        ctx.restore();
      }

      ctx.fillRect(this.x + x, top_y, width, 1);
      return this;
    }
  }]);

  return Volta;
}(_stavemodifier.StaveModifier);