Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Accidental = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _fraction = require('./fraction');

var _tables = require('./tables');

var _music = require('./music');

var _modifier = require('./modifier');

var _glyph = require('./glyph');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// @author Mohit Cheppudira
// @author Greg Ristow (modifications)
//
// ## Description
//
// This file implements accidentals as modifiers that can be attached to
// notes. Support is included for both western and microtonal accidentals.
//
// See `tests/accidental_tests.js` for usage examples.

// To enable logging for this class. Set `Vex.Flow.Accidental.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (Accidental.DEBUG) _vex.Vex.L('Vex.Flow.Accidental', args);
}

var getGlyphWidth = function getGlyphWidth(glyph) {
  return glyph.getMetrics().width;
};

// An `Accidental` inherits from `Modifier`, and is formatted within a
// `ModifierContext`.

var Accidental = exports.Accidental = function (_Modifier) {
  _inherits(Accidental, _Modifier);

  _createClass(Accidental, null, [{
    key: 'format',


    // Arrange accidentals inside a ModifierContext.
    value: function format(accidentals, state) {
      var _this2 = this;

      var noteheadAccidentalPadding = 1;
      var leftShift = state.left_shift + noteheadAccidentalPadding;
      var accidentalSpacing = 3;

      // If there are no accidentals, we needn't format their positions
      if (!accidentals || accidentals.length === 0) return;

      var accList = [];
      var prevNote = null;
      var shiftL = 0;

      // First determine the accidentals' Y positions from the note.keys
      var propsTemp = void 0;
      for (var i = 0; i < accidentals.length; ++i) {
        var acc = accidentals[i];
        var note = acc.getNote();
        var stave = note.getStave();
        var props = note.getKeyProps()[acc.getIndex()];
        if (note !== prevNote) {
          // Iterate through all notes to get the displaced pixels
          for (var n = 0; n < note.keys.length; ++n) {
            propsTemp = note.getKeyProps()[n];
            shiftL = propsTemp.displaced ? note.getExtraLeftPx() : shiftL;
          }
          prevNote = note;
        }
        if (stave !== null) {
          var lineSpace = stave.options.spacing_between_lines_px;
          var y = stave.getYForLine(props.line);
          var accLine = Math.round(y / lineSpace * 2) / 2;
          accList.push({ y: y, line: accLine, shift: shiftL, acc: acc, lineSpace: lineSpace });
        } else {
          accList.push({ line: props.line, shift: shiftL, acc: acc });
        }
      }

      // Sort accidentals by line number.
      accList.sort(function (a, b) {
        return b.line - a.line;
      });

      // FIXME: Confusing name. Each object in this array has a property called `line`.
      // So if this is a list of lines, you end up with: `line.line` which is very awkward.
      var lineList = [];

      // amount by which all accidentals must be shifted right or left for
      // stem flipping, notehead shifting concerns.
      var accShift = 0;
      var previousLine = null;

      // Create an array of unique line numbers (lineList) from accList
      for (var _i = 0; _i < accList.length; _i++) {
        var _acc = accList[_i];

        // if this is the first line, or a new line, add a lineList
        if (previousLine === null || previousLine !== _acc.line) {
          lineList.push({
            line: _acc.line,
            flatLine: true,
            dblSharpLine: true,
            numAcc: 0,
            width: 0
          });
        }
        // if this accidental is not a flat, the accidental needs 3.0 lines lower
        // clearance instead of 2.5 lines for b or bb.
        // FIXME: Naming could use work. acc.acc is very awkward
        if (_acc.acc.type !== 'b' && _acc.acc.type !== 'bb') {
          lineList[lineList.length - 1].flatLine = false;
        }

        // if this accidental is not a double sharp, the accidental needs 3.0 lines above
        if (_acc.acc.type !== '##') {
          lineList[lineList.length - 1].dblSharpLine = false;
        }

        // Track how many accidentals are on this line:
        lineList[lineList.length - 1].numAcc++;

        // Track the total x_offset needed for this line which will be needed
        // for formatting lines w/ multiple accidentals:

        // width = accidental width + universal spacing between accidentals
        lineList[lineList.length - 1].width += _acc.acc.getWidth() + accidentalSpacing;

        // if this accShift is larger, use it to keep first column accidentals in the same line
        accShift = _acc.shift > accShift ? _acc.shift : accShift;

        previousLine = _acc.line;
      }

      // ### Place Accidentals in Columns
      //
      // Default to a classic triangular layout (middle accidental farthest left),
      // but follow exceptions as outlined in G. Read's _Music Notation_ and
      // Elaine Gould's _Behind Bars_.
      //
      // Additionally, this implements different vertical collision rules for
      // flats (only need 2.5 lines clearance below) and double sharps (only
      // need 2.5 lines of clearance above or below).
      //
      // Classic layouts and exception patterns are found in the 'tables.js'
      // in 'Vex.Flow.accidentalColumnsTable'
      //
      // Beyond 6 vertical accidentals, default to the parallel ascending lines approach,
      // using as few columns as possible for the verticle structure.
      //
      // TODO (?): Allow column to be specified for an accidental at run-time?

      var totalColumns = 0;

      // establish the boundaries for a group of notes with clashing accidentals:

      var _loop = function _loop(_i3) {
        var noFurtherConflicts = false;
        var groupStart = _i3;
        var groupEnd = _i3;

        while (groupEnd + 1 < lineList.length && !noFurtherConflicts) {
          // if this note conflicts with the next:
          if (_this2.checkCollision(lineList[groupEnd], lineList[groupEnd + 1])) {
            // include the next note in the group:
            groupEnd++;
          } else {
            noFurtherConflicts = true;
          }
        }

        // Gets an a line from the `lineList`, relative to the current group
        var getGroupLine = function getGroupLine(index) {
          return lineList[groupStart + index];
        };
        var getGroupLines = function getGroupLines(indexes) {
          return indexes.map(getGroupLine);
        };
        var lineDifference = function lineDifference(indexA, indexB) {
          var _getGroupLines$map = getGroupLines([indexA, indexB]).map(function (item) {
            return item.line;
          }),
              _getGroupLines$map2 = _slicedToArray(_getGroupLines$map, 2),
              a = _getGroupLines$map2[0],
              b = _getGroupLines$map2[1];

          return a - b;
        };

        var notColliding = function notColliding() {
          for (var _len2 = arguments.length, indexPairs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            indexPairs[_key2] = arguments[_key2];
          }

          return indexPairs.map(getGroupLines).every(function (lines) {
            return !_this2.checkCollision.apply(_this2, _toConsumableArray(lines));
          });
        };

        // Set columns for the lines in this group:
        var groupLength = groupEnd - groupStart + 1;

        // Set the accidental column for each line of the group
        var endCase = _this2.checkCollision(lineList[groupStart], lineList[groupEnd]) ? 'a' : 'b';

        switch (groupLength) {
          case 3:
            if (endCase === 'a' && lineDifference(1, 2) === 0.5 && lineDifference(0, 1) !== 0.5) {
              endCase = 'second_on_bottom';
            }
            break;
          case 4:
            if (notColliding([0, 2], [1, 3])) {
              endCase = 'spaced_out_tetrachord';
            }
            break;
          case 5:
            if (endCase === 'b' && notColliding([1, 3])) {
              endCase = 'spaced_out_pentachord';
              if (notColliding([0, 2], [2, 4])) {
                endCase = 'very_spaced_out_pentachord';
              }
            }
            break;
          case 6:
            if (notColliding([0, 3], [1, 4], [2, 5])) {
              endCase = 'spaced_out_hexachord';
            }
            if (notColliding([0, 2], [2, 4], [1, 3], [3, 5])) {
              endCase = 'very_spaced_out_hexachord';
            }
            break;
          default:
            break;
        }

        var groupMember = void 0;
        var column = void 0;
        // If the group contains more than seven members, use ascending parallel lines
        // of accidentals, using as few columns as possible while avoiding collisions.
        if (groupLength >= 7) {
          // First, determine how many columns to use:
          var patternLength = 2;
          var collisionDetected = true;
          while (collisionDetected === true) {
            collisionDetected = false;
            for (var line = 0; line + patternLength < lineList.length; line++) {
              if (_this2.checkCollision(lineList[line], lineList[line + patternLength])) {
                collisionDetected = true;
                patternLength++;
                break;
              }
            }
          }
          // Then, assign a column to each line of accidentals
          for (groupMember = _i3; groupMember <= groupEnd; groupMember++) {
            column = (groupMember - _i3) % patternLength + 1;
            lineList[groupMember].column = column;
            totalColumns = totalColumns > column ? totalColumns : column;
          }

          // Otherwise, if the group contains fewer than seven members, use the layouts from
          // the accidentalsColumnsTable housed in tables.js.
        } else {
          for (groupMember = _i3; groupMember <= groupEnd; groupMember++) {
            column = _tables.Flow.accidentalColumnsTable[groupLength][endCase][groupMember - _i3];
            lineList[groupMember].column = column;
            totalColumns = totalColumns > column ? totalColumns : column;
          }
        }

        // Increment i to the last note that was set, so that if a lower set of notes
        // does not conflict at all with this group, it can have its own classic shape.
        _i3 = groupEnd;
        _i2 = _i3;
      };

      for (var _i2 = 0; _i2 < lineList.length; _i2++) {
        _loop(_i2);
      }

      // ### Convert Columns to x_offsets
      //
      // This keeps columns aligned, even if they have different accidentals within them
      // which sometimes results in a larger x_offset than is an accidental might need
      // to preserve the symmetry of the accidental shape.
      //
      // Neither A.C. Vinci nor G. Read address this, and it typically only happens in
      // music with complex chord clusters.
      //
      // TODO (?): Optionally allow closer compression of accidentals, instead of forcing
      // parallel columns.

      // track each column's max width, which will be used as initial shift of later columns:
      var columnWidths = [];
      var columnXOffsets = [];
      for (var _i4 = 0; _i4 <= totalColumns; _i4++) {
        columnWidths[_i4] = 0;
        columnXOffsets[_i4] = 0;
      }

      columnWidths[0] = accShift + leftShift;
      columnXOffsets[0] = accShift + leftShift;

      // Fill columnWidths with widest needed x-space;
      // this is what keeps the columns parallel.
      lineList.forEach(function (line) {
        if (line.width > columnWidths[line.column]) columnWidths[line.column] = line.width;
      });

      for (var _i5 = 1; _i5 < columnWidths.length; _i5++) {
        // this column's offset = this column's width + previous column's offset
        columnXOffsets[_i5] = columnWidths[_i5] + columnXOffsets[_i5 - 1];
      }

      var totalShift = columnXOffsets[columnXOffsets.length - 1];
      // Set the xShift for each accidental according to column offsets:
      var accCount = 0;
      lineList.forEach(function (line) {
        var lineWidth = 0;
        var lastAccOnLine = accCount + line.numAcc;
        // handle all of the accidentals on a given line:
        for (accCount; accCount < lastAccOnLine; accCount++) {
          var xShift = columnXOffsets[line.column - 1] + lineWidth;
          accList[accCount].acc.setXShift(xShift);
          // keep track of the width of accidentals we've added so far, so that when
          // we loop, we add space for them.
          lineWidth += accList[accCount].acc.getWidth() + accidentalSpacing;
          L('Line, accCount, shift: ', line.line, accCount, xShift);
        }
      });

      // update the overall layout with the full width of the accidental shapes:
      state.left_shift += totalShift;
    }

    // Helper function to determine whether two lines of accidentals collide vertically

  }, {
    key: 'checkCollision',
    value: function checkCollision(line1, line2) {
      var clearance = line2.line - line1.line;
      var clearanceRequired = 3;
      // But less clearance is required for certain accidentals: b, bb and ##.
      if (clearance > 0) {
        // then line 2 is on top
        clearanceRequired = line2.flatLine || line2.dblSharpLine ? 2.5 : 3.0;
        if (line1.dblSharpLine) clearance -= 0.5;
      } else {
        // line 1 is on top
        clearanceRequired = line1.flatLine || line1.dblSharpLine ? 2.5 : 3.0;
        if (line2.dblSharpLine) clearance -= 0.5;
      }
      var collision = Math.abs(clearance) < clearanceRequired;
      L('Line_1, Line_2, Collision: ', line1.line, line2.line, collision);
      return collision;
    }

    // Use this method to automatically apply accidentals to a set of `voices`.
    // The accidentals will be remembered between all the voices provided.
    // Optionally, you can also provide an initial `keySignature`.

  }, {
    key: 'applyAccidentals',
    value: function applyAccidentals(voices, keySignature) {
      var tickPositions = [];
      var tickNoteMap = {};

      // Sort the tickables in each voice by their tick position in the voice
      voices.forEach(function (voice) {
        var tickPosition = new _fraction.Fraction(0, 1);
        var notes = voice.getTickables();
        notes.forEach(function (note) {
          if (note.shouldIgnoreTicks()) return;

          var notesAtPosition = tickNoteMap[tickPosition.value()];

          if (!notesAtPosition) {
            tickPositions.push(tickPosition.value());
            tickNoteMap[tickPosition.value()] = [note];
          } else {
            notesAtPosition.push(note);
          }

          tickPosition.add(note.getTicks());
        });
      });

      var music = new _music.Music();

      // Default key signature is C major
      if (!keySignature) keySignature = 'C';

      // Get the scale map, which represents the current state of each pitch
      var scaleMap = music.createScaleMap(keySignature);

      tickPositions.forEach(function (tick) {
        var notes = tickNoteMap[tick];

        // Array to store all pitches that modified accidental states
        // at this tick position
        var modifiedPitches = [];

        var processNote = function processNote(note) {
          if (note.isRest() || note.shouldIgnoreTicks()) return;

          // Go through each key and determine if an accidental should be
          // applied
          note.keys.forEach(function (keyString, keyIndex) {
            var key = music.getNoteParts(keyString.split('/')[0]);

            // Force a natural for every key without an accidental
            var accidentalString = key.accidental || 'n';
            var pitch = key.root + accidentalString;

            // Determine if the current pitch has the same accidental
            // as the scale state
            var sameAccidental = scaleMap[key.root] === pitch;

            // Determine if an identical pitch in the chord already
            // modified the accidental state
            var previouslyModified = modifiedPitches.indexOf(pitch) > -1;

            // Add the accidental to the StaveNote
            if (!sameAccidental || sameAccidental && previouslyModified) {
              // Modify the scale map so that the root pitch has an
              // updated state
              scaleMap[key.root] = pitch;

              // Create the accidental
              var accidental = new Accidental(accidentalString);

              // Attach the accidental to the StaveNote
              note.addAccidental(keyIndex, accidental);

              // Add the pitch to list of pitches that modified accidentals
              modifiedPitches.push(pitch);
            }
          });

          // process grace notes
          note.getModifiers().forEach(function (modifier) {
            if (modifier.getCategory() === 'gracenotegroups') {
              modifier.getGraceNotes().forEach(processNote);
            }
          });
        };

        notes.forEach(processNote);
      });
    }

    // Create accidental. `type` can be a value from the
    // `Vex.Flow.accidentalCodes.accidentals` table in `tables.js`. For
    // example: `#`, `##`, `b`, `n`, etc.

  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'accidentals';
    }
  }]);

  function Accidental() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, Accidental);

    var _this = _possibleConstructorReturn(this, (Accidental.__proto__ || Object.getPrototypeOf(Accidental)).call(this));

    _this.setAttribute('type', 'Accidental');

    L('New accidental: ', type);

    _this.note = null;
    // The `index` points to a specific note in a chord.
    _this.index = null;
    _this.type = type;
    _this.position = _modifier.Modifier.Position.LEFT;

    _this.render_options = {
      // Font size for glyphs
      font_scale: 38,

      // Length of stroke across heads above or below the stave.
      stroke_px: 3,

      // Padding between accidental and parentheses on each side
      parenLeftPadding: 2,
      parenRightPadding: 2
    };

    _this.accidental = _tables.Flow.accidentalCodes(_this.type);
    if (!_this.accidental) {
      throw new _vex.Vex.RERR('ArgumentError', 'Unknown accidental type: ' + type);
    }

    // Cautionary accidentals have parentheses around them
    _this.cautionary = false;
    _this.parenLeft = null;
    _this.parenRight = null;

    _this.reset();
    return _this;
  }

  _createClass(Accidental, [{
    key: 'reset',
    value: function reset() {
      var fontScale = this.render_options.font_scale;
      this.glyph = new _glyph.Glyph(this.accidental.code, fontScale);
      this.glyph.setOriginX(1.0);

      if (this.cautionary) {
        this.parenLeft = new _glyph.Glyph(_tables.Flow.accidentalCodes('{').code, fontScale);
        this.parenRight = new _glyph.Glyph(_tables.Flow.accidentalCodes('}').code, fontScale);
        this.parenLeft.setOriginX(1.0);
        this.parenRight.setOriginX(1.0);
      }
    }
  }, {
    key: 'getCategory',
    value: function getCategory() {
      return Accidental.CATEGORY;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      var parenWidth = this.cautionary ? getGlyphWidth(this.parenLeft) + getGlyphWidth(this.parenRight) + this.render_options.parenLeftPadding + this.render_options.parenRightPadding : 0;

      return getGlyphWidth(this.glyph) + parenWidth;
    }

    // Attach this accidental to `note`, which must be a `StaveNote`.

  }, {
    key: 'setNote',
    value: function setNote(note) {
      if (!note) {
        throw new _vex.Vex.RERR('ArgumentError', 'Bad note value: ' + note);
      }

      this.note = note;

      // Accidentals attached to grace notes are rendered smaller.
      if (this.note.getCategory() === 'gracenotes') {
        this.render_options.font_scale = 25;
        this.reset();
      }
    }

    // If called, draws parenthesis around accidental.

  }, {
    key: 'setAsCautionary',
    value: function setAsCautionary() {
      this.cautionary = true;
      this.render_options.font_scale = 28;
      this.reset();
      return this;
    }

    // Render accidental onto canvas.

  }, {
    key: 'draw',
    value: function draw() {
      var context = this.context,
          type = this.type,
          position = this.position,
          note = this.note,
          index = this.index,
          cautionary = this.cautionary,
          x_shift = this.x_shift,
          y_shift = this.y_shift,
          glyph = this.glyph,
          parenLeft = this.parenLeft,
          parenRight = this.parenRight,
          _render_options = this.render_options,
          parenLeftPadding = _render_options.parenLeftPadding,
          parenRightPadding = _render_options.parenRightPadding;


      this.checkContext();

      if (!(note && index != null)) {
        throw new _vex.Vex.RERR('NoAttachedNote', "Can't draw accidental without a note and index.");
      }

      // Figure out the start `x` and `y` coordinates for note and index.
      var start = note.getModifierStartXY(position, index);
      var accX = start.x + x_shift;
      var accY = start.y + y_shift;
      L('Rendering: ', type, accX, accY);

      if (!cautionary) {
        glyph.render(context, accX, accY);
      } else {
        // Render the accidental in parentheses.
        parenRight.render(context, accX, accY);
        accX -= getGlyphWidth(parenRight);
        accX -= parenRightPadding;
        accX -= this.accidental.parenRightPaddingAdjustment;
        glyph.render(context, accX, accY);
        accX -= getGlyphWidth(glyph);
        accX -= parenLeftPadding;
        parenLeft.render(context, accX, accY);
      }

      this.setRendered();
    }
  }]);

  return Accidental;
}(_modifier.Modifier);