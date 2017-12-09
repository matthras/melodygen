'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabStave = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _stave = require('./stave');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.

var TabStave = exports.TabStave = function (_Stave) {
  _inherits(TabStave, _Stave);

  function TabStave(x, y, width, options) {
    _classCallCheck(this, TabStave);

    var tab_options = {
      spacing_between_lines_px: 13,
      num_lines: 6,
      top_text_position: 1
    };

    _vex.Vex.Merge(tab_options, options);

    var _this = _possibleConstructorReturn(this, (TabStave.__proto__ || Object.getPrototypeOf(TabStave)).call(this, x, y, width, tab_options));

    _this.setAttribute('type', 'TabStave');
    return _this;
  }

  _createClass(TabStave, [{
    key: 'getYForGlyphs',
    value: function getYForGlyphs() {
      return this.getYForLine(2.5);
    }

    // Deprecated

  }, {
    key: 'addTabGlyph',
    value: function addTabGlyph() {
      this.addClef('tab');
      return this;
    }
  }]);

  return TabStave;
}(_stave.Stave);