'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaveSection = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stavemodifier = require('./stavemodifier');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author Larry Kuhns 2011

var StaveSection = exports.StaveSection = function (_StaveModifier) {
  _inherits(StaveSection, _StaveModifier);

  _createClass(StaveSection, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'stavesection';
    }
  }]);

  function StaveSection(section, x, shift_y) {
    _classCallCheck(this, StaveSection);

    var _this = _possibleConstructorReturn(this, (StaveSection.__proto__ || Object.getPrototypeOf(StaveSection)).call(this));

    _this.setAttribute('type', 'StaveSection');

    _this.setWidth(16);
    _this.section = section;
    _this.x = x;
    _this.shift_x = 0;
    _this.shift_y = shift_y;
    _this.font = {
      family: 'sans-serif',
      size: 12,
      weight: 'bold'
    };
    return _this;
  }

  _createClass(StaveSection, [{
    key: 'getCategory',
    value: function getCategory() {
      return StaveSection.CATEGORY;
    }
  }, {
    key: 'setStaveSection',
    value: function setStaveSection(section) {
      this.section = section;return this;
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

      ctx.save();
      ctx.lineWidth = 2;
      ctx.setFont(this.font.family, this.font.size, this.font.weight);
      var text_width = ctx.measureText('' + this.section).width;
      var width = text_width + 6; // add left & right padding
      if (width < 18) width = 18;
      var height = 20;
      //  Seems to be a good default y
      var y = stave.getYForTopText(3) + this.shift_y;
      var x = this.x + shift_x;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.rect(x, y, width, height);
      ctx.stroke();
      x += (width - text_width) / 2;
      ctx.fillText('' + this.section, x, y + 16);
      ctx.restore();
      return this;
    }
  }]);

  return StaveSection;
}(_stavemodifier.StaveModifier);