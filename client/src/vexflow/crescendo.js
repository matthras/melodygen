'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Crescendo = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _note = require('./note');

var _tickcontext = require('./tickcontext');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This file implements the `Crescendo` object which draws crescendos and
// decrescendo dynamics markings. A `Crescendo` is initialized with a
// duration and formatted as part of a `Voice` like any other `Note`
// type in VexFlow. This object would most likely be formatted in a Voice
// with `TextNotes` - which are used to represent other dynamics markings.

// To enable logging for this class. Set `Vex.Flow.Crescendo.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (Crescendo.DEBUG) _vex.Vex.L('Vex.Flow.Crescendo', args);
}

// Private helper to draw the hairpin
function renderHairpin(ctx, params) {
  var begin_x = params.begin_x;
  var end_x = params.end_x;
  var y = params.y;
  var half_height = params.height / 2;

  ctx.beginPath();

  if (params.reverse) {
    ctx.moveTo(begin_x, y - half_height);
    ctx.lineTo(end_x, y);
    ctx.lineTo(begin_x, y + half_height);
  } else {
    ctx.moveTo(end_x, y - half_height);
    ctx.lineTo(begin_x, y);
    ctx.lineTo(end_x, y + half_height);
  }

  ctx.stroke();
  ctx.closePath();
}

var Crescendo = exports.Crescendo = function (_Note) {
  _inherits(Crescendo, _Note);

  // Initialize the crescendo's properties
  function Crescendo(note_struct) {
    _classCallCheck(this, Crescendo);

    var _this = _possibleConstructorReturn(this, (Crescendo.__proto__ || Object.getPrototypeOf(Crescendo)).call(this, note_struct));

    _this.setAttribute('type', 'Crescendo');

    // Whether the object is a decrescendo
    _this.decrescendo = false;

    // The staff line to be placed on
    _this.line = note_struct.line || 0;

    // The height at the open end of the cresc/decresc
    _this.height = 15;

    _vex.Vex.Merge(_this.render_options, {
      // Extensions to the length of the crescendo on either side
      extend_left: 0,
      extend_right: 0,
      // Vertical shift
      y_shift: 0
    });
    return _this;
  }

  // Set the line to center the element on


  _createClass(Crescendo, [{
    key: 'setLine',
    value: function setLine(line) {
      this.line = line;return this;
    }

    // Set the full height at the open end

  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      this.height = height;return this;
    }

    // Set whether the sign should be a descresendo by passing a bool
    // to `decresc`

  }, {
    key: 'setDecrescendo',
    value: function setDecrescendo(decresc) {
      this.decrescendo = decresc;
      return this;
    }

    // Preformat the note

  }, {
    key: 'preFormat',
    value: function preFormat() {
      this.preFormatted = true;return this;
    }

    // Render the Crescendo object onto the canvas

  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      this.setRendered();

      var tick_context = this.getTickContext();
      var next_context = _tickcontext.TickContext.getNextContext(tick_context);

      var begin_x = this.getAbsoluteX();
      var end_x = next_context ? next_context.getX() : this.stave.x + this.stave.width;
      var y = this.stave.getYForLine(this.line + -3) + 1;

      L('Drawing ', this.decrescendo ? 'decrescendo ' : 'crescendo ', this.height, 'x', begin_x - end_x);

      renderHairpin(this.context, {
        begin_x: begin_x - this.render_options.extend_left,
        end_x: end_x + this.render_options.extend_right,
        y: y + this.render_options.y_shift,
        height: this.height,
        reverse: this.decrescendo
      });
    }
  }]);

  return Crescendo;
}(_note.Note);