'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Note = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _tickable = require('./tickable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This file implements an abstract interface for notes and chords that
// are rendered on a stave. Notes have some common properties: All of them
// have a value (e.g., pitch, fret, etc.) and a duration (quarter, half, etc.)
//
// Some notes have stems, heads, dots, etc. Most notational elements that
// surround a note are called *modifiers*, and every note has an associated
// array of them. All notes also have a rendering context and belong to a stave.

var Note = exports.Note = function (_Tickable) {
  _inherits(Note, _Tickable);

  _createClass(Note, null, [{
    key: 'plotMetrics',


    // Debug helper. Displays various note metrics for the given
    // note.
    value: function plotMetrics(ctx, note, yPos) {
      var metrics = note.getMetrics();
      var xStart = note.getAbsoluteX() - metrics.modLeftPx - metrics.extraLeftPx;
      var xPre1 = note.getAbsoluteX() - metrics.extraLeftPx;
      var xAbs = note.getAbsoluteX();
      var xPost1 = note.getAbsoluteX() + metrics.noteWidth;
      var xPost2 = note.getAbsoluteX() + metrics.noteWidth + metrics.extraRightPx;
      var xEnd = note.getAbsoluteX() + metrics.noteWidth + metrics.extraRightPx + metrics.modRightPx;
      var xFreedomRight = xEnd + note.getFormatterMetrics().freedom.right;

      var xWidth = xEnd - xStart;
      ctx.save();
      ctx.setFont('Arial', 8, '');
      ctx.fillText(Math.round(xWidth) + 'px', xStart + note.getXShift(), yPos);

      var y = yPos + 7;
      function stroke(x1, x2, color) {
        var yy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : y;

        ctx.beginPath();
        ctx.setStrokeStyle(color);
        ctx.setFillStyle(color);
        ctx.setLineWidth(3);
        ctx.moveTo(x1 + note.getXShift(), yy);
        ctx.lineTo(x2 + note.getXShift(), yy);
        ctx.stroke();
      }

      stroke(xStart, xPre1, 'red');
      stroke(xPre1, xAbs, '#999');
      stroke(xAbs, xPost1, 'green');
      stroke(xPost1, xPost2, '#999');
      stroke(xPost2, xEnd, 'red');
      stroke(xEnd, xFreedomRight, '#DD0');
      stroke(xStart - note.getXShift(), xStart, '#BBB'); // Shift
      _vex.Vex.drawDot(ctx, xAbs + note.getXShift(), y, 'blue');

      var formatterMetrics = note.getFormatterMetrics();
      if (formatterMetrics.iterations > 0) {
        var spaceDeviation = formatterMetrics.space.deviation;
        var prefix = spaceDeviation >= 0 ? '+' : '';
        ctx.setFillStyle('red');
        ctx.fillText(prefix + Math.round(spaceDeviation), xAbs + note.getXShift(), yPos - 10);
      }
      ctx.restore();
    }

    // Every note is a tickable, i.e., it can be mutated by the `Formatter` class for
    // positioning and layout.
    // To create a new note you need to provide a `note_struct`, which consists
    // of the following fields:
    //
    // `type`: The note type (e.g., `r` for rest, `s` for slash notes, etc.)
    // `dots`: The number of dots, which affects the duration.
    // `duration`: The time length (e.g., `q` for quarter, `h` for half, `8` for eighth etc.)
    //
    // The range of values for these parameters are available in `src/tables.js`.

  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'note';
    }
  }, {
    key: 'STAVEPADDING',
    get: function get() {
      return 12;
    }
  }]);

  function Note(note_struct) {
    _classCallCheck(this, Note);

    var _this = _possibleConstructorReturn(this, (Note.__proto__ || Object.getPrototypeOf(Note)).call(this));

    _this.setAttribute('type', 'Note');

    if (!note_struct) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'Note must have valid initialization data to identify duration and type.');
    }

    // Parse `note_struct` and get note properties.
    var initData = _tables.Flow.parseNoteData(note_struct);
    if (!initData) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'Invalid note initialization object: ' + JSON.stringify(note_struct));
    }

    // Set note properties from parameters.
    _this.duration = initData.duration;
    _this.dots = initData.dots;
    _this.noteType = initData.type;

    if (note_struct.duration_override) {
      // Custom duration
      _this.setDuration(note_struct.duration_override);
    } else {
      // Default duration
      _this.setIntrinsicTicks(initData.ticks);
    }

    _this.modifiers = [];

    // Get the glyph code for this note from the font.
    _this.glyph = _tables.Flow.durationToGlyph(_this.duration, _this.noteType);

    if (_this.positions && (_typeof(_this.positions) !== 'object' || !_this.positions.length)) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'Note keys must be array type.');
    }

    // Note to play for audio players.
    _this.playNote = null;

    // Positioning contexts used by the Formatter.
    _this.tickContext = null; // The current tick context.
    _this.modifierContext = null;
    _this.ignore_ticks = false;

    // Positioning variables
    _this.width = 0; // Width in pixels calculated after preFormat
    _this.extraLeftPx = 0; // Extra room on left for offset note head
    _this.extraRightPx = 0; // Extra room on right for offset note head
    _this.x_shift = 0; // X shift from tick context X
    _this.left_modPx = 0; // Max width of left modifiers
    _this.right_modPx = 0; // Max width of right modifiers
    _this.voice = null; // The voice that this note is in
    _this.preFormatted = false; // Is this note preFormatted?
    _this.ys = []; // list of y coordinates for each note
    // we need to hold on to these for ties and beams.

    if (note_struct.align_center) {
      _this.setCenterAlignment(note_struct.align_center);
    }

    // The render surface.
    _this.stave = null;
    _this.render_options = {
      annotation_spacing: 5,
      stave_padding: Note.STAVEPADDING
    };
    return _this;
  }

  // Get and set the play note, which is arbitrary data that can be used by an
  // audio player.


  _createClass(Note, [{
    key: 'getPlayNote',
    value: function getPlayNote() {
      return this.playNote;
    }
  }, {
    key: 'setPlayNote',
    value: function setPlayNote(note) {
      this.playNote = note;return this;
    }

    // Don't play notes by default, call them rests. This is also used by things like
    // beams and dots for positioning.

  }, {
    key: 'isRest',
    value: function isRest() {
      return false;
    }

    // TODO(0xfe): Why is this method here?

  }, {
    key: 'addStroke',
    value: function addStroke(index, stroke) {
      stroke.setNote(this);
      stroke.setIndex(index);
      this.modifiers.push(stroke);
      this.setPreFormatted(false);
      return this;
    }

    // Get and set the target stave.

  }, {
    key: 'getStave',
    value: function getStave() {
      return this.stave;
    }
  }, {
    key: 'setStave',
    value: function setStave(stave) {
      this.stave = stave;
      this.setYs([stave.getYForLine(0)]); // Update Y values if the stave is changed.
      this.context = this.stave.context;
      return this;
    }

    // `Note` is not really a modifier, but is used in
    // a `ModifierContext`.

  }, {
    key: 'getCategory',
    value: function getCategory() {
      return Note.CATEGORY;
    }

    // Set the rendering context for the note.

  }, {
    key: 'setContext',
    value: function setContext(context) {
      this.context = context;return this;
    }

    // Get and set spacing to the left and right of the notes.

  }, {
    key: 'getExtraLeftPx',
    value: function getExtraLeftPx() {
      return this.extraLeftPx;
    }
  }, {
    key: 'getExtraRightPx',
    value: function getExtraRightPx() {
      return this.extraRightPx;
    }
  }, {
    key: 'setExtraLeftPx',
    value: function setExtraLeftPx(x) {
      this.extraLeftPx = x;return this;
    }
  }, {
    key: 'setExtraRightPx',
    value: function setExtraRightPx(x) {
      this.extraRightPx = x;return this;
    }

    // Returns true if this note has no duration (e.g., bar notes, spacers, etc.)

  }, {
    key: 'shouldIgnoreTicks',
    value: function shouldIgnoreTicks() {
      return this.ignore_ticks;
    }

    // Get the stave line number for the note.

  }, {
    key: 'getLineNumber',
    value: function getLineNumber() {
      return 0;
    }

    // Get the stave line number for rest.

  }, {
    key: 'getLineForRest',
    value: function getLineForRest() {
      return 0;
    }

    // Get the glyph associated with this note.

  }, {
    key: 'getGlyph',
    value: function getGlyph() {
      return this.glyph;
    }
  }, {
    key: 'getGlyphWidth',
    value: function getGlyphWidth() {
      return this.glyph.getWidth(this.render_options.glyph_font_scale);
    }

    // Set and get Y positions for this note. Each Y value is associated with
    // an individual pitch/key within the note/chord.

  }, {
    key: 'setYs',
    value: function setYs(ys) {
      this.ys = ys;return this;
    }
  }, {
    key: 'getYs',
    value: function getYs() {
      if (this.ys.length === 0) {
        throw new _vex.Vex.RERR('NoYValues', 'No Y-values calculated for this note.');
      }

      return this.ys;
    }

    // Get the Y position of the space above the stave onto which text can
    // be rendered.

  }, {
    key: 'getYForTopText',
    value: function getYForTopText(text_line) {
      if (!this.stave) {
        throw new _vex.Vex.RERR('NoStave', 'No stave attached to this note.');
      }

      return this.stave.getYForTopText(text_line);
    }

    // Get a `BoundingBox` for this note.

  }, {
    key: 'getBoundingBox',
    value: function getBoundingBox() {
      return null;
    }

    // Returns the voice that this note belongs in.

  }, {
    key: 'getVoice',
    value: function getVoice() {
      if (!this.voice) throw new _vex.Vex.RERR('NoVoice', 'Note has no voice.');
      return this.voice;
    }

    // Attach this note to `voice`.

  }, {
    key: 'setVoice',
    value: function setVoice(voice) {
      this.voice = voice;
      this.preFormatted = false;
      return this;
    }

    // Get and set the `TickContext` for this note.

  }, {
    key: 'getTickContext',
    value: function getTickContext() {
      return this.tickContext;
    }
  }, {
    key: 'setTickContext',
    value: function setTickContext(tc) {
      this.tickContext = tc;
      this.preFormatted = false;
      return this;
    }

    // Accessors for the note type.

  }, {
    key: 'getDuration',
    value: function getDuration() {
      return this.duration;
    }
  }, {
    key: 'isDotted',
    value: function isDotted() {
      return this.dots > 0;
    }
  }, {
    key: 'hasStem',
    value: function hasStem() {
      return false;
    }
  }, {
    key: 'getDots',
    value: function getDots() {
      return this.dots;
    }
  }, {
    key: 'getNoteType',
    value: function getNoteType() {
      return this.noteType;
    }
  }, {
    key: 'setBeam',
    value: function setBeam() {
      return this;
    } // ignore parameters

    // Attach this note to a modifier context.

  }, {
    key: 'setModifierContext',
    value: function setModifierContext(mc) {
      this.modifierContext = mc;return this;
    }

    // Attach a modifier to this note.

  }, {
    key: 'addModifier',
    value: function addModifier(modifier) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      modifier.setNote(this);
      modifier.setIndex(index);
      this.modifiers.push(modifier);
      this.setPreFormatted(false);
      return this;
    }

    // Get the coordinates for where modifiers begin.

  }, {
    key: 'getModifierStartXY',
    value: function getModifierStartXY() {
      if (!this.preFormatted) {
        throw new _vex.Vex.RERR('UnformattedNote', "Can't call GetModifierStartXY on an unformatted note");
      }

      return {
        x: this.getAbsoluteX(),
        y: this.ys[0]
      };
    }

    // Get bounds and metrics for this note.
    //
    // Returns a struct with fields:
    // `width`: The total width of the note (including modifiers.)
    // `noteWidth`: The width of the note head only.
    // `left_shift`: The horizontal displacement of the note.
    // `modLeftPx`: Start `X` for left modifiers.
    // `modRightPx`: Start `X` for right modifiers.
    // `extraLeftPx`: Extra space on left of note.
    // `extraRightPx`: Extra space on right of note.

  }, {
    key: 'getMetrics',
    value: function getMetrics() {
      if (!this.preFormatted) {
        throw new _vex.Vex.RERR('UnformattedNote', "Can't call getMetrics on an unformatted note.");
      }

      var modLeftPx = 0;
      var modRightPx = 0;
      if (this.modifierContext != null) {
        modLeftPx = this.modifierContext.state.left_shift;
        modRightPx = this.modifierContext.state.right_shift;
      }

      var width = this.getWidth();
      return {
        width: width,
        noteWidth: width - modLeftPx - modRightPx - this.extraLeftPx - this.extraRightPx,
        left_shift: this.x_shift, // TODO(0xfe): Make style consistent

        // Modifiers, accidentals etc.
        modLeftPx: modLeftPx,
        modRightPx: modRightPx,

        // Displaced note head on left or right.
        extraLeftPx: this.extraLeftPx,
        extraRightPx: this.extraRightPx
      };
    }

    // Get and set width of note. Used by the formatter for positioning.

  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      this.width = width;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      if (!this.preFormatted) {
        throw new _vex.Vex.RERR('UnformattedNote', "Can't call GetWidth on an unformatted note.");
      }

      return this.width + (this.modifierContext ? this.modifierContext.getWidth() : 0);
    }

    // Displace note by `x` pixels. Used by the formatter.

  }, {
    key: 'setXShift',
    value: function setXShift(x) {
      this.x_shift = x;return this;
    }
  }, {
    key: 'getXShift',
    value: function getXShift() {
      return this.x_shift;
    }

    // Get `X` position of this tick context.

  }, {
    key: 'getX',
    value: function getX() {
      if (!this.tickContext) {
        throw new _vex.Vex.RERR('NoTickContext', 'Note needs a TickContext assigned for an X-Value');
      }

      return this.tickContext.getX() + this.x_shift;
    }

    // Get the absolute `X` position of this note's tick context. This
    // excludes x_shift, so you'll need to factor it in if you're
    // looking for the post-formatted x-position.

  }, {
    key: 'getAbsoluteX',
    value: function getAbsoluteX() {
      if (!this.tickContext) {
        throw new _vex.Vex.RERR('NoTickContext', 'Note needs a TickContext assigned for an X-Value');
      }

      // Position note to left edge of tick context.
      var x = this.tickContext.getX();
      if (this.stave) {
        x += this.stave.getNoteStartX() + this.render_options.stave_padding;
      }

      if (this.isCenterAligned()) {
        x += this.getCenterXShift();
      }

      return x;
    }
  }, {
    key: 'setPreFormatted',
    value: function setPreFormatted(value) {
      this.preFormatted = value;

      // Maintain the width of left and right modifiers in pixels.
      if (this.preFormatted) {
        var extra = this.tickContext.getExtraPx();
        this.left_modPx = Math.max(this.left_modPx, extra.left);
        this.right_modPx = Math.max(this.right_modPx, extra.right);
      }
    }
  }]);

  return Note;
}(_tickable.Tickable);