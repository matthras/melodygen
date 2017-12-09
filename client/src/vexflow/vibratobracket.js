'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VibratoBracket = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

var _vibrato = require('./vibrato');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author: Balazs Forian-Szabo
//
// ## Description
//
// This file implements `VibratoBrackets`
// that renders vibrato effect between two notes.

// To enable logging for this class. Set `Vex.Flow.VibratoBracket.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (VibratoBracket.DEBUG) _vex.Vex.L('Vex.Flow.VibratoBracket', args);
}

var VibratoBracket = exports.VibratoBracket = function (_Element) {
  _inherits(VibratoBracket, _Element);

  // bracket_data = {
  //   start: Vex.Flow.Note (optional)
  //   stop: Vex.Flow.Note (optional)
  // };
  // Either the stop or start note must be set, or both of them.
  // A null value for the start or stop note indicates that the vibrato
  // is drawn from the beginning or until the end of the stave accordingly.
  function VibratoBracket(bracket_data) {
    _classCallCheck(this, VibratoBracket);

    var _this = _possibleConstructorReturn(this, (VibratoBracket.__proto__ || Object.getPrototypeOf(VibratoBracket)).call(this));

    _this.setAttribute('type', 'VibratoBracket');

    _this.start = bracket_data.start;
    _this.stop = bracket_data.stop;

    _this.line = 1;

    _this.render_options = {
      harsh: false,
      wave_height: 6,
      wave_width: 4,
      wave_girth: 2
    };
    return _this;
  }

  // Set line position of the vibrato bracket


  _createClass(VibratoBracket, [{
    key: 'setLine',
    value: function setLine(line) {
      this.line = line;return this;
    }
  }, {
    key: 'setHarsh',
    value: function setHarsh(harsh) {
      this.render_options.harsh = harsh;return this;
    }

    // Draw the vibrato bracket on the rendering context

  }, {
    key: 'draw',
    value: function draw() {
      var ctx = this.context;
      this.setRendered();

      var y = this.start ? this.start.getStave().getYForTopText(this.line) : this.stop.getStave().getYForTopText(this.line);

      // If start note is not set then vibrato will be drawn
      // from the beginning of the stave
      var start_x = this.start ? this.start.getAbsoluteX() : this.stop.getStave().getTieStartX();

      // If stop note is not set then vibrato will be drawn
      // until the end of the stave
      var stop_x = this.stop ? this.stop.getAbsoluteX() - this.stop.getWidth() - 5 : this.start.getStave().getTieEndX() - 10;

      this.render_options.vibrato_width = stop_x - start_x;

      L('Rendering VibratoBracket: start_x:', start_x, 'stop_x:', stop_x, 'y:', y);

      _vibrato.Vibrato.renderVibrato(ctx, start_x, y, this.render_options);
    }
  }]);

  return VibratoBracket;
}(_element.Element);