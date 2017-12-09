'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BarNote = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _note = require('./note');

var _stavebarline = require('./stavebarline');

var _boundingbox = require('./boundingbox');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// A `BarNote` is used to render bar lines (from `barline.js`). `BarNote`s can
// be added to a voice and rendered in the middle of a stave. Since it has no
// duration, it consumes no `tick`s, and is dealt with appropriately by the formatter.
//
// See `tests/barnote_tests.js` for usage examples.

// To enable logging for this class. Set `Vex.Flow.BarNote.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (BarNote.DEBUG) _vex.Vex.L('Vex.Flow.BarNote', args);
}

var BarNote = exports.BarNote = function (_Note) {
  _inherits(BarNote, _Note);

  function BarNote() {
    var _this$metrics$widths;

    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _stavebarline.Barline.type.SINGLE;

    _classCallCheck(this, BarNote);

    var _this = _possibleConstructorReturn(this, (BarNote.__proto__ || Object.getPrototypeOf(BarNote)).call(this, { duration: 'b' }));

    _this.setAttribute('type', 'BarNote');

    _this.metrics = {
      widths: {}
    };

    var TYPE = _stavebarline.Barline.type;
    _this.metrics.widths = (_this$metrics$widths = {}, _defineProperty(_this$metrics$widths, TYPE.SINGLE, 8), _defineProperty(_this$metrics$widths, TYPE.DOUBLE, 12), _defineProperty(_this$metrics$widths, TYPE.END, 15), _defineProperty(_this$metrics$widths, TYPE.REPEAT_BEGIN, 14), _defineProperty(_this$metrics$widths, TYPE.REPEAT_END, 14), _defineProperty(_this$metrics$widths, TYPE.REPEAT_BOTH, 18), _defineProperty(_this$metrics$widths, TYPE.NONE, 0), _this$metrics$widths);

    // Tell the formatter that bar notes have no duration.
    _this.ignore_ticks = true;
    _this.setType(type);
    return _this;
  }

  // Get and set the type of Bar note. `type` must be one of `Vex.Flow.Barline.type`.


  _createClass(BarNote, [{
    key: 'getType',
    value: function getType() {
      return this.type;
    }
  }, {
    key: 'setType',
    value: function setType(type) {
      this.type = typeof type === 'string' ? _stavebarline.Barline.typeString[type] : type;

      // Set width to width of relevant `Barline`.
      this.setWidth(this.metrics.widths[this.type]);
      return this;
    }
  }, {
    key: 'getBoundingBox',
    value: function getBoundingBox() {
      return new _boundingbox.BoundingBox(0, 0, 0, 0);
    }
  }, {
    key: 'addToModifierContext',
    value: function addToModifierContext() {
      /* overridden to ignore */
      return this;
    }
  }, {
    key: 'preFormat',
    value: function preFormat() {
      /* overridden to ignore */
      this.setPreFormatted(true);
      return this;
    }

    // Render note to stave.

  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      if (!this.stave) throw new _vex.Vex.RERR('NoStave', "Can't draw without a stave.");
      L('Rendering bar line at: ', this.getAbsoluteX());
      var barline = new _stavebarline.Barline(this.type);
      barline.setX(this.getAbsoluteX());
      barline.draw(this.stave);
      this.setRendered();
    }
  }]);

  return BarNote;
}(_note.Note);