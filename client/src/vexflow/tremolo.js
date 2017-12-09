'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tremolo = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _modifier = require('./modifier');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author: Mike Corrigan <corrigan@gmail.com>
//
// This class implements tremolo notation.

var Tremolo = exports.Tremolo = function (_Modifier) {
  _inherits(Tremolo, _Modifier);

  _createClass(Tremolo, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'tremolo';
    }
  }]);

  function Tremolo(num) {
    _classCallCheck(this, Tremolo);

    var _this = _possibleConstructorReturn(this, (Tremolo.__proto__ || Object.getPrototypeOf(Tremolo)).call(this));

    _this.setAttribute('type', 'Tremolo');

    _this.num = num;
    _this.note = null;
    _this.index = null;
    _this.position = _modifier.Modifier.Position.CENTER;
    _this.code = 'v74';
    _this.shift_right = -2;
    _this.y_spacing = 4;

    _this.render_options = {
      font_scale: 35,
      stroke_px: 3,
      stroke_spacing: 10
    };

    _this.font = {
      family: 'Arial',
      size: 16,
      weight: ''
    };
    return _this;
  }

  _createClass(Tremolo, [{
    key: 'getCategory',
    value: function getCategory() {
      return Tremolo.CATEGORY;
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();

      if (!(this.note && this.index != null)) {
        throw new _vex.Vex.RERR('NoAttachedNote', "Can't draw Tremolo without a note and index.");
      }

      this.setRendered();
      var start = this.note.getModifierStartXY(this.position, this.index);
      var x = start.x;
      var y = start.y;

      x += this.shift_right;
      for (var i = 0; i < this.num; ++i) {
        _glyph.Glyph.renderGlyph(this.context, x, y, this.render_options.font_scale, this.code);
        y += this.y_spacing;
      }
    }
  }]);

  return Tremolo;
}(_modifier.Modifier);