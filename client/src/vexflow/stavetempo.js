Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaveTempo = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tables = require('./tables');

var _modifier = require('./modifier');

var _stavemodifier = require('./stavemodifier');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author Radosaw Eichler 2012

var StaveTempo = exports.StaveTempo = function (_StaveModifier) {
  _inherits(StaveTempo, _StaveModifier);

  _createClass(StaveTempo, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'stavetempo';
    }
  }]);

  function StaveTempo(tempo, x, shift_y) {
    _classCallCheck(this, StaveTempo);

    var _this = _possibleConstructorReturn(this, (StaveTempo.__proto__ || Object.getPrototypeOf(StaveTempo)).call(this));

    _this.setAttribute('type', 'StaveTempo');

    _this.tempo = tempo;
    _this.position = _modifier.Modifier.Position.ABOVE;
    _this.x = x;
    _this.shift_x = 10;
    _this.shift_y = shift_y;
    _this.font = {
      family: 'times',
      size: 14,
      weight: 'bold'
    };
    _this.render_options = {
      glyph_font_scale: 30 // font size for note
    };
    return _this;
  }

  _createClass(StaveTempo, [{
    key: 'getCategory',
    value: function getCategory() {
      return StaveTempo.CATEGORY;
    }
  }, {
    key: 'setTempo',
    value: function setTempo(tempo) {
      this.tempo = tempo;return this;
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
    key: 'draw',
    value: function draw(stave, shift_x) {
      var ctx = stave.checkContext();
      this.setRendered();

      var options = this.render_options;
      // FIXME: What does the '38' mean? Why 38? Is that supposed to
      // be the default font size for standard notation?
      var scale = options.glyph_font_scale / 38;
      var name = this.tempo.name;
      var duration = this.tempo.duration;
      var dots = this.tempo.dots;
      var bpm = this.tempo.bpm;
      var font = this.font;
      var x = this.x + this.shift_x + shift_x;
      var y = stave.getYForTopText(1) + this.shift_y;

      ctx.save();

      if (name) {
        ctx.setFont(font.family, font.size, font.weight);
        ctx.fillText(name, x, y);
        x += ctx.measureText(name).width;
      }

      if (duration && bpm) {
        ctx.setFont(font.family, font.size, 'normal');

        if (name) {
          x += ctx.measureText(' ').width;
          ctx.fillText('(', x, y);
          x += ctx.measureText('(').width;
        }

        var code = _tables.Flow.durationToGlyph(duration);

        x += 3 * scale;
        _glyph.Glyph.renderGlyph(ctx, x, y, options.glyph_font_scale, code.code_head);
        x += code.getWidth() * scale;

        // Draw stem and flags
        if (code.stem) {
          var stem_height = 30;

          if (code.beam_count) stem_height += 3 * (code.beam_count - 1);

          stem_height *= scale;

          var y_top = y - stem_height;
          ctx.fillRect(x - scale, y_top, scale, stem_height);

          if (code.flag) {
            _glyph.Glyph.renderGlyph(ctx, x, y_top, options.glyph_font_scale, code.code_flag_upstem);

            if (!dots) x += 6 * scale;
          }
        }

        // Draw dot
        for (var i = 0; i < dots; i++) {
          x += 6 * scale;
          ctx.beginPath();
          ctx.arc(x, y + 2 * scale, 2 * scale, 0, Math.PI * 2, false);
          ctx.fill();
        }

        ctx.fillText(' = ' + bpm + (name ? ')' : ''), x + 3 * scale, y);
      }

      ctx.restore();
      return this;
    }
  }]);

  return StaveTempo;
}(_stavemodifier.StaveModifier);