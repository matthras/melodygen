Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextNote = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _note = require('./note');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// `TextNote` is a notation element that is positioned in time. Generally
// meant for objects that sit above/below the staff and inline with each other.
// Examples of this would be such as dynamics, lyrics, chord changes, etc.

var TextNote = exports.TextNote = function (_Note) {
  _inherits(TextNote, _Note);

  _createClass(TextNote, null, [{
    key: 'Justification',
    get: function get() {
      return {
        LEFT: 1,
        CENTER: 2,
        RIGHT: 3
      };
    }

    // Glyph data

  }, {
    key: 'GLYPHS',
    get: function get() {
      return {
        'segno': {
          code: 'v8c',
          point: 40,
          x_shift: 0,
          y_shift: -10
          // width: 10 // optional
        },
        'tr': {
          code: 'v1f',
          point: 40,
          x_shift: 0,
          y_shift: 0
          // width: 10 // optional
        },
        'mordent_upper': {
          code: 'v1e',
          point: 40,
          x_shift: 0,
          y_shift: 0
          // width: 10 // optional
        },
        'mordent_lower': {
          code: 'v45',
          point: 40,
          x_shift: 0,
          y_shift: 0
          // width: 10 // optional
        },
        'f': {
          code: 'vba',
          point: 40,
          x_shift: 0,
          y_shift: 0
          // width: 10 // optional
        },
        'p': {
          code: 'vbf',
          point: 40,
          x_shift: 0,
          y_shift: 0
          // width: 10 // optional
        },
        'm': {
          code: 'v62',
          point: 40,
          x_shift: 0,
          y_shift: 0
          // width: 10 // optional
        },
        's': {
          code: 'v4a',
          point: 40,
          x_shift: 0,
          y_shift: 0
          // width: 10 // optional
        },
        'z': {
          code: 'v80',
          point: 40,
          x_shift: 0,
          y_shift: 0
          // width: 10 // optional
        },
        'coda': {
          code: 'v4d',
          point: 40,
          x_shift: 0,
          y_shift: -8
          // width: 10 // optional
        },
        'pedal_open': {
          code: 'v36',
          point: 40,
          x_shift: 0,
          y_shift: 0
        },
        'pedal_close': {
          code: 'v5d',
          point: 40,
          x_shift: 0,
          y_shift: 3
        },
        'caesura_straight': {
          code: 'v34',
          point: 40,
          x_shift: 0,
          y_shift: 2
        },
        'caesura_curved': {
          code: 'v4b',
          point: 40,
          x_shift: 0,
          y_shift: 2
        },
        'breath': {
          code: 'v6c',
          point: 40,
          x_shift: 0,
          y_shift: 0
        },
        'tick': {
          code: 'v6f',
          point: 50,
          x_shift: 0,
          y_shift: 0
        },
        'turn': {
          code: 'v72',
          point: 40,
          x_shift: 0,
          y_shift: 0
        },
        'turn_inverted': {
          code: 'v33',
          point: 40,
          x_shift: 0,
          y_shift: 0
        },

        // DEPRECATED - please use "mordent_upper" or "mordent_lower"
        'mordent': {
          code: 'v1e',
          point: 40,
          x_shift: 0,
          y_shift: 0
          // width: 10 // optional
        }
      };
    }
  }]);

  function TextNote(text_struct) {
    _classCallCheck(this, TextNote);

    var _this = _possibleConstructorReturn(this, (TextNote.__proto__ || Object.getPrototypeOf(TextNote)).call(this, text_struct));

    _this.setAttribute('type', 'TextNote');

    // Note properties
    _this.text = text_struct.text;
    _this.superscript = text_struct.superscript;
    _this.subscript = text_struct.subscript;
    _this.glyph_type = text_struct.glyph;
    _this.glyph = null;
    _this.font = {
      family: 'Arial',
      size: 12,
      weight: ''
    };

    // Set font
    if (text_struct.font) _this.font = text_struct.font;

    // Determine and set initial note width. Note that the text width is
    // an approximation and isn't very accurate. The only way to accurately
    // measure the length of text is with `canvasmeasureText()`
    if (_this.glyph_type) {
      var struct = TextNote.GLYPHS[_this.glyph_type];
      if (!struct) throw new _vex.Vex.RERR('Invalid glyph type: ' + _this.glyph_type);

      _this.glyph = new _glyph.Glyph(struct.code, struct.point, { cache: false });

      if (struct.width) {
        _this.setWidth(struct.width);
      } else {
        _this.setWidth(_this.glyph.getMetrics().width);
      }

      _this.glyph_struct = struct;
    } else {
      _this.setWidth(_tables.Flow.textWidth(_this.text));
    }
    _this.line = text_struct.line || 0;
    _this.smooth = text_struct.smooth || false;
    _this.ignore_ticks = text_struct.ignore_ticks || false;
    _this.justification = TextNote.Justification.LEFT;
    return _this;
  }

  // Set the horizontal justification of the TextNote


  _createClass(TextNote, [{
    key: 'setJustification',
    value: function setJustification(just) {
      this.justification = just;
      return this;
    }

    // Set the Stave line on which the note should be placed

  }, {
    key: 'setLine',
    value: function setLine(line) {
      this.line = line;
      return this;
    }

    // Pre-render formatting

  }, {
    key: 'preFormat',
    value: function preFormat() {
      this.checkContext();

      if (this.preFormatted) return;

      if (this.smooth) {
        this.setWidth(0);
      } else {
        if (this.glyph) {
          // Width already set.
        } else {
          this.setWidth(this.context.measureText(this.text).width);
        }
      }

      if (this.justification === TextNote.Justification.CENTER) {
        this.extraLeftPx = this.width / 2;
      } else if (this.justification === TextNote.Justification.RIGHT) {
        this.extraLeftPx = this.width;
      }

      this.setPreFormatted(true);
    }

    // Renders the TextNote

  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();

      if (!this.stave) {
        throw new _vex.Vex.RERR('NoStave', "Can't draw without a stave.");
      }

      this.setRendered();
      var ctx = this.context;
      var x = this.getAbsoluteX();
      if (this.justification === TextNote.Justification.CENTER) {
        x -= this.getWidth() / 2;
      } else if (this.justification === TextNote.Justification.RIGHT) {
        x -= this.getWidth();
      }

      var y = void 0;
      if (this.glyph) {
        y = this.stave.getYForLine(this.line + -3);
        this.glyph.render(this.context, x + this.glyph_struct.x_shift, y + this.glyph_struct.y_shift);
      } else {
        y = this.stave.getYForLine(this.line + -3);
        ctx.save();
        ctx.setFont(this.font.family, this.font.size, this.font.weight);
        ctx.fillText(this.text, x, y);

        // Width of the letter M gives us the approximate height of the text
        var height = ctx.measureText('M').width;
        // Get accurate width of text
        var width = ctx.measureText(this.text).width;

        // Write superscript
        if (this.superscript) {
          ctx.setFont(this.font.family, this.font.size / 1.3, this.font.weight);
          ctx.fillText(this.superscript, x + width + 2, y - height / 2.2);
        }

        // Write subscript
        if (this.subscript) {
          ctx.setFont(this.font.family, this.font.size / 1.3, this.font.weight);
          ctx.fillText(this.subscript, x + width + 2, y + height / 2.2 - 1);
        }

        ctx.restore();
      }
    }
  }]);

  return TextNote;
}(_note.Note);