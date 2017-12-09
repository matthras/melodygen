'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stave = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

var _tables = require('./tables');

var _stavebarline = require('./stavebarline');

var _stavemodifier = require('./stavemodifier');

var _staverepetition = require('./staverepetition');

var _stavesection = require('./stavesection');

var _stavetempo = require('./stavetempo');

var _stavetext = require('./stavetext');

var _boundingbox = require('./boundingbox');

var _clef = require('./clef');

var _keysignature = require('./keysignature');

var _timesignature = require('./timesignature');

var _stavevolta = require('./stavevolta');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.

var Stave = exports.Stave = function (_Element) {
  _inherits(Stave, _Element);

  function Stave(x, y, width, options) {
    _classCallCheck(this, Stave);

    var _this = _possibleConstructorReturn(this, (Stave.__proto__ || Object.getPrototypeOf(Stave)).call(this));

    _this.setAttribute('type', 'Stave');

    _this.x = x;
    _this.y = y;
    _this.width = width;
    _this.formatted = false;
    _this.start_x = x + 5;
    _this.end_x = x + width;
    _this.modifiers = []; // stave modifiers (clef, key, time, barlines, coda, segno, etc.)
    _this.measure = 0;
    _this.clef = 'treble';
    _this.font = {
      family: 'sans-serif',
      size: 8,
      weight: ''
    };
    _this.options = {
      vertical_bar_width: 10, // Width around vertical bar end-marker
      glyph_spacing_px: 10,
      num_lines: 5,
      fill_style: '#999999',
      left_bar: true, // draw vertical bar on left
      right_bar: true, // draw vertical bar on right
      spacing_between_lines_px: 10, // in pixels
      space_above_staff_ln: 4, // in staff lines
      space_below_staff_ln: 4, // in staff lines
      top_text_position: 1 // in staff lines
    };
    _this.bounds = { x: _this.x, y: _this.y, w: _this.width, h: 0 };
    _vex.Vex.Merge(_this.options, options);

    _this.resetLines();

    var BARTYPE = _stavebarline.Barline.type;
    // beg bar
    _this.addModifier(new _stavebarline.Barline(_this.options.left_bar ? BARTYPE.SINGLE : BARTYPE.NONE));
    // end bar
    _this.addEndModifier(new _stavebarline.Barline(_this.options.right_bar ? BARTYPE.SINGLE : BARTYPE.NONE));
    return _this;
  }

  _createClass(Stave, [{
    key: 'space',
    value: function space(spacing) {
      return this.options.spacing_between_lines_px * spacing;
    }
  }, {
    key: 'resetLines',
    value: function resetLines() {
      this.options.line_config = [];
      for (var i = 0; i < this.options.num_lines; i++) {
        this.options.line_config.push({ visible: true });
      }
      this.height = (this.options.num_lines + this.options.space_above_staff_ln) * this.options.spacing_between_lines_px;
      this.options.bottom_text_position = this.options.num_lines;
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.options;
    }
  }, {
    key: 'setNoteStartX',
    value: function setNoteStartX(x) {
      if (!this.formatted) this.format();

      this.start_x = x;
      return this;
    }
  }, {
    key: 'getNoteStartX',
    value: function getNoteStartX() {
      if (!this.formatted) this.format();

      return this.start_x;
    }
  }, {
    key: 'getNoteEndX',
    value: function getNoteEndX() {
      if (!this.formatted) this.format();

      return this.end_x;
    }
  }, {
    key: 'getTieStartX',
    value: function getTieStartX() {
      return this.start_x;
    }
  }, {
    key: 'getTieEndX',
    value: function getTieEndX() {
      return this.x + this.width;
    }
  }, {
    key: 'getX',
    value: function getX() {
      return this.x;
    }
  }, {
    key: 'getNumLines',
    value: function getNumLines() {
      return this.options.num_lines;
    }
  }, {
    key: 'setNumLines',
    value: function setNumLines(lines) {
      this.options.num_lines = parseInt(lines, 10);
      this.resetLines();
      return this;
    }
  }, {
    key: 'setY',
    value: function setY(y) {
      this.y = y;return this;
    }
  }, {
    key: 'getTopLineTopY',
    value: function getTopLineTopY() {
      return this.getYForLine(0) - _tables.Flow.STAVE_LINE_THICKNESS / 2;
    }
  }, {
    key: 'getBottomLineBottomY',
    value: function getBottomLineBottomY() {
      return this.getYForLine(this.getNumLines() - 1) + _tables.Flow.STAVE_LINE_THICKNESS / 2;
    }
  }, {
    key: 'setX',
    value: function setX(x) {
      var shift = x - this.x;
      this.formatted = false;
      this.x = x;
      this.start_x += shift;
      this.end_x += shift;
      for (var i = 0; i < this.modifiers.length; i++) {
        var mod = this.modifiers[i];
        if (mod.x !== undefined) {
          mod.x += shift;
        }
      }
      return this;
    }
  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      this.formatted = false;
      this.width = width;
      this.end_x = this.x + width;

      // reset the x position of the end barline (TODO(0xfe): This makes no sense)
      // this.modifiers[1].setX(this.end_x);
      return this;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }
  }, {
    key: 'getStyle',
    value: function getStyle() {
      return Object.assign({
        fillStyle: this.options.fill_style,
        strokeStyle: this.options.fill_style, // yes, this is correct for legacy compatibility
        lineWidth: _tables.Flow.STAVE_LINE_THICKNESS
      }, this.style || {});
    }
  }, {
    key: 'setMeasure',
    value: function setMeasure(measure) {
      this.measure = measure;return this;
    }

    /**
     * Gets the pixels to shift from the beginning of the stave
     * following the modifier at the provided index
     * @param  {Number} index The index from which to determine the shift
     * @return {Number}       The amount of pixels shifted
     */

  }, {
    key: 'getModifierXShift',
    value: function getModifierXShift() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (typeof index !== 'number') {
        throw new _vex.Vex.RERR('InvalidIndex', 'Must be of number type');
      }

      if (!this.formatted) this.format();

      if (this.getModifiers(_stavemodifier.StaveModifier.Position.BEGIN).length === 1) {
        return 0;
      }

      var start_x = this.start_x - this.x;
      var begBarline = this.modifiers[0];
      if (begBarline.getType() === _stavebarline.Barline.type.REPEAT_BEGIN && start_x > begBarline.getWidth()) {
        start_x -= begBarline.getWidth();
      }

      return start_x;
    }

    // Coda & Segno Symbol functions

  }, {
    key: 'setRepetitionTypeLeft',
    value: function setRepetitionTypeLeft(type, y) {
      this.modifiers.push(new _staverepetition.Repetition(type, this.x, y));
      return this;
    }
  }, {
    key: 'setRepetitionTypeRight',
    value: function setRepetitionTypeRight(type, y) {
      this.modifiers.push(new _staverepetition.Repetition(type, this.x, y));
      return this;
    }

    // Volta functions

  }, {
    key: 'setVoltaType',
    value: function setVoltaType(type, number_t, y) {
      this.modifiers.push(new _stavevolta.Volta(type, number_t, this.x, y));
      return this;
    }

    // Section functions

  }, {
    key: 'setSection',
    value: function setSection(section, y) {
      this.modifiers.push(new _stavesection.StaveSection(section, this.x, y));
      return this;
    }

    // Tempo functions

  }, {
    key: 'setTempo',
    value: function setTempo(tempo, y) {
      this.modifiers.push(new _stavetempo.StaveTempo(tempo, this.x, y));
      return this;
    }

    // Text functions

  }, {
    key: 'setText',
    value: function setText(text, position, options) {
      this.modifiers.push(new _stavetext.StaveText(text, position, options));
      return this;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return this.height;
    }
  }, {
    key: 'getSpacingBetweenLines',
    value: function getSpacingBetweenLines() {
      return this.options.spacing_between_lines_px;
    }
  }, {
    key: 'getBoundingBox',
    value: function getBoundingBox() {
      return new _boundingbox.BoundingBox(this.x, this.y, this.width, this.getBottomY() - this.y);
    }
  }, {
    key: 'getBottomY',
    value: function getBottomY() {
      var options = this.options;
      var spacing = options.spacing_between_lines_px;
      var score_bottom = this.getYForLine(options.num_lines) + options.space_below_staff_ln * spacing;

      return score_bottom;
    }
  }, {
    key: 'getBottomLineY',
    value: function getBottomLineY() {
      return this.getYForLine(this.options.num_lines);
    }

    // This returns the y for the *center* of a staff line

  }, {
    key: 'getYForLine',
    value: function getYForLine(line) {
      var options = this.options;
      var spacing = options.spacing_between_lines_px;
      var headroom = options.space_above_staff_ln;

      var y = this.y + line * spacing + headroom * spacing;

      return y;
    }
  }, {
    key: 'getLineForY',
    value: function getLineForY(y) {
      // Does the reverse of getYForLine - somewhat dumb and just calls
      // getYForLine until the right value is reaches

      var options = this.options;
      var spacing = options.spacing_between_lines_px;
      var headroom = options.space_above_staff_ln;
      return (y - this.y) / spacing - headroom;
    }
  }, {
    key: 'getYForTopText',
    value: function getYForTopText(line) {
      var l = line || 0;
      return this.getYForLine(-l - this.options.top_text_position);
    }
  }, {
    key: 'getYForBottomText',
    value: function getYForBottomText(line) {
      var l = line || 0;
      return this.getYForLine(this.options.bottom_text_position + l);
    }
  }, {
    key: 'getYForNote',
    value: function getYForNote(line) {
      var options = this.options;
      var spacing = options.spacing_between_lines_px;
      var headroom = options.space_above_staff_ln;
      var y = this.y + headroom * spacing + 5 * spacing - line * spacing;

      return y;
    }
  }, {
    key: 'getYForGlyphs',
    value: function getYForGlyphs() {
      return this.getYForLine(3);
    }
  }, {
    key: 'addModifier',
    value: function addModifier(modifier, position) {
      if (position !== undefined) {
        modifier.setPosition(position);
      }

      modifier.setStave(this);
      this.formatted = false;
      this.modifiers.push(modifier);
      return this;
    }
  }, {
    key: 'addEndModifier',
    value: function addEndModifier(modifier) {
      this.addModifier(modifier, _stavemodifier.StaveModifier.Position.END);
      return this;
    }

    // Bar Line functions

  }, {
    key: 'setBegBarType',
    value: function setBegBarType(type) {
      // Only valid bar types at beginning of stave is none, single or begin repeat
      var _Barline$type = _stavebarline.Barline.type,
          SINGLE = _Barline$type.SINGLE,
          REPEAT_BEGIN = _Barline$type.REPEAT_BEGIN,
          NONE = _Barline$type.NONE;

      if (type === SINGLE || type === REPEAT_BEGIN || type === NONE) {
        this.modifiers[0].setType(type);
        this.formatted = false;
      }
      return this;
    }
  }, {
    key: 'setEndBarType',
    value: function setEndBarType(type) {
      // Repeat end not valid at end of stave
      if (type !== _stavebarline.Barline.type.REPEAT_BEGIN) {
        this.modifiers[1].setType(type);
        this.formatted = false;
      }
      return this;
    }
  }, {
    key: 'setClef',
    value: function setClef(clefSpec, size, annotation, position) {
      if (position === undefined) {
        position = _stavemodifier.StaveModifier.Position.BEGIN;
      }

      this.clef = clefSpec;
      var clefs = this.getModifiers(position, _clef.Clef.CATEGORY);
      if (clefs.length === 0) {
        this.addClef(clefSpec, size, annotation, position);
      } else {
        clefs[0].setType(clefSpec, size, annotation);
      }

      return this;
    }
  }, {
    key: 'setEndClef',
    value: function setEndClef(clefSpec, size, annotation) {
      this.setClef(clefSpec, size, annotation, _stavemodifier.StaveModifier.Position.END);
      return this;
    }
  }, {
    key: 'setKeySignature',
    value: function setKeySignature(keySpec, cancelKeySpec, position) {
      if (position === undefined) {
        position = _stavemodifier.StaveModifier.Position.BEGIN;
      }

      var keySignatures = this.getModifiers(position, _keysignature.KeySignature.CATEGORY);
      if (keySignatures.length === 0) {
        this.addKeySignature(keySpec, cancelKeySpec, position);
      } else {
        keySignatures[0].setKeySig(keySpec, cancelKeySpec);
      }

      return this;
    }
  }, {
    key: 'setEndKeySignature',
    value: function setEndKeySignature(keySpec, cancelKeySpec) {
      this.setKeySignature(keySpec, cancelKeySpec, _stavemodifier.StaveModifier.Position.END);
      return this;
    }
  }, {
    key: 'setTimeSignature',
    value: function setTimeSignature(timeSpec, customPadding, position) {
      if (position === undefined) {
        position = _stavemodifier.StaveModifier.Position.BEGIN;
      }

      var timeSignatures = this.getModifiers(position, _timesignature.TimeSignature.CATEGORY);
      if (timeSignatures.length === 0) {
        this.addTimeSignature(timeSpec, customPadding, position);
      } else {
        timeSignatures[0].setTimeSig(timeSpec);
      }

      return this;
    }
  }, {
    key: 'setEndTimeSignature',
    value: function setEndTimeSignature(timeSpec, customPadding) {
      this.setTimeSignature(timeSpec, customPadding, _stavemodifier.StaveModifier.Position.END);
      return this;
    }
  }, {
    key: 'addKeySignature',
    value: function addKeySignature(keySpec, cancelKeySpec, position) {
      this.addModifier(new _keysignature.KeySignature(keySpec, cancelKeySpec), position);
      return this;
    }
  }, {
    key: 'addClef',
    value: function addClef(clef, size, annotation, position) {
      if (position === undefined || position === _stavemodifier.StaveModifier.Position.BEGIN) {
        this.clef = clef;
      }

      this.addModifier(new _clef.Clef(clef, size, annotation), position);
      return this;
    }
  }, {
    key: 'addEndClef',
    value: function addEndClef(clef, size, annotation) {
      this.addClef(clef, size, annotation, _stavemodifier.StaveModifier.Position.END);
      return this;
    }
  }, {
    key: 'addTimeSignature',
    value: function addTimeSignature(timeSpec, customPadding, position) {
      this.addModifier(new _timesignature.TimeSignature(timeSpec, customPadding), position);
      return this;
    }
  }, {
    key: 'addEndTimeSignature',
    value: function addEndTimeSignature(timeSpec, customPadding) {
      this.addTimeSignature(timeSpec, customPadding, _stavemodifier.StaveModifier.Position.END);
      return this;
    }

    // Deprecated

  }, {
    key: 'addTrebleGlyph',
    value: function addTrebleGlyph() {
      this.addClef('treble');
      return this;
    }
  }, {
    key: 'getModifiers',
    value: function getModifiers(position, category) {
      if (position === undefined) return this.modifiers;

      return this.modifiers.filter(function (modifier) {
        return position === modifier.getPosition() && (category === undefined || category === modifier.getCategory());
      });
    }
  }, {
    key: 'sortByCategory',
    value: function sortByCategory(items, order) {
      for (var i = items.length - 1; i >= 0; i--) {
        for (var j = 0; j < i; j++) {
          if (order[items[j].getCategory()] > order[items[j + 1].getCategory()]) {
            var temp = items[j];
            items[j] = items[j + 1];
            items[j + 1] = temp;
          }
        }
      }
    }
  }, {
    key: 'format',
    value: function format() {
      var begBarline = this.modifiers[0];
      var endBarline = this.modifiers[1];

      var begModifiers = this.getModifiers(_stavemodifier.StaveModifier.Position.BEGIN);
      var endModifiers = this.getModifiers(_stavemodifier.StaveModifier.Position.END);

      this.sortByCategory(begModifiers, {
        barlines: 0, clefs: 1, keysignatures: 2, timesignatures: 3
      });

      this.sortByCategory(endModifiers, {
        timesignatures: 0, keysignatures: 1, barlines: 2, clefs: 3
      });

      if (begModifiers.length > 1 && begBarline.getType() === _stavebarline.Barline.type.REPEAT_BEGIN) {
        begModifiers.push(begModifiers.splice(0, 1)[0]);
        begModifiers.splice(0, 0, new _stavebarline.Barline(_stavebarline.Barline.type.SINGLE));
      }

      if (endModifiers.indexOf(endBarline) > 0) {
        endModifiers.splice(0, 0, new _stavebarline.Barline(_stavebarline.Barline.type.NONE));
      }

      var width = void 0;
      var padding = void 0;
      var modifier = void 0;
      var offset = 0;
      var x = this.x;
      for (var i = 0; i < begModifiers.length; i++) {
        modifier = begModifiers[i];
        padding = modifier.getPadding(i + offset);
        width = modifier.getWidth();

        x += padding;
        modifier.setX(x);
        x += width;

        if (padding + width === 0) offset--;
      }

      this.start_x = x;
      x = this.x + this.width;

      for (var _i = 0; _i < endModifiers.length; _i++) {
        modifier = endModifiers[_i];
        x -= modifier.getPadding(_i);
        if (_i !== 0) {
          x -= modifier.getWidth();
        }

        modifier.setX(x);

        if (_i === 0) {
          x -= modifier.getWidth();
        }
      }

      this.end_x = endModifiers.length === 1 ? this.x + this.width : x;
      this.formatted = true;
    }

    /**
     * All drawing functions below need the context to be set.
     */

  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      this.setRendered();

      if (!this.formatted) this.format();

      var num_lines = this.options.num_lines;
      var width = this.width;
      var x = this.x;
      var y = void 0;

      // Render lines
      for (var line = 0; line < num_lines; line++) {
        y = this.getYForLine(line);

        this.applyStyle();
        if (this.options.line_config[line].visible) {
          this.context.beginPath();
          this.context.moveTo(x, y);
          this.context.lineTo(x + width, y);
          this.context.stroke();
        }
        this.restoreStyle();
      }

      // Draw the modifiers (bar lines, coda, segno, repeat brackets, etc.)
      for (var i = 0; i < this.modifiers.length; i++) {
        // Only draw modifier if it has a draw function
        if (typeof this.modifiers[i].draw === 'function') {
          this.modifiers[i].draw(this, this.getModifierXShift(i));
        }
      }

      // Render measure numbers
      if (this.measure > 0) {
        this.context.save();
        this.context.setFont(this.font.family, this.font.size, this.font.weight);
        var text_width = this.context.measureText('' + this.measure).width;
        y = this.getYForTopText(0) + 3;
        this.context.fillText('' + this.measure, this.x - text_width / 2, y);
        this.context.restore();
      }

      return this;
    }

    // Draw Simple barlines for backward compatability
    // Do not delete - draws the beginning bar of the stave

  }, {
    key: 'drawVertical',
    value: function drawVertical(x, isDouble) {
      this.drawVerticalFixed(this.x + x, isDouble);
    }
  }, {
    key: 'drawVerticalFixed',
    value: function drawVerticalFixed(x, isDouble) {
      this.checkContext();

      var top_line = this.getYForLine(0);
      var bottom_line = this.getYForLine(this.options.num_lines - 1);
      if (isDouble) {
        this.context.fillRect(x - 3, top_line, 1, bottom_line - top_line + 1);
      }
      this.context.fillRect(x, top_line, 1, bottom_line - top_line + 1);
    }
  }, {
    key: 'drawVerticalBar',
    value: function drawVerticalBar(x) {
      this.drawVerticalBarFixed(this.x + x, false);
    }
  }, {
    key: 'drawVerticalBarFixed',
    value: function drawVerticalBarFixed(x) {
      this.checkContext();

      var top_line = this.getYForLine(0);
      var bottom_line = this.getYForLine(this.options.num_lines - 1);
      this.context.fillRect(x, top_line, 1, bottom_line - top_line + 1);
    }

    /**
     * Get the current configuration for the Stave.
     * @return {Array} An array of configuration objects.
     */

  }, {
    key: 'getConfigForLines',
    value: function getConfigForLines() {
      return this.options.line_config;
    }

    /**
     * Configure properties of the lines in the Stave
     * @param line_number The index of the line to configure.
     * @param line_config An configuration object for the specified line.
     * @throws Vex.RERR "StaveConfigError" When the specified line number is out of
     *   range of the number of lines specified in the constructor.
     */

  }, {
    key: 'setConfigForLine',
    value: function setConfigForLine(line_number, line_config) {
      if (line_number >= this.options.num_lines || line_number < 0) {
        throw new _vex.Vex.RERR('StaveConfigError', 'The line number must be within the range of the number of lines in the Stave.');
      }

      if (line_config.visible === undefined) {
        throw new _vex.Vex.RERR('StaveConfigError', "The line configuration object is missing the 'visible' property.");
      }

      if (typeof line_config.visible !== 'boolean') {
        throw new _vex.Vex.RERR('StaveConfigError', "The line configuration objects 'visible' property must be true or false.");
      }

      this.options.line_config[line_number] = line_config;

      return this;
    }

    /**
     * Set the staff line configuration array for all of the lines at once.
     * @param lines_configuration An array of line configuration objects.  These objects
     *   are of the same format as the single one passed in to setLineConfiguration().
     *   The caller can set null for any line config entry if it is desired that the default be used
     * @throws Vex.RERR "StaveConfigError" When the lines_configuration array does not have
     *   exactly the same number of elements as the num_lines configuration object set in
     *   the constructor.
     */

  }, {
    key: 'setConfigForLines',
    value: function setConfigForLines(lines_configuration) {
      if (lines_configuration.length !== this.options.num_lines) {
        throw new _vex.Vex.RERR('StaveConfigError', 'The length of the lines configuration array must match the number of lines in the Stave');
      }

      // Make sure the defaults are present in case an incomplete set of
      //  configuration options were supplied.
      for (var line_config in lines_configuration) {
        // Allow 'null' to be used if the caller just wants the default for a particular node.
        if (!lines_configuration[line_config]) {
          lines_configuration[line_config] = this.options.line_config[line_config];
        }
        _vex.Vex.Merge(this.options.line_config[line_config], lines_configuration[line_config]);
      }

      this.options.line_config = lines_configuration;

      return this;
    }
  }]);

  return Stave;
}(_element.Element);