Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StemmableNote = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _stem = require('./stem');

var _glyph = require('./glyph');

var _note = require('./note');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// `StemmableNote` is an abstract interface for notes with optional stems.
// Examples of stemmable notes are `StaveNote` and `TabNote`

var StemmableNote = exports.StemmableNote = function (_Note) {
  _inherits(StemmableNote, _Note);

  function StemmableNote(note_struct) {
    _classCallCheck(this, StemmableNote);

    var _this = _possibleConstructorReturn(this, (StemmableNote.__proto__ || Object.getPrototypeOf(StemmableNote)).call(this, note_struct));

    _this.setAttribute('type', 'StemmableNote');

    _this.stem = null;
    _this.stemExtensionOverride = null;
    _this.beam = null;
    return _this;
  }

  // Get and set the note's `Stem`


  _createClass(StemmableNote, [{
    key: 'getStem',
    value: function getStem() {
      return this.stem;
    }
  }, {
    key: 'setStem',
    value: function setStem(stem) {
      this.stem = stem;return this;
    }

    // Builds and sets a new stem

  }, {
    key: 'buildStem',
    value: function buildStem() {
      var stem = new _stem.Stem();
      this.setStem(stem);
      return this;
    }
  }, {
    key: 'buildFlag',
    value: function buildFlag() {
      var glyph = this.glyph,
          beam = this.beam;

      var shouldRenderFlag = beam === null;

      if (glyph && glyph.flag && shouldRenderFlag) {
        var flagCode = this.getStemDirection() === _stem.Stem.DOWN ? glyph.code_flag_downstem : glyph.code_flag_upstem;

        this.flag = new _glyph.Glyph(flagCode, this.render_options.glyph_font_scale);
      }
    }

    // Get the full length of stem

  }, {
    key: 'getStemLength',
    value: function getStemLength() {
      return _stem.Stem.HEIGHT + this.getStemExtension();
    }

    // Get the number of beams for this duration

  }, {
    key: 'getBeamCount',
    value: function getBeamCount() {
      var glyph = this.getGlyph();

      if (glyph) {
        return glyph.beam_count;
      } else {
        return 0;
      }
    }

    // Get the minimum length of stem

  }, {
    key: 'getStemMinumumLength',
    value: function getStemMinumumLength() {
      var frac = _tables.Flow.durationToFraction(this.duration);
      var length = frac.value() <= 1 ? 0 : 20;
      // if note is flagged, cannot shorten beam
      switch (this.duration) {
        case '8':
          if (this.beam == null) length = 35;
          break;
        case '16':
          length = this.beam == null ? 35 : 25;
          break;
        case '32':
          length = this.beam == null ? 45 : 35;
          break;
        case '64':
          length = this.beam == null ? 50 : 40;
          break;
        case '128':
          length = this.beam == null ? 55 : 45;
          break;
        default:
          break;
      }
      return length;
    }

    // Get/set the direction of the stem

  }, {
    key: 'getStemDirection',
    value: function getStemDirection() {
      return this.stem_direction;
    }
  }, {
    key: 'setStemDirection',
    value: function setStemDirection(direction) {
      if (!direction) direction = _stem.Stem.UP;
      if (direction !== _stem.Stem.UP && direction !== _stem.Stem.DOWN) {
        throw new _vex.Vex.RERR('BadArgument', 'Invalid stem direction: ' + direction);
      }

      this.stem_direction = direction;
      if (this.stem) {
        this.stem.setDirection(direction);
        this.stem.setExtension(this.getStemExtension());
      }

      this.reset();
      if (this.flag) {
        this.buildFlag();
      }

      this.beam = null;
      if (this.preFormatted) {
        this.preFormat();
      }
      return this;
    }

    // Get the `x` coordinate of the stem

  }, {
    key: 'getStemX',
    value: function getStemX() {
      var x_begin = this.getAbsoluteX() + this.x_shift;
      var x_end = this.getAbsoluteX() + this.x_shift + this.getGlyphWidth();
      var stem_x = this.stem_direction === _stem.Stem.DOWN ? x_begin : x_end;
      return stem_x;
    }

    // Get the `x` coordinate for the center of the glyph.
    // Used for `TabNote` stems and stemlets over rests

  }, {
    key: 'getCenterGlyphX',
    value: function getCenterGlyphX() {
      return this.getAbsoluteX() + this.x_shift + this.getGlyphWidth() / 2;
    }

    // Get the stem extension for the current duration

  }, {
    key: 'getStemExtension',
    value: function getStemExtension() {
      var glyph = this.getGlyph();

      if (this.stemExtensionOverride != null) {
        return this.stemExtensionOverride;
      }

      if (glyph) {
        return this.getStemDirection() === 1 ? glyph.stem_up_extension : glyph.stem_down_extension;
      }

      return 0;
    }

    // Set the stem length to a specific. Will override the default length.

  }, {
    key: 'setStemLength',
    value: function setStemLength(height) {
      this.stemExtensionOverride = height - _stem.Stem.HEIGHT;
      return this;
    }

    // Get the top and bottom `y` values of the stem.

  }, {
    key: 'getStemExtents',
    value: function getStemExtents() {
      return this.stem.getExtents();
    }

    // Sets the current note's beam

  }, {
    key: 'setBeam',
    value: function setBeam(beam) {
      this.beam = beam;return this;
    }

    // Get the `y` value for the top/bottom modifiers at a specific `textLine`

  }, {
    key: 'getYForTopText',
    value: function getYForTopText(textLine) {
      var extents = this.getStemExtents();
      if (this.hasStem()) {
        return Math.min(this.stave.getYForTopText(textLine), extents.topY - this.render_options.annotation_spacing * (textLine + 1));
      } else {
        return this.stave.getYForTopText(textLine);
      }
    }
  }, {
    key: 'getYForBottomText',
    value: function getYForBottomText(textLine) {
      var extents = this.getStemExtents();
      if (this.hasStem()) {
        return Math.max(this.stave.getYForTopText(textLine), extents.baseY + this.render_options.annotation_spacing * textLine);
      } else {
        return this.stave.getYForBottomText(textLine);
      }
    }
  }, {
    key: 'hasFlag',
    value: function hasFlag() {
      return _tables.Flow.durationToGlyph(this.duration).flag && !this.beam;
    }

    // Post format the note

  }, {
    key: 'postFormat',
    value: function postFormat() {
      if (this.beam) this.beam.postFormat();

      this.postFormatted = true;

      return this;
    }

    // Render the stem onto the canvas

  }, {
    key: 'drawStem',
    value: function drawStem(stem_struct) {
      this.checkContext();
      this.setRendered();

      this.setStem(new _stem.Stem(stem_struct));
      this.stem.setContext(this.context).draw();
    }
  }]);

  return StemmableNote;
}(_note.Note);