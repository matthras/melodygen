'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TabNote = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _modifier = require('./modifier');

var _stem = require('./stem');

var _stemmablenote = require('./stemmablenote');

var _dot = require('./dot');

var _glyph2 = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// The file implements notes for Tablature notation. This consists of one or
// more fret positions, and can either be drawn with or without stems.
//
// See `tests/tabnote_tests.js` for usage examples

// Gets the unused strings grouped together if consecutive.
//
// Parameters:
// * num_lines - The number of lines
// * strings_used - An array of numbers representing which strings have fret positions
function getUnusedStringGroups(num_lines, strings_used) {
  var stem_through = [];
  var group = [];
  for (var string = 1; string <= num_lines; string++) {
    var is_used = strings_used.indexOf(string) > -1;

    if (!is_used) {
      group.push(string);
    } else {
      stem_through.push(group);
      group = [];
    }
  }
  if (group.length > 0) stem_through.push(group);

  return stem_through;
}

// Gets groups of points that outline the partial stem lines
// between fret positions
//
// Parameters:
// * stem_Y - The `y` coordinate the stem is located on
// * unused_strings - An array of groups of unused strings
// * stave - The stave to use for reference
// * stem_direction - The direction of the stem
function getPartialStemLines(stem_y, unused_strings, stave, stem_direction) {
  var up_stem = stem_direction !== 1;
  var down_stem = stem_direction !== -1;

  var line_spacing = stave.getSpacingBetweenLines();
  var total_lines = stave.getNumLines();

  var stem_lines = [];

  unused_strings.forEach(function (strings) {
    var containsLastString = strings.indexOf(total_lines) > -1;
    var containsFirstString = strings.indexOf(1) > -1;

    if (up_stem && containsFirstString || down_stem && containsLastString) {
      return;
    }

    // If there's only one string in the group, push a duplicate value.
    // We do this because we need 2 strings to convert into upper/lower y
    // values.
    if (strings.length === 1) {
      strings.push(strings[0]);
    }

    var line_ys = [];
    // Iterate through each group string and store it's y position
    strings.forEach(function (string, index, strings) {
      var isTopBound = string === 1;
      var isBottomBound = string === total_lines;

      // Get the y value for the appropriate staff line,
      // we adjust for a 0 index array, since string numbers are index 1
      var y = stave.getYForLine(string - 1);

      // Unless the string is the first or last, add padding to each side
      // of the line
      if (index === 0 && !isTopBound) {
        y -= line_spacing / 2 - 1;
      } else if (index === strings.length - 1 && !isBottomBound) {
        y += line_spacing / 2 - 1;
      }

      // Store the y value
      line_ys.push(y);

      // Store a subsequent y value connecting this group to the main
      // stem above/below the stave if it's the top/bottom string
      if (stem_direction === 1 && isTopBound) {
        line_ys.push(stem_y - 2);
      } else if (stem_direction === -1 && isBottomBound) {
        line_ys.push(stem_y + 2);
      }
    });

    // Add the sorted y values to the
    stem_lines.push(line_ys.sort(function (a, b) {
      return a - b;
    }));
  });

  return stem_lines;
}

var TabNote = exports.TabNote = function (_StemmableNote) {
  _inherits(TabNote, _StemmableNote);

  _createClass(TabNote, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'tabnotes';
    }

    // Initialize the TabNote with a `tab_struct` full of properties
    // and whether to `draw_stem` when rendering the note

  }]);

  function TabNote(tab_struct, draw_stem) {
    _classCallCheck(this, TabNote);

    var _this = _possibleConstructorReturn(this, (TabNote.__proto__ || Object.getPrototypeOf(TabNote)).call(this, tab_struct));

    _this.setAttribute('type', 'TabNote');

    _this.ghost = false; // Renders parenthesis around notes
    // Note properties
    //
    // The fret positions in the note. An array of `{ str: X, fret: X }`
    _this.positions = tab_struct.positions;

    // Render Options
    _vex.Vex.Merge(_this.render_options, {
      // font size for note heads and rests
      glyph_font_scale: _tables.Flow.DEFAULT_TABLATURE_FONT_SCALE,
      // Flag to draw a stem
      draw_stem: draw_stem,
      // Flag to draw dot modifiers
      draw_dots: draw_stem,
      // Flag to extend the main stem through the stave and fret positions
      draw_stem_through_stave: false,
      // vertical shift from stave line
      y_shift: 0,
      // normal glyph scale
      scale: 1.0,
      // default tablature font
      font: '10pt Arial'
    });

    _this.glyph = _tables.Flow.durationToGlyph(_this.duration, _this.noteType);

    if (!_this.glyph) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'Invalid note initialization data (No glyph found): ' + JSON.stringify(tab_struct));
    }

    _this.buildStem();

    if (tab_struct.stem_direction) {
      _this.setStemDirection(tab_struct.stem_direction);
    } else {
      _this.setStemDirection(_stem.Stem.UP);
    }

    // Renders parenthesis around notes
    _this.ghost = false;
    _this.updateWidth();
    return _this;
  }

  _createClass(TabNote, [{
    key: 'reset',
    value: function reset() {
      if (this.stave) this.setStave(this.stave);
    }

    // The ModifierContext category

  }, {
    key: 'getCategory',
    value: function getCategory() {
      return TabNote.CATEGORY;
    }

    // Set as ghost `TabNote`, surrounds the fret positions with parenthesis.
    // Often used for indicating frets that are being bent to

  }, {
    key: 'setGhost',
    value: function setGhost(ghost) {
      this.ghost = ghost;
      this.updateWidth();
      return this;
    }

    // Determine if the note has a stem

  }, {
    key: 'hasStem',
    value: function hasStem() {
      return this.render_options.draw_stem;
    }

    // Get the default stem extension for the note

  }, {
    key: 'getStemExtension',
    value: function getStemExtension() {
      var glyph = this.getGlyph();

      if (this.stem_extension_override != null) {
        return this.stem_extension_override;
      }

      if (glyph) {
        return this.getStemDirection() === 1 ? glyph.tabnote_stem_up_extension : glyph.tabnote_stem_down_extension;
      }

      return 0;
    }

    // Add a dot to the note

  }, {
    key: 'addDot',
    value: function addDot() {
      var dot = new _dot.Dot();
      this.dots += 1;
      return this.addModifier(dot, 0);
    }

    // Calculate and store the width of the note

  }, {
    key: 'updateWidth',
    value: function updateWidth() {
      var _this2 = this;

      this.glyphs = [];
      this.width = 0;
      for (var i = 0; i < this.positions.length; ++i) {
        var fret = this.positions[i].fret;
        if (this.ghost) fret = '(' + fret + ')';
        var glyph = _tables.Flow.tabToGlyph(fret, this.render_options.scale);
        this.glyphs.push(glyph);
        this.width = Math.max(glyph.getWidth(), this.width);
      }
      // For some reason we associate a notehead glyph with a TabNote, and this
      // glyph is used for certain width calculations. Of course, this is totally
      // incorrect since a notehead is a poor approximation for the dimensions of
      // a fret number which can have multiple digits. As a result, we must
      // overwrite getWidth() to return the correct width
      this.glyph.getWidth = function () {
        return _this2.width;
      };
    }

    // Set the `stave` to the note

  }, {
    key: 'setStave',
    value: function setStave(stave) {
      var _this3 = this;

      _get(TabNote.prototype.__proto__ || Object.getPrototypeOf(TabNote.prototype), 'setStave', this).call(this, stave);
      this.context = stave.context;

      // Calculate the fret number width based on font used
      var i = void 0;
      if (this.context) {
        var ctx = this.context;
        this.width = 0;

        var _loop = function _loop() {
          var glyph = _this3.glyphs[i];
          var text = '' + glyph.text;
          if (text.toUpperCase() !== 'X') {
            ctx.save();
            ctx.setRawFont(_this3.render_options.font);
            glyph.width = ctx.measureText(text).width;
            ctx.restore();
            glyph.getWidth = function () {
              return glyph.width;
            };
          }
          _this3.width = Math.max(glyph.getWidth(), _this3.width);
        };

        for (i = 0; i < this.glyphs.length; ++i) {
          _loop();
        }
        this.glyph.getWidth = function () {
          return _this3.width;
        };
      }

      // we subtract 1 from `line` because getYForLine expects a 0-based index,
      // while the position.str is a 1-based index
      var ys = this.positions.map(function (_ref) {
        var line = _ref.str;
        return stave.getYForLine(line - 1);
      });

      this.setYs(ys);

      if (this.stem) {
        this.stem.setYBounds(this.getStemY(), this.getStemY());
      }

      return this;
    }

    // Get the fret positions for the note

  }, {
    key: 'getPositions',
    value: function getPositions() {
      return this.positions;
    }

    // Add self to the provided modifier context `mc`

  }, {
    key: 'addToModifierContext',
    value: function addToModifierContext(mc) {
      this.setModifierContext(mc);
      for (var i = 0; i < this.modifiers.length; ++i) {
        this.modifierContext.addModifier(this.modifiers[i]);
      }
      this.modifierContext.addModifier(this);
      this.preFormatted = false;
      return this;
    }

    // Get the `x` coordinate to the right of the note

  }, {
    key: 'getTieRightX',
    value: function getTieRightX() {
      var tieStartX = this.getAbsoluteX();
      var note_glyph_width = this.glyph.getWidth();
      tieStartX += note_glyph_width / 2;
      tieStartX += -this.width / 2 + this.width + 2;

      return tieStartX;
    }

    // Get the `x` coordinate to the left of the note

  }, {
    key: 'getTieLeftX',
    value: function getTieLeftX() {
      var tieEndX = this.getAbsoluteX();
      var note_glyph_width = this.glyph.getWidth();
      tieEndX += note_glyph_width / 2;
      tieEndX -= this.width / 2 + 2;

      return tieEndX;
    }

    // Get the default `x` and `y` coordinates for a modifier at a specific
    // `position` at a fret position `index`

  }, {
    key: 'getModifierStartXY',
    value: function getModifierStartXY(position, index) {
      if (!this.preFormatted) {
        throw new _vex.Vex.RERR('UnformattedNote', "Can't call GetModifierStartXY on an unformatted note");
      }

      if (this.ys.length === 0) {
        throw new _vex.Vex.RERR('NoYValues', 'No Y-Values calculated for this note.');
      }

      var x = 0;
      if (position === _modifier.Modifier.Position.LEFT) {
        x = -1 * 2; // extra_left_px
      } else if (position === _modifier.Modifier.Position.RIGHT) {
        x = this.width + 2; // extra_right_px
      } else if (position === _modifier.Modifier.Position.BELOW || position === _modifier.Modifier.Position.ABOVE) {
        var note_glyph_width = this.glyph.getWidth();
        x = note_glyph_width / 2;
      }

      return {
        x: this.getAbsoluteX() + x,
        y: this.ys[index]
      };
    }

    // Get the default line for rest

  }, {
    key: 'getLineForRest',
    value: function getLineForRest() {
      return this.positions[0].str;
    }

    // Pre-render formatting

  }, {
    key: 'preFormat',
    value: function preFormat() {
      if (this.preFormatted) return;
      if (this.modifierContext) this.modifierContext.preFormat();
      // width is already set during init()
      this.setPreFormatted(true);
    }

    // Get the x position for the stem

  }, {
    key: 'getStemX',
    value: function getStemX() {
      return this.getCenterGlyphX();
    }

    // Get the y position for the stem

  }, {
    key: 'getStemY',
    value: function getStemY() {
      var num_lines = this.stave.getNumLines();

      // The decimal staff line amounts provide optimal spacing between the
      // fret number and the stem
      var stemUpLine = -0.5;
      var stemDownLine = num_lines - 0.5;
      var stemStartLine = _stem.Stem.UP === this.stem_direction ? stemUpLine : stemDownLine;

      return this.stave.getYForLine(stemStartLine);
    }

    // Get the stem extents for the tabnote

  }, {
    key: 'getStemExtents',
    value: function getStemExtents() {
      return this.stem.getExtents();
    }

    // Draw the fal onto the context

  }, {
    key: 'drawFlag',
    value: function drawFlag() {
      var beam = this.beam,
          glyph = this.glyph,
          context = this.context,
          stem = this.stem,
          stem_direction = this.stem_direction,
          _render_options = this.render_options,
          draw_stem = _render_options.draw_stem,
          glyph_font_scale = _render_options.glyph_font_scale;


      var shouldDrawFlag = beam == null && draw_stem;

      // Now it's the flag's turn.
      if (glyph.flag && shouldDrawFlag) {
        var flag_x = this.getStemX() + 1;
        var flag_y = this.getStemY() - stem.getHeight();

        var flag_code = stem_direction === _stem.Stem.DOWN ? glyph.code_flag_downstem // Down stems have flags on the left.
        : glyph.code_flag_upstem;

        // Draw the Flag
        _glyph2.Glyph.renderGlyph(context, flag_x, flag_y, glyph_font_scale, flag_code);
      }
    }

    // Render the modifiers onto the context

  }, {
    key: 'drawModifiers',
    value: function drawModifiers() {
      var _this4 = this;

      // Draw the modifiers
      this.modifiers.forEach(function (modifier) {
        // Only draw the dots if enabled
        if (modifier.getCategory() === 'dots' && !_this4.render_options.draw_dots) return;

        modifier.setContext(_this4.context);
        modifier.draw();
      });
    }

    // Render the stem extension through the fret positions

  }, {
    key: 'drawStemThrough',
    value: function drawStemThrough() {
      var stem_x = this.getStemX();
      var stem_y = this.getStemY();
      var ctx = this.context;

      var stem_through = this.render_options.draw_stem_through_stave;
      var draw_stem = this.render_options.draw_stem;
      if (draw_stem && stem_through) {
        var total_lines = this.stave.getNumLines();
        var strings_used = this.positions.map(function (position) {
          return position.str;
        });

        var unused_strings = getUnusedStringGroups(total_lines, strings_used);
        var stem_lines = getPartialStemLines(stem_y, unused_strings, this.getStave(), this.getStemDirection());

        ctx.save();
        ctx.setLineWidth(_stem.Stem.WIDTH);
        stem_lines.forEach(function (bounds) {
          if (bounds.length === 0) return;

          ctx.beginPath();
          ctx.moveTo(stem_x, bounds[0]);
          ctx.lineTo(stem_x, bounds[bounds.length - 1]);
          ctx.stroke();
          ctx.closePath();
        });
        ctx.restore();
      }
    }

    // Render the fret positions onto the context

  }, {
    key: 'drawPositions',
    value: function drawPositions() {
      var ctx = this.context;
      var x = this.getAbsoluteX();
      var ys = this.ys;
      for (var i = 0; i < this.positions.length; ++i) {
        var y = ys[i] + this.render_options.y_shift;
        var _glyph = this.glyphs[i];

        // Center the fret text beneath the notation note head
        var note_glyph_width = this.glyph.getWidth();
        var tab_x = x + note_glyph_width / 2 - _glyph.getWidth() / 2;

        // FIXME: Magic numbers.
        ctx.clearRect(tab_x - 2, y - 3, _glyph.getWidth() + 4, 6);

        if (_glyph.code) {
          _glyph2.Glyph.renderGlyph(ctx, tab_x, y, this.render_options.glyph_font_scale * this.render_options.scale, _glyph.code);
        } else {
          ctx.save();
          ctx.setRawFont(this.render_options.font);
          var _text = _glyph.text.toString();
          ctx.fillText(_text, tab_x, y + 5 * this.render_options.scale);
          ctx.restore();
        }
      }
    }

    // The main rendering function for the entire note

  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();

      if (!this.stave) {
        throw new _vex.Vex.RERR('NoStave', "Can't draw without a stave.");
      }

      if (this.ys.length === 0) {
        throw new _vex.Vex.RERR('NoYValues', "Can't draw note without Y values.");
      }

      this.setRendered();
      var render_stem = this.beam == null && this.render_options.draw_stem;

      this.drawPositions();
      this.drawStemThrough();

      var stem_x = this.getStemX();

      this.stem.setNoteHeadXBounds(stem_x, stem_x);

      if (render_stem) {
        this.context.openGroup('stem', null, { pointerBBox: true });
        this.stem.setContext(this.context).draw();
        this.context.closeGroup();
      }

      this.drawFlag();
      this.drawModifiers();
    }
  }]);

  return TabNote;
}(_stemmablenote.StemmableNote);