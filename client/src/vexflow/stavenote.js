Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaveNote = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _boundingbox = require('./boundingbox');

var _stem = require('./stem');

var _notehead = require('./notehead');

var _stemmablenote = require('./stemmablenote');

var _modifier = require('./modifier');

var _dot = require('./dot');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
// This file implements notes for standard notation. This consists of one or
// more `NoteHeads`, an optional stem, and an optional flag.
//
// *Throughout these comments, a "note" refers to the entire `StaveNote`,
// and a "key" refers to a specific pitch/notehead within a note.*
//
// See `tests/stavenote_tests.js` for usage examples.

// To enable logging for this class. Set `Vex.Flow.StaveNote.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (StaveNote.DEBUG) _vex.Vex.L('Vex.Flow.StaveNote', args);
}

var getStemAdjustment = function getStemAdjustment(note) {
  return _stem.Stem.WIDTH / (2 * -note.getStemDirection());
};

var isInnerNoteIndex = function isInnerNoteIndex(note, index) {
  return index === (note.getStemDirection() === _stem.Stem.UP ? note.keyProps.length - 1 : 0);
};

// Helper methods for rest positioning in ModifierContext.
function shiftRestVertical(rest, note, dir) {
  var delta = (note.isrest ? 0.0 : 1.0) * dir;

  rest.line += delta;
  rest.maxLine += delta;
  rest.minLine += delta;
  rest.note.setKeyLine(0, rest.note.getKeyLine(0) + delta);
}

// Called from formatNotes :: center a rest between two notes
function centerRest(rest, noteU, noteL) {
  var delta = rest.line - _vex.Vex.MidLine(noteU.minLine, noteL.maxLine);
  rest.note.setKeyLine(0, rest.note.getKeyLine(0) - delta);
  rest.line -= delta;
  rest.maxLine -= delta;
  rest.minLine -= delta;
}

var StaveNote = exports.StaveNote = function (_StemmableNote) {
  _inherits(StaveNote, _StemmableNote);

  _createClass(StaveNote, null, [{
    key: 'format',


    // ## Static Methods
    //
    // Format notes inside a ModifierContext.
    value: function format(notes, state) {
      if (!notes || notes.length < 2) return false;

      // FIXME: VexFlow will soon require that a stave be set before formatting.
      // Which, according to the below condition, means that following branch will
      // always be taken and the rest of this function is dead code.
      //
      // Problematically, `Formatter#formatByY` was not designed to work for more
      // than 2 voices (although, doesn't throw on this condition, just tries
      // to power through).
      //
      // Based on the above:
      //   * 2 voices can be formatted *with or without* a stave being set but
      //     the output will be different
      //   * 3 voices can only be formatted *without* a stave
      if (notes[0].getStave()) {
        return StaveNote.formatByY(notes, state);
      }

      var notesList = [];

      for (var i = 0; i < notes.length; i++) {
        var props = notes[i].getKeyProps();
        var line = props[0].line;
        var minL = props[props.length - 1].line;
        var stemDirection = notes[i].getStemDirection();
        var stemMax = notes[i].getStemLength() / 10;
        var stemMin = notes[i].getStemMinumumLength() / 10;

        var maxL = void 0;
        if (notes[i].isRest()) {
          maxL = line + notes[i].glyph.line_above;
          minL = line - notes[i].glyph.line_below;
        } else {
          maxL = stemDirection === 1 ? props[props.length - 1].line + stemMax : props[props.length - 1].line;

          minL = stemDirection === 1 ? props[0].line : props[0].line - stemMax;
        }

        notesList.push({
          line: props[0].line, // note/rest base line
          maxLine: maxL, // note/rest upper bounds line
          minLine: minL, // note/rest lower bounds line
          isrest: notes[i].isRest(),
          stemDirection: stemDirection,
          stemMax: stemMax, // Maximum (default) note stem length;
          stemMin: stemMin, // minimum note stem length
          voice_shift: notes[i].getVoiceShiftWidth(),
          is_displaced: notes[i].isDisplaced(), // note manually displaced
          note: notes[i]
        });
      }

      var voices = notesList.length;

      var noteU = notesList[0];
      var noteM = voices > 2 ? notesList[1] : null;
      var noteL = voices > 2 ? notesList[2] : notesList[1];

      // for two voice backward compatibility, ensure upper voice is stems up
      // for three voices, the voices must be in order (upper, middle, lower)
      if (voices === 2 && noteU.stemDirection === -1 && noteL.stemDirection === 1) {
        noteU = notesList[1];
        noteL = notesList[0];
      }

      var voiceXShift = Math.max(noteU.voice_shift, noteL.voice_shift);
      var xShift = 0;
      var stemDelta = void 0;

      // Test for two voice note intersection
      if (voices === 2) {
        var lineSpacing = noteU.stemDirection === noteL.stemDirection ? 0.0 : 0.5;
        // if top voice is a middle voice, check stem intersection with lower voice
        if (noteU.stemDirection === noteL.stemDirection && noteU.minLine <= noteL.maxLine) {
          if (!noteU.isrest) {
            stemDelta = Math.abs(noteU.line - (noteL.maxLine + 0.5));
            stemDelta = Math.max(stemDelta, noteU.stemMin);
            noteU.minLine = noteU.line - stemDelta;
            noteU.note.setStemLength(stemDelta * 10);
          }
        }
        if (noteU.minLine <= noteL.maxLine + lineSpacing) {
          if (noteU.isrest) {
            // shift rest up
            shiftRestVertical(noteU, noteL, 1);
          } else if (noteL.isrest) {
            // shift rest down
            shiftRestVertical(noteL, noteU, -1);
          } else {
            xShift = voiceXShift;
            if (noteU.stemDirection === noteL.stemDirection) {
              // upper voice is middle voice, so shift it right
              noteU.note.setXShift(xShift + 3);
            } else {
              // shift lower voice right
              noteL.note.setXShift(xShift);
            }
          }
        }

        // format complete
        return true;
      }

      // Check middle voice stem intersection with lower voice
      if (noteM !== null && noteM.minLine < noteL.maxLine + 0.5) {
        if (!noteM.isrest) {
          stemDelta = Math.abs(noteM.line - (noteL.maxLine + 0.5));
          stemDelta = Math.max(stemDelta, noteM.stemMin);
          noteM.minLine = noteM.line - stemDelta;
          noteM.note.setStemLength(stemDelta * 10);
        }
      }

      // For three voices, test if rests can be repositioned
      //
      // Special case 1 :: middle voice rest between two notes
      //
      if (noteM.isrest && !noteU.isrest && !noteL.isrest) {
        if (noteU.minLine <= noteM.maxLine || noteM.minLine <= noteL.maxLine) {
          var restHeight = noteM.maxLine - noteM.minLine;
          var space = noteU.minLine - noteL.maxLine;
          if (restHeight < space) {
            // center middle voice rest between the upper and lower voices
            centerRest(noteM, noteU, noteL);
          } else {
            xShift = voiceXShift + 3; // shift middle rest right
            noteM.note.setXShift(xShift);
          }
          // format complete
          return true;
        }
      }

      // Special case 2 :: all voices are rests
      if (noteU.isrest && noteM.isrest && noteL.isrest) {
        // Shift upper voice rest up
        shiftRestVertical(noteU, noteM, 1);
        // Shift lower voice rest down
        shiftRestVertical(noteL, noteM, -1);
        // format complete
        return true;
      }

      // Test if any other rests can be repositioned
      if (noteM.isrest && noteU.isrest && noteM.minLine <= noteL.maxLine) {
        // Shift middle voice rest up
        shiftRestVertical(noteM, noteL, 1);
      }
      if (noteM.isrest && noteL.isrest && noteU.minLine <= noteM.maxLine) {
        // Shift middle voice rest down
        shiftRestVertical(noteM, noteU, -1);
      }
      if (noteU.isrest && noteU.minLine <= noteM.maxLine) {
        // shift upper voice rest up;
        shiftRestVertical(noteU, noteM, 1);
      }
      if (noteL.isrest && noteM.minLine <= noteL.maxLine) {
        // shift lower voice rest down
        shiftRestVertical(noteL, noteM, -1);
      }

      // If middle voice intersects upper or lower voice
      if (!noteU.isrest && !noteM.isrest && noteU.minLine <= noteM.maxLine + 0.5 || !noteM.isrest && !noteL.isrest && noteM.minLine <= noteL.maxLine) {
        xShift = voiceXShift + 3; // shift middle note right
        noteM.note.setXShift(xShift);
      }

      return true;
    }
  }, {
    key: 'formatByY',
    value: function formatByY(notes, state) {
      // NOTE: this function does not support more than two voices per stave
      // use with care.
      var hasStave = true;

      for (var i = 0; i < notes.length; i++) {
        hasStave = hasStave && notes[i].getStave() != null;
      }

      if (!hasStave) {
        throw new _vex.Vex.RERR('Stave Missing', 'All notes must have a stave - Vex.Flow.ModifierContext.formatMultiVoice!');
      }

      var xShift = 0;

      for (var _i = 0; _i < notes.length - 1; _i++) {
        var topNote = notes[_i];
        var bottomNote = notes[_i + 1];

        if (topNote.getStemDirection() === _stem.Stem.DOWN) {
          topNote = notes[_i + 1];
          bottomNote = notes[_i];
        }

        var topKeys = topNote.getKeyProps();
        var bottomKeys = bottomNote.getKeyProps();

        var HALF_NOTEHEAD_HEIGHT = 0.5;

        // `keyProps` and `stave.getYForLine` have different notions of a `line`
        // so we have to convert the keyProps value by subtracting 5.
        // See https://github.com/0xfe/vexflow/wiki/Development-Gotchas
        //
        // We also extend the y for each note by a half notehead because the
        // notehead's origin is centered
        var topNotBottomY = topNote.getStave().getYForLine(5 - topKeys[0].line + HALF_NOTEHEAD_HEIGHT);

        var bottomNoteTopY = bottomNote.getStave().getYForLine(5 - bottomKeys[bottomKeys.length - 1].line - HALF_NOTEHEAD_HEIGHT);

        var areNotesColliding = bottomNoteTopY - topNotBottomY < 0;

        if (areNotesColliding) {
          xShift = topNote.getVoiceShiftWidth() + 2;
          bottomNote.setXShift(xShift);
        }
      }

      state.right_shift += xShift;
    }
  }, {
    key: 'postFormat',
    value: function postFormat(notes) {
      if (!notes) return false;

      notes.forEach(function (note) {
        return note.postFormat();
      });

      return true;
    }
  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'stavenotes';
    }
  }, {
    key: 'STEM_UP',
    get: function get() {
      return _stem.Stem.UP;
    }
  }, {
    key: 'STEM_DOWN',
    get: function get() {
      return _stem.Stem.DOWN;
    }
  }, {
    key: 'DEFAULT_LEDGER_LINE_OFFSET',
    get: function get() {
      return 3;
    }
  }]);

  function StaveNote(noteStruct) {
    _classCallCheck(this, StaveNote);

    var _this = _possibleConstructorReturn(this, (StaveNote.__proto__ || Object.getPrototypeOf(StaveNote)).call(this, noteStruct));

    _this.setAttribute('type', 'StaveNote');

    _this.keys = noteStruct.keys;
    _this.clef = noteStruct.clef;
    _this.octave_shift = noteStruct.octave_shift;
    _this.beam = null;

    // Pull note rendering properties
    _this.glyph = _tables.Flow.durationToGlyph(_this.duration, _this.noteType);

    if (!_this.glyph) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'Invalid note initialization data (No glyph found): ' + JSON.stringify(noteStruct));
    }

    // if true, displace note to right
    _this.displaced = false;
    _this.dot_shiftY = 0;
    // per-pitch properties
    _this.keyProps = [];
    // for displaced ledger lines
    _this.use_default_head_x = false;

    // Drawing
    _this.note_heads = [];
    _this.modifiers = [];

    _vex.Vex.Merge(_this.render_options, {
      // font size for note heads and rests
      glyph_font_scale: noteStruct.glyph_font_scale || _tables.Flow.DEFAULT_NOTATION_FONT_SCALE,
      // number of stroke px to the left and right of head
      stroke_px: noteStruct.stroke_px || StaveNote.DEFAULT_LEDGER_LINE_OFFSET
    });

    _this.calculateKeyProps();
    _this.buildStem();

    // Set the stem direction
    if (noteStruct.auto_stem) {
      _this.autoStem();
    } else {
      _this.setStemDirection(noteStruct.stem_direction);
    }
    _this.reset();
    _this.buildFlag();
    return _this;
  }

  _createClass(StaveNote, [{
    key: 'reset',
    value: function reset() {
      var _this2 = this;

      _get(StaveNote.prototype.__proto__ || Object.getPrototypeOf(StaveNote.prototype), 'reset', this).call(this);

      // Save prior noteHead styles & reapply them after making new noteheads.
      var noteHeadStyles = this.note_heads.map(function (noteHead) {
        return noteHead.getStyle();
      });
      this.buildNoteHeads();
      this.note_heads.forEach(function (noteHead, index) {
        return noteHead.setStyle(noteHeadStyles[index]);
      });

      if (this.stave) {
        this.note_heads.forEach(function (head) {
          return head.setStave(_this2.stave);
        });
      }
      this.calcExtraPx();
    }
  }, {
    key: 'getCategory',
    value: function getCategory() {
      return StaveNote.CATEGORY;
    }

    // Builds a `Stem` for the note

  }, {
    key: 'buildStem',
    value: function buildStem() {
      var glyph = this.getGlyph();
      var yExtend = glyph.code_head === 'v95' || glyph.code_head === 'v3e' ? -4 : 0;

      this.setStem(new _stem.Stem({
        yExtend: yExtend,
        hide: !!this.isRest()
      }));
    }

    // Builds a `NoteHead` for each key in the note

  }, {
    key: 'buildNoteHeads',
    value: function buildNoteHeads() {
      this.note_heads = [];
      var stemDirection = this.getStemDirection();
      var keys = this.getKeys();

      var lastLine = null;
      var lineDiff = null;
      var displaced = false;

      // Draw notes from bottom to top.

      // For down-stem notes, we draw from top to bottom.
      var start = void 0;
      var end = void 0;
      var step = void 0;
      if (stemDirection === _stem.Stem.UP) {
        start = 0;
        end = keys.length;
        step = 1;
      } else if (stemDirection === _stem.Stem.DOWN) {
        start = keys.length - 1;
        end = -1;
        step = -1;
      }

      for (var i = start; i !== end; i += step) {
        var noteProps = this.keyProps[i];
        var line = noteProps.line;

        // Keep track of last line with a note head, so that consecutive heads
        // are correctly displaced.
        if (lastLine === null) {
          lastLine = line;
        } else {
          lineDiff = Math.abs(lastLine - line);
          if (lineDiff === 0 || lineDiff === 0.5) {
            displaced = !displaced;
          } else {
            displaced = false;
            this.use_default_head_x = true;
          }
        }
        lastLine = line;

        var notehead = new _notehead.NoteHead({
          duration: this.duration,
          note_type: this.noteType,
          displaced: displaced,
          stem_direction: stemDirection,
          custom_glyph_code: noteProps.code,
          glyph_font_scale: this.render_options.glyph_font_scale,
          x_shift: noteProps.shift_right,
          line: noteProps.line
        });

        this.note_heads[i] = notehead;
      }
    }

    // Automatically sets the stem direction based on the keys in the note

  }, {
    key: 'autoStem',
    value: function autoStem() {
      // Figure out optimal stem direction based on given notes
      this.minLine = this.keyProps[0].line;
      this.maxLine = this.keyProps[this.keyProps.length - 1].line;

      var MIDDLE_LINE = 3;
      var decider = (this.minLine + this.maxLine) / 2;
      var stemDirection = decider < MIDDLE_LINE ? _stem.Stem.UP : _stem.Stem.DOWN;

      this.setStemDirection(stemDirection);
    }

    // Calculates and stores the properties for each key in the note

  }, {
    key: 'calculateKeyProps',
    value: function calculateKeyProps() {
      var lastLine = null;
      for (var i = 0; i < this.keys.length; ++i) {
        var key = this.keys[i];

        // All rests use the same position on the line.
        // if (this.glyph.rest) key = this.glyph.position;
        if (this.glyph.rest) this.glyph.position = key;

        var options = { octave_shift: this.octave_shift || 0 };
        var props = _tables.Flow.keyProperties(key, this.clef, options);

        if (!props) {
          throw new _vex.Vex.RuntimeError('BadArguments', 'Invalid key for note properties: ' + key);
        }

        // Override line placement for default rests
        if (props.key === 'R') {
          if (this.duration === '1' || this.duration === 'w') {
            props.line = 4;
          } else {
            props.line = 3;
          }
        }

        // Calculate displacement of this note
        var line = props.line;
        if (lastLine === null) {
          lastLine = line;
        } else {
          if (Math.abs(lastLine - line) === 0.5) {
            this.displaced = true;
            props.displaced = true;

            // Have to mark the previous note as
            // displaced as well, for modifier placement
            if (this.keyProps.length > 0) {
              this.keyProps[i - 1].displaced = true;
            }
          }
        }

        lastLine = line;
        this.keyProps.push(props);
      }

      // Sort the notes from lowest line to highest line
      lastLine = -Infinity;
      this.keyProps.forEach(function (key) {
        if (key.line < lastLine) {
          _vex.Vex.W('Unsorted keys in note will be sorted. ' + 'See https://github.com/0xfe/vexflow/issues/104 for details.');
        }
        lastLine = key.line;
      });
      this.keyProps.sort(function (a, b) {
        return a.line - b.line;
      });
    }

    // Get the `BoundingBox` for the entire note

  }, {
    key: 'getBoundingBox',
    value: function getBoundingBox() {
      if (!this.preFormatted) {
        throw new _vex.Vex.RERR('UnformattedNote', "Can't call getBoundingBox on an unformatted note.");
      }

      var _getMetrics = this.getMetrics(),
          w = _getMetrics.width,
          modLeftPx = _getMetrics.modLeftPx,
          extraLeftPx = _getMetrics.extraLeftPx;

      var x = this.getAbsoluteX() - modLeftPx - extraLeftPx;

      var minY = 0;
      var maxY = 0;
      var halfLineSpacing = this.getStave().getSpacingBetweenLines() / 2;
      var lineSpacing = halfLineSpacing * 2;

      if (this.isRest()) {
        var y = this.ys[0];
        var frac = _tables.Flow.durationToFraction(this.duration);
        if (frac.equals(1) || frac.equals(2)) {
          minY = y - halfLineSpacing;
          maxY = y + halfLineSpacing;
        } else {
          minY = y - this.glyph.line_above * lineSpacing;
          maxY = y + this.glyph.line_below * lineSpacing;
        }
      } else if (this.glyph.stem) {
        var ys = this.getStemExtents();
        ys.baseY += halfLineSpacing * this.stem_direction;
        minY = Math.min(ys.topY, ys.baseY);
        maxY = Math.max(ys.topY, ys.baseY);
      } else {
        minY = null;
        maxY = null;

        for (var i = 0; i < this.ys.length; ++i) {
          var yy = this.ys[i];
          if (i === 0) {
            minY = yy;
            maxY = yy;
          } else {
            minY = Math.min(yy, minY);
            maxY = Math.max(yy, maxY);
          }
        }
        minY -= halfLineSpacing;
        maxY += halfLineSpacing;
      }

      return new _boundingbox.BoundingBox(x, minY, w, maxY - minY);
    }

    // Gets the line number of the top or bottom note in the chord.
    // If `isTopNote` is `true` then get the top note

  }, {
    key: 'getLineNumber',
    value: function getLineNumber(isTopNote) {
      if (!this.keyProps.length) {
        throw new _vex.Vex.RERR('NoKeyProps', "Can't get bottom note line, because note is not initialized properly.");
      }

      var resultLine = this.keyProps[0].line;

      // No precondition assumed for sortedness of keyProps array
      for (var i = 0; i < this.keyProps.length; i++) {
        var thisLine = this.keyProps[i].line;
        if (isTopNote) {
          if (thisLine > resultLine) resultLine = thisLine;
        } else {
          if (thisLine < resultLine) resultLine = thisLine;
        }
      }

      return resultLine;
    }

    // Determine if current note is a rest

  }, {
    key: 'isRest',
    value: function isRest() {
      return this.glyph.rest;
    }

    // Determine if the current note is a chord

  }, {
    key: 'isChord',
    value: function isChord() {
      return !this.isRest() && this.keys.length > 1;
    }

    // Determine if the `StaveNote` has a stem

  }, {
    key: 'hasStem',
    value: function hasStem() {
      return this.glyph.stem;
    }
  }, {
    key: 'hasFlag',
    value: function hasFlag() {
      return _get(StaveNote.prototype.__proto__ || Object.getPrototypeOf(StaveNote.prototype), 'hasFlag', this).call(this) && !this.isRest();
    }
  }, {
    key: 'getStemX',
    value: function getStemX() {
      if (this.noteType === 'r') {
        return this.getCenterGlyphX();
      } else {
        // We adjust the origin of the stem because we want the stem left-aligned
        // with the notehead if stemmed-down, and right-aligned if stemmed-up
        return _get(StaveNote.prototype.__proto__ || Object.getPrototypeOf(StaveNote.prototype), 'getStemX', this).call(this) + getStemAdjustment(this);
      }
    }

    // Get the `y` coordinate for text placed on the top/bottom of a
    // note at a desired `text_line`

  }, {
    key: 'getYForTopText',
    value: function getYForTopText(textLine) {
      var extents = this.getStemExtents();
      return Math.min(this.stave.getYForTopText(textLine), extents.topY - this.render_options.annotation_spacing * (textLine + 1));
    }
  }, {
    key: 'getYForBottomText',
    value: function getYForBottomText(textLine) {
      var extents = this.getStemExtents();
      return Math.max(this.stave.getYForTopText(textLine), extents.baseY + this.render_options.annotation_spacing * textLine);
    }

    // Sets the current note to the provided `stave`. This applies
    // `y` values to the `NoteHeads`.

  }, {
    key: 'setStave',
    value: function setStave(stave) {
      _get(StaveNote.prototype.__proto__ || Object.getPrototypeOf(StaveNote.prototype), 'setStave', this).call(this, stave);

      var ys = this.note_heads.map(function (notehead) {
        notehead.setStave(stave);
        return notehead.getY();
      });

      this.setYs(ys);

      if (this.stem) {
        var _getNoteHeadBounds = this.getNoteHeadBounds(),
            y_top = _getNoteHeadBounds.y_top,
            y_bottom = _getNoteHeadBounds.y_bottom;

        this.stem.setYBounds(y_top, y_bottom);
      }

      return this;
    }

    // Get the pitches in the note

  }, {
    key: 'getKeys',
    value: function getKeys() {
      return this.keys;
    }

    // Get the properties for all the keys in the note

  }, {
    key: 'getKeyProps',
    value: function getKeyProps() {
      return this.keyProps;
    }

    // Check if note is shifted to the right

  }, {
    key: 'isDisplaced',
    value: function isDisplaced() {
      return this.displaced;
    }

    // Sets whether shift note to the right. `displaced` is a `boolean`

  }, {
    key: 'setNoteDisplaced',
    value: function setNoteDisplaced(displaced) {
      this.displaced = displaced;
      return this;
    }

    // Get the starting `x` coordinate for a `StaveTie`

  }, {
    key: 'getTieRightX',
    value: function getTieRightX() {
      var tieStartX = this.getAbsoluteX();
      tieStartX += this.getGlyphWidth() + this.x_shift + this.extraRightPx;
      if (this.modifierContext) tieStartX += this.modifierContext.getExtraRightPx();
      return tieStartX;
    }

    // Get the ending `x` coordinate for a `StaveTie`

  }, {
    key: 'getTieLeftX',
    value: function getTieLeftX() {
      var tieEndX = this.getAbsoluteX();
      tieEndX += this.x_shift - this.extraLeftPx;
      return tieEndX;
    }

    // Get the stave line on which to place a rest

  }, {
    key: 'getLineForRest',
    value: function getLineForRest() {
      var restLine = this.keyProps[0].line;
      if (this.keyProps.length > 1) {
        var lastLine = this.keyProps[this.keyProps.length - 1].line;
        var top = Math.max(restLine, lastLine);
        var bot = Math.min(restLine, lastLine);
        restLine = _vex.Vex.MidLine(top, bot);
      }

      return restLine;
    }

    // Get the default `x` and `y` coordinates for the provided `position`
    // and key `index`

  }, {
    key: 'getModifierStartXY',
    value: function getModifierStartXY(position, index) {
      if (!this.preFormatted) {
        throw new _vex.Vex.RERR('UnformattedNote', "Can't call GetModifierStartXY on an unformatted note");
      }

      if (this.ys.length === 0) {
        throw new _vex.Vex.RERR('NoYValues', 'No Y-Values calculated for this note.');
      }

      var _Modifier$Position = _modifier.Modifier.Position,
          ABOVE = _Modifier$Position.ABOVE,
          BELOW = _Modifier$Position.BELOW,
          LEFT = _Modifier$Position.LEFT,
          RIGHT = _Modifier$Position.RIGHT;

      var x = 0;
      if (position === LEFT) {
        // extra_left_px
        // FIXME: What are these magic numbers?
        x = -1 * 2;
      } else if (position === RIGHT) {
        // extra_right_px
        // FIXME: What is this magical +2?
        x = this.getGlyphWidth() + this.x_shift + 2;

        if (this.stem_direction === _stem.Stem.UP && this.hasFlag() && isInnerNoteIndex(this, index)) {
          x += this.flag.getMetrics().width;
        }
      } else if (position === BELOW || position === ABOVE) {
        x = this.getGlyphWidth() / 2;
      }

      return {
        x: this.getAbsoluteX() + x,
        y: this.ys[index]
      };
    }

    // Sets the style of the complete StaveNote, including all keys
    // and the stem.

  }, {
    key: 'setStyle',
    value: function setStyle(style) {
      _get(StaveNote.prototype.__proto__ || Object.getPrototypeOf(StaveNote.prototype), 'setStyle', this).call(this, style);
      this.note_heads.forEach(function (notehead) {
        return notehead.setStyle(style);
      });
      this.stem.setStyle(style);
    }
  }, {
    key: 'setStemStyle',
    value: function setStemStyle(style) {
      var stem = this.getStem();
      stem.setStyle(style);
    }
  }, {
    key: 'getStemStyle',
    value: function getStemStyle() {
      return this.stem.getStyle();
    }
  }, {
    key: 'setLedgerLineStyle',
    value: function setLedgerLineStyle(style) {
      this.ledgerLineStyle = style;
    }
  }, {
    key: 'getLedgerLineStyle',
    value: function getLedgerLineStyle() {
      return this.ledgerLineStyle;
    }
  }, {
    key: 'setFlagStyle',
    value: function setFlagStyle(style) {
      this.flagStyle = style;
    }
  }, {
    key: 'getFlagStyle',
    value: function getFlagStyle() {
      return this.flagStyle;
    }

    // Sets the notehead at `index` to the provided coloring `style`.
    //
    // `style` is an `object` with the following properties: `shadowColor`,
    // `shadowBlur`, `fillStyle`, `strokeStyle`

  }, {
    key: 'setKeyStyle',
    value: function setKeyStyle(index, style) {
      this.note_heads[index].setStyle(style);
      return this;
    }
  }, {
    key: 'setKeyLine',
    value: function setKeyLine(index, line) {
      this.keyProps[index].line = line;
      this.reset();
      return this;
    }
  }, {
    key: 'getKeyLine',
    value: function getKeyLine(index) {
      return this.keyProps[index].line;
    }

    // Add self to modifier context. `mContext` is the `ModifierContext`
    // to be added to.

  }, {
    key: 'addToModifierContext',
    value: function addToModifierContext(mContext) {
      this.setModifierContext(mContext);
      for (var i = 0; i < this.modifiers.length; ++i) {
        this.modifierContext.addModifier(this.modifiers[i]);
      }
      this.modifierContext.addModifier(this);
      this.setPreFormatted(false);
      return this;
    }

    // Generic function to add modifiers to a note
    //
    // Parameters:
    // * `index`: The index of the key that we're modifying
    // * `modifier`: The modifier to add

  }, {
    key: 'addModifier',
    value: function addModifier(index, modifier) {
      modifier.setNote(this);
      modifier.setIndex(index);
      this.modifiers.push(modifier);
      this.setPreFormatted(false);
      return this;
    }

    // Helper function to add an accidental to a key

  }, {
    key: 'addAccidental',
    value: function addAccidental(index, accidental) {
      return this.addModifier(index, accidental);
    }

    // Helper function to add an articulation to a key

  }, {
    key: 'addArticulation',
    value: function addArticulation(index, articulation) {
      return this.addModifier(index, articulation);
    }

    // Helper function to add an annotation to a key

  }, {
    key: 'addAnnotation',
    value: function addAnnotation(index, annotation) {
      return this.addModifier(index, annotation);
    }

    // Helper function to add a dot on a specific key

  }, {
    key: 'addDot',
    value: function addDot(index) {
      var dot = new _dot.Dot();
      dot.setDotShiftY(this.glyph.dot_shiftY);
      this.dots++;
      return this.addModifier(index, dot);
    }

    // Convenience method to add dot to all keys in note

  }, {
    key: 'addDotToAll',
    value: function addDotToAll() {
      for (var i = 0; i < this.keys.length; ++i) {
        this.addDot(i);
      }
      return this;
    }

    // Get all accidentals in the `ModifierContext`

  }, {
    key: 'getAccidentals',
    value: function getAccidentals() {
      return this.modifierContext.getModifiers('accidentals');
    }

    // Get all dots in the `ModifierContext`

  }, {
    key: 'getDots',
    value: function getDots() {
      return this.modifierContext.getModifiers('dots');
    }

    // Get the width of the note if it is displaced. Used for `Voice`
    // formatting

  }, {
    key: 'getVoiceShiftWidth',
    value: function getVoiceShiftWidth() {
      // TODO: may need to accomodate for dot here.
      return this.getGlyphWidth() * (this.displaced ? 2 : 1);
    }

    // Calculates and sets the extra pixels to the left or right
    // if the note is displaced.

  }, {
    key: 'calcExtraPx',
    value: function calcExtraPx() {
      this.setExtraLeftPx(this.displaced && this.stem_direction === _stem.Stem.DOWN ? this.getGlyphWidth() : 0);

      // For upstems with flags, the extra space is unnecessary, since it's taken
      // up by the flag.
      this.setExtraRightPx(!this.hasFlag() && this.displaced && this.stem_direction === _stem.Stem.UP ? this.getGlyphWidth() : 0);
    }

    // Pre-render formatting

  }, {
    key: 'preFormat',
    value: function preFormat() {
      if (this.preFormatted) return;
      if (this.modifierContext) this.modifierContext.preFormat();

      var width = this.getGlyphWidth() + this.extraLeftPx + this.extraRightPx;

      // For upward flagged notes, the width of the flag needs to be added
      if (this.glyph.flag && this.beam === null && this.stem_direction === _stem.Stem.UP) {
        width += this.getGlyphWidth();
      }

      this.setWidth(width);
      this.setPreFormatted(true);
    }

    /**
     * @typedef {Object} noteHeadBounds
     * @property {number} y_top the highest notehead bound
     * @property {number} y_bottom the lowest notehead bound
     * @property {number|Null} displaced_x the starting x for displaced noteheads
     * @property {number|Null} non_displaced_x the starting x for non-displaced noteheads
     * @property {number} highest_line the highest notehead line in traditional music line
     *  numbering (bottom line = 1, top line = 5)
     * @property {number} lowest_line the lowest notehead line
     * @property {number|false} highest_displaced_line the highest staff line number
     *   for a displaced notehead
     * @property {number|false} lowest_displaced_line
     * @property {number} highest_non_displaced_line
     * @property {number} lowest_non_displaced_line
     */

    /**
     * Get the staff line and y value for the highest & lowest noteheads
     * @returns {noteHeadBounds}
     */

  }, {
    key: 'getNoteHeadBounds',
    value: function getNoteHeadBounds() {
      // Top and bottom Y values for stem.
      var yTop = null;
      var yBottom = null;
      var nonDisplacedX = null;
      var displacedX = null;

      var highestLine = this.stave.getNumLines();
      var lowestLine = 1;
      var highestDisplacedLine = false;
      var lowestDisplacedLine = false;
      var highestNonDisplacedLine = highestLine;
      var lowestNonDisplacedLine = lowestLine;

      this.note_heads.forEach(function (notehead) {
        var line = notehead.getLine();
        var y = notehead.getY();

        if (yTop === null || y < yTop) {
          yTop = y;
        }

        if (yBottom === null || y > yBottom) {
          yBottom = y;
        }

        if (displacedX === null && notehead.isDisplaced()) {
          displacedX = notehead.getAbsoluteX();
        }

        if (nonDisplacedX === null && !notehead.isDisplaced()) {
          nonDisplacedX = notehead.getAbsoluteX();
        }

        highestLine = line > highestLine ? line : highestLine;
        lowestLine = line < lowestLine ? line : lowestLine;

        if (notehead.isDisplaced()) {
          highestDisplacedLine = highestDisplacedLine === false ? line : Math.max(line, highestDisplacedLine);
          lowestDisplacedLine = lowestDisplacedLine === false ? line : Math.min(line, lowestDisplacedLine);
        } else {
          highestNonDisplacedLine = Math.max(line, highestNonDisplacedLine);
          lowestNonDisplacedLine = Math.min(line, lowestNonDisplacedLine);
        }
      }, this);

      return {
        y_top: yTop,
        y_bottom: yBottom,
        displaced_x: displacedX,
        non_displaced_x: nonDisplacedX,
        highest_line: highestLine,
        lowest_line: lowestLine,
        highest_displaced_line: highestDisplacedLine,
        lowest_displaced_line: lowestDisplacedLine,
        highest_non_displaced_line: highestNonDisplacedLine,
        lowest_non_displaced_line: lowestNonDisplacedLine
      };
    }

    // Get the starting `x` coordinate for the noteheads

  }, {
    key: 'getNoteHeadBeginX',
    value: function getNoteHeadBeginX() {
      return this.getAbsoluteX() + this.x_shift;
    }

    // Get the ending `x` coordinate for the noteheads

  }, {
    key: 'getNoteHeadEndX',
    value: function getNoteHeadEndX() {
      var xBegin = this.getNoteHeadBeginX();
      return xBegin + this.getGlyphWidth();
    }

    // Draw the ledger lines between the stave and the highest/lowest keys

  }, {
    key: 'drawLedgerLines',
    value: function drawLedgerLines() {
      var stave = this.stave,
          glyph = this.glyph,
          stroke_px = this.render_options.stroke_px,
          ctx = this.context;


      var width = glyph.getWidth() + stroke_px * 2;
      var doubleWidth = 2 * (glyph.getWidth() + stroke_px) - _stem.Stem.WIDTH / 2;

      if (this.isRest()) return;
      if (!ctx) {
        throw new _vex.Vex.RERR('NoCanvasContext', "Can't draw without a canvas context.");
      }

      var _getNoteHeadBounds2 = this.getNoteHeadBounds(),
          highest_line = _getNoteHeadBounds2.highest_line,
          lowest_line = _getNoteHeadBounds2.lowest_line,
          highest_displaced_line = _getNoteHeadBounds2.highest_displaced_line,
          highest_non_displaced_line = _getNoteHeadBounds2.highest_non_displaced_line,
          lowest_displaced_line = _getNoteHeadBounds2.lowest_displaced_line,
          lowest_non_displaced_line = _getNoteHeadBounds2.lowest_non_displaced_line,
          displaced_x = _getNoteHeadBounds2.displaced_x,
          non_displaced_x = _getNoteHeadBounds2.non_displaced_x;

      var min_x = Math.min(displaced_x, non_displaced_x);

      var drawLedgerLine = function drawLedgerLine(y, normal, displaced) {
        var x = void 0;
        if (displaced && normal) x = min_x - stroke_px;else if (normal) x = non_displaced_x - stroke_px;else x = displaced_x - stroke_px;
        var ledgerWidth = normal && displaced ? doubleWidth : width;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + ledgerWidth, y);
        ctx.stroke();
      };

      var style = Object.assign({}, stave.getStyle() || {}, this.getLedgerLineStyle() || {});
      this.applyStyle(ctx, style);

      // Draw ledger lines below the staff:
      for (var line = 6; line <= highest_line; ++line) {
        var normal = non_displaced_x !== null && line <= highest_non_displaced_line;
        var displaced = displaced_x !== null && line <= highest_displaced_line;
        drawLedgerLine(stave.getYForNote(line), normal, displaced);
      }

      // Draw ledger lines above the staff:
      for (var _line = 0; _line >= lowest_line; --_line) {
        var _normal = non_displaced_x !== null && _line >= lowest_non_displaced_line;
        var _displaced = displaced_x !== null && _line >= lowest_displaced_line;
        drawLedgerLine(stave.getYForNote(_line), _normal, _displaced);
      }

      this.restoreStyle(ctx, style);
    }

    // Draw all key modifiers

  }, {
    key: 'drawModifiers',
    value: function drawModifiers() {
      if (!this.context) {
        throw new _vex.Vex.RERR('NoCanvasContext', "Can't draw without a canvas context.");
      }

      var ctx = this.context;
      ctx.openGroup('modifiers');
      for (var i = 0; i < this.modifiers.length; i++) {
        var modifier = this.modifiers[i];
        var notehead = this.note_heads[modifier.getIndex()];
        var noteheadStyle = notehead.getStyle();
        if (noteheadStyle) {
          ctx.save();
          notehead.applyStyle(ctx);
        }
        modifier.setContext(ctx);
        modifier.draw();
        if (noteheadStyle) {
          ctx.restore();
        }
      }
      ctx.closeGroup();
    }

    // Draw the flag for the note

  }, {
    key: 'drawFlag',
    value: function drawFlag() {
      var stem = this.stem,
          beam = this.beam,
          ctx = this.context;


      if (!ctx) {
        throw new _vex.Vex.RERR('NoCanvasContext', "Can't draw without a canvas context.");
      }

      var shouldRenderFlag = beam === null;
      var glyph = this.getGlyph();

      if (glyph.flag && shouldRenderFlag) {
        var _getNoteHeadBounds3 = this.getNoteHeadBounds(),
            y_top = _getNoteHeadBounds3.y_top,
            y_bottom = _getNoteHeadBounds3.y_bottom;

        var noteStemHeight = stem.getHeight();
        var flagX = this.getStemX();
        // FIXME: What's with the magic +/- 2
        var flagY = this.getStemDirection() === _stem.Stem.DOWN
        // Down stems have flags on the left
        ? y_top - noteStemHeight + 2
        // Up stems have flags on the eft.
        : y_bottom - noteStemHeight - 2;

        // Draw the Flag
        ctx.openGroup('flag', null, { pointerBBox: true });
        this.applyStyle(ctx, this.getFlagStyle() || false);
        this.flag.render(ctx, flagX, flagY);
        this.restoreStyle(ctx, this.getFlagStyle() || false);
        ctx.closeGroup();
      }
    }

    // Draw the NoteHeads

  }, {
    key: 'drawNoteHeads',
    value: function drawNoteHeads() {
      var _this3 = this;

      this.note_heads.forEach(function (notehead) {
        _this3.context.openGroup('notehead', null, { pointerBBox: true });
        notehead.setContext(_this3.context).draw();
        _this3.context.closeGroup();
      });
    }

    // Render the stem onto the canvas

  }, {
    key: 'drawStem',
    value: function drawStem(stemStruct) {
      // GCR TODO: I can't find any context in which this is called with the stemStruct
      // argument in the codebase or tests. Nor can I find a case where super.drawStem
      // is called at all. Perhaps these should be removed?
      if (!this.context) {
        throw new _vex.Vex.RERR('NoCanvasContext', "Can't draw without a canvas context.");
      }

      if (stemStruct) {
        this.setStem(new _stem.Stem(stemStruct));
      }

      this.context.openGroup('stem', null, { pointerBBox: true });
      this.stem.setContext(this.context).draw();
      this.context.closeGroup();
    }

    // Draws all the `StaveNote` parts. This is the main drawing method.

  }, {
    key: 'draw',
    value: function draw() {
      if (!this.context) {
        throw new _vex.Vex.RERR('NoCanvasContext', "Can't draw without a canvas context.");
      }
      if (!this.stave) {
        throw new _vex.Vex.RERR('NoStave', "Can't draw without a stave.");
      }
      if (this.ys.length === 0) {
        throw new _vex.Vex.RERR('NoYValues', "Can't draw note without Y values.");
      }

      var xBegin = this.getNoteHeadBeginX();
      var shouldRenderStem = this.hasStem() && !this.beam;

      // Format note head x positions
      this.note_heads.forEach(function (notehead) {
        return notehead.setX(xBegin);
      });

      // Format stem x positions
      var stemX = this.getStemX();
      this.stem.setNoteHeadXBounds(stemX, stemX);

      L('Rendering ', this.isChord() ? 'chord :' : 'note :', this.keys);

      // Draw each part of the note
      this.drawLedgerLines();

      // Apply the overall style -- may be contradicted by local settings:
      this.applyStyle();
      this.setAttribute('el', this.context.openGroup('stavenote', this.getAttribute('id')));
      this.context.openGroup('note', null, { pointerBBox: true });
      if (shouldRenderStem) this.drawStem();
      this.drawNoteHeads();
      this.drawFlag();
      this.context.closeGroup();
      this.drawModifiers();
      this.context.closeGroup();
      this.restoreStyle();
      this.setRendered();
    }
  }]);

  return StaveNote;
}(_stemmablenote.StemmableNote);