Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeSigNote = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _boundingbox = require('./boundingbox');

var _note = require('./note');

var _timesignature = require('./timesignature');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author Taehoon Moon 2014

var TimeSigNote = exports.TimeSigNote = function (_Note) {
  _inherits(TimeSigNote, _Note);

  function TimeSigNote(timeSpec, customPadding) {
    _classCallCheck(this, TimeSigNote);

    var _this = _possibleConstructorReturn(this, (TimeSigNote.__proto__ || Object.getPrototypeOf(TimeSigNote)).call(this, { duration: 'b' }));

    _this.setAttribute('type', 'TimeSigNote');

    var timeSignature = new _timesignature.TimeSignature(timeSpec, customPadding);
    _this.timeSig = timeSignature.getTimeSig();
    _this.setWidth(_this.timeSig.glyph.getMetrics().width);

    // Note properties
    _this.ignore_ticks = true;
    return _this;
  }

  _createClass(TimeSigNote, [{
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
      this.setPreFormatted(true);
      return this;
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.stave.checkContext();
      this.setRendered();

      if (!this.timeSig.glyph.getContext()) {
        this.timeSig.glyph.setContext(this.context);
      }

      this.timeSig.glyph.setStave(this.stave);
      this.timeSig.glyph.setYShift(this.stave.getYForLine(this.timeSig.line) - this.stave.getYForGlyphs());
      this.timeSig.glyph.renderToStave(this.getAbsoluteX());
    }
  }]);

  return TimeSigNote;
}(_note.Note);