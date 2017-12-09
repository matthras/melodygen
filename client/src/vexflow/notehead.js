'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoteHead = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _note = require('./note');

var _stem = require('./stem');

var _stavenote = require('./stavenote');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This file implements `NoteHeads`. `NoteHeads` are typically not manipulated
// directly, but used internally in `StaveNote`.
//
// See `tests/notehead_tests.js` for usage examples.

// To enable logging for this class. Set `Vex.Flow.NoteHead.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (NoteHead.DEBUG) _vex.Vex.L('Vex.Flow.NoteHead', args);
}

// Draw slashnote head manually. No glyph exists for this.
//
// Parameters:
// * `ctx`: the Canvas context
// * `duration`: the duration of the note. ex: "4"
// * `x`: the x coordinate to draw at
// * `y`: the y coordinate to draw at
// * `stem_direction`: the direction of the stem
function drawSlashNoteHead(ctx, duration, x, y, stem_direction, staveSpace) {
  var width = _tables.Flow.SLASH_NOTEHEAD_WIDTH;
  ctx.save();
  ctx.setLineWidth(_tables.Flow.STEM_WIDTH);

  var fill = false;

  if (_tables.Flow.durationToNumber(duration) > 2) {
    fill = true;
  }

  if (!fill) x -= _tables.Flow.STEM_WIDTH / 2 * stem_direction;

  ctx.beginPath();
  ctx.moveTo(x, y + staveSpace);
  ctx.lineTo(x, y + 1);
  ctx.lineTo(x + width, y - staveSpace);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x, y + staveSpace);
  ctx.closePath();

  if (fill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }

  if (_tables.Flow.durationToFraction(duration).equals(0.5)) {
    var breve_lines = [-3, -1, width + 1, width + 3];
    for (var i = 0; i < breve_lines.length; i++) {
      ctx.beginPath();
      ctx.moveTo(x + breve_lines[i], y - 10);
      ctx.lineTo(x + breve_lines[i], y + 11);
      ctx.stroke();
    }
  }

  ctx.restore();
}

var NoteHead = exports.NoteHead = function (_Note) {
  _inherits(NoteHead, _Note);

  _createClass(NoteHead, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'notehead';
    }
  }]);

  function NoteHead(head_options) {
    _classCallCheck(this, NoteHead);

    var _this = _possibleConstructorReturn(this, (NoteHead.__proto__ || Object.getPrototypeOf(NoteHead)).call(this, head_options));

    _this.setAttribute('type', 'NoteHead');

    _this.index = head_options.index;
    _this.x = head_options.x || 0;
    _this.y = head_options.y || 0;
    _this.note_type = head_options.note_type;
    _this.duration = head_options.duration;
    _this.displaced = head_options.displaced || false;
    _this.stem_direction = head_options.stem_direction || _stavenote.StaveNote.STEM_UP;
    _this.line = head_options.line;

    // Get glyph code based on duration and note type. This could be
    // regular notes, rests, or other custom codes.
    _this.glyph = _tables.Flow.durationToGlyph(_this.duration, _this.note_type);
    if (!_this.glyph) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'No glyph found for duration \'' + _this.duration + '\' and type \'' + _this.note_type + '\'');
    }

    _this.glyph_code = _this.glyph.code_head;
    _this.x_shift = head_options.x_shift;
    if (head_options.custom_glyph_code) {
      _this.custom_glyph = true;
      _this.glyph_code = head_options.custom_glyph_code;
    }

    _this.style = head_options.style;
    _this.slashed = head_options.slashed;

    _vex.Vex.Merge(_this.render_options, {
      // font size for note heads
      glyph_font_scale: head_options.glyph_font_scale || _tables.Flow.DEFAULT_NOTATION_FONT_SCALE,
      // number of stroke px to the left and right of head
      stroke_px: 3
    });

    _this.setWidth(_this.glyph.getWidth(_this.render_options.glyph_font_scale));
    return _this;
  }

  _createClass(NoteHead, [{
    key: 'getCategory',
    value: function getCategory() {
      return NoteHead.CATEGORY;
    }

    // Get the width of the notehead

  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }

    // Determine if the notehead is displaced

  }, {
    key: 'isDisplaced',
    value: function isDisplaced() {
      return this.displaced === true;
    }

    // Get the glyph data

  }, {
    key: 'getGlyph',
    value: function getGlyph() {
      return this.glyph;
    }

    // Set the X coordinate

  }, {
    key: 'setX',
    value: function setX(x) {
      this.x = x;return this;
    }

    // get/set the Y coordinate

  }, {
    key: 'getY',
    value: function getY() {
      return this.y;
    }
  }, {
    key: 'setY',
    value: function setY(y) {
      this.y = y;return this;
    }

    // Get/set the stave line the notehead is placed on

  }, {
    key: 'getLine',
    value: function getLine() {
      return this.line;
    }
  }, {
    key: 'setLine',
    value: function setLine(line) {
      this.line = line;return this;
    }

    // Get the canvas `x` coordinate position of the notehead.

  }, {
    key: 'getAbsoluteX',
    value: function getAbsoluteX() {
      // If the note has not been preformatted, then get the static x value
      // Otherwise, it's been formatted and we should use it's x value relative
      // to its tick context
      var x = !this.preFormatted ? this.x : _get(NoteHead.prototype.__proto__ || Object.getPrototypeOf(NoteHead.prototype), 'getAbsoluteX', this).call(this);

      // For a more natural displaced notehead, we adjust the displacement amount
      // by half the stem width in order to maintain a slight overlap with the stem
      var displacementStemAdjustment = _stem.Stem.WIDTH / 2;

      return x + (this.displaced ? (this.width - displacementStemAdjustment) * this.stem_direction : 0);
    }

    // Get the `BoundingBox` for the `NoteHead`

  }, {
    key: 'getBoundingBox',
    value: function getBoundingBox() {
      if (!this.preFormatted) {
        throw new _vex.Vex.RERR('UnformattedNote', "Can't call getBoundingBox on an unformatted note.");
      }

      var spacing = this.stave.getSpacingBetweenLines();
      var half_spacing = spacing / 2;
      var min_y = this.y - half_spacing;

      return new _tables.Flow.BoundingBox(this.getAbsoluteX(), min_y, this.width, spacing);
    }

    // Set notehead to a provided `stave`

  }, {
    key: 'setStave',
    value: function setStave(stave) {
      var line = this.getLine();

      this.stave = stave;
      this.setY(stave.getYForNote(line));
      this.context = this.stave.context;
      return this;
    }

    // Pre-render formatting

  }, {
    key: 'preFormat',
    value: function preFormat() {
      if (this.preFormatted) return this;

      var width = this.getWidth() + this.extraLeftPx + this.extraRightPx;

      this.setWidth(width);
      this.setPreFormatted(true);
      return this;
    }

    // Draw the notehead

  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      this.setRendered();

      var ctx = this.context;
      var head_x = this.getAbsoluteX();
      var y = this.y;

      L("Drawing note head '", this.note_type, this.duration, "' at", head_x, y);

      // Begin and end positions for head.
      var stem_direction = this.stem_direction;
      var glyph_font_scale = this.render_options.glyph_font_scale;

      if (this.style) {
        this.applyStyle(ctx);
      }

      if (this.note_type === 's') {
        var staveSpace = this.stave.getSpacingBetweenLines();
        drawSlashNoteHead(ctx, this.duration, head_x, y, stem_direction, staveSpace);
      } else {
        _glyph.Glyph.renderGlyph(ctx, head_x, y, glyph_font_scale, this.glyph_code);
      }

      if (this.style) {
        this.restoreStyle(ctx);
      }
    }
  }]);

  return NoteHead;
}(_note.Note);