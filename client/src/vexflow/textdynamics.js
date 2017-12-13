Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextDynamics = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _note = require('./note');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This file implements the `TextDynamics` which renders traditional
// text dynamics markings, **ie: p, f, sfz, rfz, ppp**
//
// You can render any dynamics string that contains a combination of
// the following letters:  P, M, F, Z, R, S

// To enable logging for this class. Set `Vex.Flow.TextDynamics.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (TextDynamics.DEBUG) _vex.Vex.L('Vex.Flow.TextDynamics', args);
}

var TextDynamics = exports.TextDynamics = function (_Note) {
  _inherits(TextDynamics, _Note);

  _createClass(TextDynamics, null, [{
    key: 'GLYPHS',

    // The glyph data for each dynamics letter
    get: function get() {
      return {
        'f': {
          code: 'vba',
          width: 12
        },
        'p': {
          code: 'vbf',
          width: 14
        },
        'm': {
          code: 'v62',
          width: 17
        },
        's': {
          code: 'v4a',
          width: 10
        },
        'z': {
          code: 'v80',
          width: 12
        },
        'r': {
          code: 'vb1',
          width: 12
        }
      };
    }

    // A `TextDynamics` object inherits from `Note` so that it can be formatted
    // within a `Voice`.
    // Create the dynamics marking. `text_struct` is an object
    // that contains a `duration` property and a `sequence` of
    // letters that represents the letters to render

  }]);

  function TextDynamics(text_struct) {
    _classCallCheck(this, TextDynamics);

    var _this = _possibleConstructorReturn(this, (TextDynamics.__proto__ || Object.getPrototypeOf(TextDynamics)).call(this, text_struct));

    _this.setAttribute('type', 'TextDynamics');

    _this.sequence = text_struct.text.toLowerCase();
    _this.line = text_struct.line || 0;
    _this.glyphs = [];

    _vex.Vex.Merge(_this.render_options, {
      glyph_font_size: 40
    });

    L('New Dynamics Text: ', _this.sequence);
    return _this;
  }

  // Set the Stave line on which the note should be placed


  _createClass(TextDynamics, [{
    key: 'setLine',
    value: function setLine(line) {
      this.line = line;
      return this;
    }

    // Preformat the dynamics text

  }, {
    key: 'preFormat',
    value: function preFormat() {
      var _this2 = this;

      var total_width = 0;
      // Iterate through each letter
      this.sequence.split('').forEach(function (letter) {
        // Get the glyph data for the letter
        var glyph_data = TextDynamics.GLYPHS[letter];
        if (!glyph_data) throw new _vex.Vex.RERR('Invalid dynamics character: ' + letter);

        var size = _this2.render_options.glyph_font_size;
        var glyph = new _glyph.Glyph(glyph_data.code, size);

        // Add the glyph
        _this2.glyphs.push(glyph);

        total_width += glyph_data.width;
      });

      // Store the width of the text
      this.setWidth(total_width);
      this.preFormatted = true;
      return this;
    }

    // Draw the dynamics text on the rendering context

  }, {
    key: 'draw',
    value: function draw() {
      var _this3 = this;

      this.setRendered();
      var x = this.getAbsoluteX();
      var y = this.stave.getYForLine(this.line + -3);

      L('Rendering Dynamics: ', this.sequence);

      var letter_x = x;
      this.glyphs.forEach(function (glyph, index) {
        var current_letter = _this3.sequence[index];
        glyph.render(_this3.context, letter_x, y);
        letter_x += TextDynamics.GLYPHS[current_letter].width;
      });
    }
  }]);

  return TextDynamics;
}(_note.Note);