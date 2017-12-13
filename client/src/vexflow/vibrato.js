Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vibrato = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _modifier = require('./modifier');

var _bend = require('./bend');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This class implements vibratos.

var Vibrato = exports.Vibrato = function (_Modifier) {
  _inherits(Vibrato, _Modifier);

  _createClass(Vibrato, null, [{
    key: 'format',


    // ## Static Methods
    // Arrange vibratos inside a `ModifierContext`.
    value: function format(vibratos, state, context) {
      if (!vibratos || vibratos.length === 0) return false;

      // Vibratos are always on top.
      var text_line = state.top_text_line;
      var width = 0;
      var shift = state.right_shift - 7;

      // If there's a bend, drop the text line
      var bends = context.getModifiers(_bend.Bend.CATEGORY);
      if (bends && bends.length > 0) {
        text_line--;
      }

      // Format Vibratos
      for (var i = 0; i < vibratos.length; ++i) {
        var vibrato = vibratos[i];
        vibrato.setXShift(shift);
        vibrato.setTextLine(text_line);
        width += vibrato.getWidth();
        shift += width;
      }

      state.right_shift += width;
      state.top_text_line += 1;
      return true;
    }

    // ## Prototype Methods

  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'vibratos';
    }
  }]);

  function Vibrato() {
    _classCallCheck(this, Vibrato);

    var _this = _possibleConstructorReturn(this, (Vibrato.__proto__ || Object.getPrototypeOf(Vibrato)).call(this));

    _this.setAttribute('type', 'Vibrato');

    _this.position = _modifier.Modifier.Position.RIGHT;
    _this.render_options = {
      harsh: false,
      vibrato_width: 20,
      wave_height: 6,
      wave_width: 4,
      wave_girth: 2
    };

    _this.setVibratoWidth(_this.render_options.vibrato_width);
    return _this;
  }

  _createClass(Vibrato, [{
    key: 'getCategory',
    value: function getCategory() {
      return Vibrato.CATEGORY;
    }
  }, {
    key: 'setHarsh',
    value: function setHarsh(harsh) {
      this.render_options.harsh = harsh;return this;
    }
  }, {
    key: 'setVibratoWidth',
    value: function setVibratoWidth(width) {
      this.render_options.vibrato_width = width;
      this.setWidth(width);
      return this;
    }
  }, {
    key: 'draw',
    value: function draw() {
      var ctx = this.checkContext();

      if (!this.note) {
        throw new _vex.Vex.RERR('NoNoteForVibrato', "Can't draw vibrato without an attached note.");
      }

      this.setRendered();
      var start = this.note.getModifierStartXY(_modifier.Modifier.Position.RIGHT, this.index);

      var vx = start.x + this.x_shift;
      var vy = this.note.getYForTopText(this.text_line) + 2;

      Vibrato.renderVibrato(ctx, vx, vy, this.render_options);
    }

    // Static rendering method that can be called from
    // other classes (e.g. VibratoBracket)

  }], [{
    key: 'renderVibrato',
    value: function renderVibrato(ctx, x, y, opts) {
      var harsh = opts.harsh,
          vibrato_width = opts.vibrato_width,
          wave_width = opts.wave_width,
          wave_girth = opts.wave_girth,
          wave_height = opts.wave_height;

      var num_waves = vibrato_width / wave_width;

      ctx.beginPath();

      var i = void 0;
      if (harsh) {
        ctx.moveTo(x, y + wave_girth + 1);
        for (i = 0; i < num_waves / 2; ++i) {
          ctx.lineTo(x + wave_width, y - wave_height / 2);
          x += wave_width;
          ctx.lineTo(x + wave_width, y + wave_height / 2);
          x += wave_width;
        }
        for (i = 0; i < num_waves / 2; ++i) {
          ctx.lineTo(x - wave_width, y - wave_height / 2 + wave_girth + 1);
          x -= wave_width;
          ctx.lineTo(x - wave_width, y + wave_height / 2 + wave_girth + 1);
          x -= wave_width;
        }
        ctx.fill();
      } else {
        ctx.moveTo(x, y + wave_girth);
        for (i = 0; i < num_waves / 2; ++i) {
          ctx.quadraticCurveTo(x + wave_width / 2, y - wave_height / 2, x + wave_width, y);
          x += wave_width;
          ctx.quadraticCurveTo(x + wave_width / 2, y + wave_height / 2, x + wave_width, y);
          x += wave_width;
        }

        for (i = 0; i < num_waves / 2; ++i) {
          ctx.quadraticCurveTo(x - wave_width / 2, y + wave_height / 2 + wave_girth, x - wave_width, y + wave_girth);
          x -= wave_width;
          ctx.quadraticCurveTo(x - wave_width / 2, y - wave_height / 2 + wave_girth, x - wave_width, y + wave_girth);
          x -= wave_width;
        }
        ctx.fill();
      }
    }
  }]);

  return Vibrato;
}(_modifier.Modifier);