'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.System = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _element = require('./element');

var _factory = require('./factory');

var _formatter = require('./formatter');

var _note = require('./note');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// This class implements a musical system, which is a collection of staves,
// each which can have one or more voices. All voices across all staves in
// the system are formatted together.

function setDefaults(params, defaults) {
  var default_options = defaults.options;
  params = Object.assign(defaults, params);
  params.options = Object.assign(default_options, params.options);
  return params;
}

var System = exports.System = function (_Element) {
  _inherits(System, _Element);

  function System() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, System);

    var _this = _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).call(this));

    _this.setAttribute('type', 'System');
    _this.setOptions(params);
    _this.parts = [];
    return _this;
  }

  _createClass(System, [{
    key: 'setOptions',
    value: function setOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.options = setDefaults(options, {
        x: 10,
        y: 10,
        width: 500,
        connector: null,
        spaceBetweenStaves: 12, // stave spaces
        factory: null,
        debugFormatter: false,
        formatIterations: 0, // number of formatter tuning steps
        options: {}
      });

      this.factory = this.options.factory || new _factory.Factory({ renderer: { el: null } });
    }
  }, {
    key: 'setContext',
    value: function setContext(context) {
      _get(System.prototype.__proto__ || Object.getPrototypeOf(System.prototype), 'setContext', this).call(this, context);
      this.factory.setContext(context);
      return this;
    }
  }, {
    key: 'addConnector',
    value: function addConnector() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'double';

      this.connector = this.factory.StaveConnector({
        top_stave: this.parts[0].stave,
        bottom_stave: this.parts[this.parts.length - 1].stave,
        type: type
      });
      return this.connector;
    }
  }, {
    key: 'addStave',
    value: function addStave(params) {
      var _this2 = this;

      params = setDefaults(params, {
        stave: null,
        voices: [],
        spaceAbove: 0, // stave spaces
        spaceBelow: 0, // stave spaces
        debugNoteMetrics: false,
        options: {}
      });

      if (!params.stave) {
        var options = { left_bar: false };
        params.stave = this.factory.Stave({
          x: this.options.x,
          y: this.options.y,
          width: this.options.width,
          options: options
        });
      }

      params.voices.forEach(function (voice) {
        return voice.setContext(_this2.context).setStave(params.stave).getTickables().forEach(function (tickable) {
          return tickable.setStave(params.stave);
        });
      });

      this.parts.push(params);
      return params.stave;
    }
  }, {
    key: 'format',
    value: function format() {
      var _this3 = this;

      var formatter = new _formatter.Formatter();
      this.formatter = formatter;

      var y = this.options.y;
      var startX = 0;
      var allVoices = [];
      var debugNoteMetricsYs = [];

      // Join the voices for each stave.
      this.parts.forEach(function (part) {
        y = y + part.stave.space(part.spaceAbove);
        part.stave.setY(y);
        formatter.joinVoices(part.voices);
        y = y + part.stave.space(part.spaceBelow);
        y = y + part.stave.space(_this3.options.spaceBetweenStaves);
        if (part.debugNoteMetrics) {
          debugNoteMetricsYs.push({ y: y, voice: part.voices[0] });
          y += 15;
        }
        allVoices = allVoices.concat(part.voices);

        startX = Math.max(startX, part.stave.getNoteStartX());
      });

      // Update the start position of all staves.
      this.parts.forEach(function (part) {
        return part.stave.setNoteStartX(startX);
      });
      var justifyWidth = this.options.width - (startX - this.options.x) - _note.Note.STAVEPADDING;
      formatter.format(allVoices, justifyWidth);

      for (var i = 0; i < this.options.formatIterations; i++) {
        formatter.tune();
      }

      this.startX = startX;
      this.debugNoteMetricsYs = debugNoteMetricsYs;
      this.lastY = y;
    }
  }, {
    key: 'draw',
    value: function draw() {
      // Render debugging information, if requested.
      var ctx = this.checkContext();
      this.setRendered();

      if (this.options.debugFormatter) {
        _formatter.Formatter.plotDebugging(ctx, this.formatter, this.startX, this.options.y, this.lastY);
      }

      this.debugNoteMetricsYs.forEach(function (d) {
        d.voice.getTickables().forEach(function (note) {
          return _note.Note.plotMetrics(ctx, note, d.y);
        });
      });
    }
  }]);

  return System;
}(_element.Element);