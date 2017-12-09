'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Repetition = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stavemodifier = require('./stavemodifier');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author Larry Kuhns 2011

var Repetition = exports.Repetition = function (_StaveModifier) {
  _inherits(Repetition, _StaveModifier);

  _createClass(Repetition, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'repetitions';
    }
  }, {
    key: 'type',
    get: function get() {
      return {
        NONE: 1, // no coda or segno
        CODA_LEFT: 2, // coda at beginning of stave
        CODA_RIGHT: 3, // coda at end of stave
        SEGNO_LEFT: 4, // segno at beginning of stave
        SEGNO_RIGHT: 5, // segno at end of stave
        DC: 6, // D.C. at end of stave
        DC_AL_CODA: 7, // D.C. al coda at end of stave
        DC_AL_FINE: 8, // D.C. al Fine end of stave
        DS: 9, // D.S. at end of stave
        DS_AL_CODA: 10, // D.S. al coda at end of stave
        DS_AL_FINE: 11, // D.S. al Fine at end of stave
        FINE: 12 // Fine at end of stave
      };
    }
  }]);

  function Repetition(type, x, y_shift) {
    _classCallCheck(this, Repetition);

    var _this = _possibleConstructorReturn(this, (Repetition.__proto__ || Object.getPrototypeOf(Repetition)).call(this));

    _this.setAttribute('type', 'Repetition');

    _this.symbol_type = type;
    _this.x = x;
    _this.x_shift = 0;
    _this.y_shift = y_shift;
    _this.font = {
      family: 'times',
      size: 12,
      weight: 'bold italic'
    };
    return _this;
  }

  _createClass(Repetition, [{
    key: 'getCategory',
    value: function getCategory() {
      return Repetition.CATEGORY;
    }
  }, {
    key: 'setShiftX',
    value: function setShiftX(x) {
      this.x_shift = x;return this;
    }
  }, {
    key: 'setShiftY',
    value: function setShiftY(y) {
      this.y_shift = y;return this;
    }
  }, {
    key: 'draw',
    value: function draw(stave, x) {
      this.setRendered();

      switch (this.symbol_type) {
        case Repetition.type.CODA_RIGHT:
          this.drawCodaFixed(stave, x + stave.width);
          break;
        case Repetition.type.CODA_LEFT:
          this.drawSymbolText(stave, x, 'Coda', true);
          break;
        case Repetition.type.SEGNO_LEFT:
          this.drawSignoFixed(stave, x);
          break;
        case Repetition.type.SEGNO_RIGHT:
          this.drawSignoFixed(stave, x + stave.width);
          break;
        case Repetition.type.DC:
          this.drawSymbolText(stave, x, 'D.C.', false);
          break;
        case Repetition.type.DC_AL_CODA:
          this.drawSymbolText(stave, x, 'D.C. al', true);
          break;
        case Repetition.type.DC_AL_FINE:
          this.drawSymbolText(stave, x, 'D.C. al Fine', false);
          break;
        case Repetition.type.DS:
          this.drawSymbolText(stave, x, 'D.S.', false);
          break;
        case Repetition.type.DS_AL_CODA:
          this.drawSymbolText(stave, x, 'D.S. al', true);
          break;
        case Repetition.type.DS_AL_FINE:
          this.drawSymbolText(stave, x, 'D.S. al Fine', false);
          break;
        case Repetition.type.FINE:
          this.drawSymbolText(stave, x, 'Fine', false);
          break;
        default:
          break;
      }

      return this;
    }
  }, {
    key: 'drawCodaFixed',
    value: function drawCodaFixed(stave, x) {
      var y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
      _glyph.Glyph.renderGlyph(stave.context, this.x + x + this.x_shift, y + 25, 40, 'v4d', true);
      return this;
    }
  }, {
    key: 'drawSignoFixed',
    value: function drawSignoFixed(stave, x) {
      var y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
      _glyph.Glyph.renderGlyph(stave.context, this.x + x + this.x_shift, y + 25, 30, 'v8c', true);
      return this;
    }
  }, {
    key: 'drawSymbolText',
    value: function drawSymbolText(stave, x, text, draw_coda) {
      var ctx = stave.checkContext();

      ctx.save();
      ctx.setFont(this.font.family, this.font.size, this.font.weight);
      // Default to right symbol
      var text_x = 0 + this.x_shift;
      var symbol_x = x + this.x_shift;
      if (this.symbol_type === Repetition.type.CODA_LEFT) {
        // Offset Coda text to right of stave beginning
        text_x = this.x + stave.options.vertical_bar_width;
        symbol_x = text_x + ctx.measureText(text).width + 12;
      } else {
        // Offset Signo text to left stave end
        symbol_x = this.x + x + stave.width - 5 + this.x_shift;
        text_x = symbol_x - +ctx.measureText(text).width - 12;
      }

      var y = stave.getYForTopText(stave.options.num_lines) + this.y_shift;
      if (draw_coda) {
        _glyph.Glyph.renderGlyph(ctx, symbol_x, y, 40, 'v4d', true);
      }

      ctx.fillText(text, text_x, y + 5);
      ctx.restore();

      return this;
    }
  }]);

  return Repetition;
}(_stavemodifier.StaveModifier);