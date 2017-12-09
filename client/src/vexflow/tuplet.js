'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tuplet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

var _formatter = require('./formatter');

var _glyph = require('./glyph');

var _stem = require('./stem');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.

/**
 * ## Description
 *
 * Create a new tuplet from the specified notes. The notes must
 * be part of the same voice. If they are of different rhythmic
 * values, then options.num_notes must be set.
 *
 * @constructor
 * @param {Array.<Vex.Flow.StaveNote>} A set of notes: staveNotes,
 *   notes, etc... any class that inherits stemmableNote at some
 *   point in its prototype chain.
 * @param options: object {
 *
 *   num_notes: fit this many notes into...
 *   notes_occupied: ...the space of this many notes
 *
 *       Together, these two properties make up the tuplet ratio
 *     in the form of num_notes : notes_occupied.
 *       num_notes defaults to the number of notes passed in, so
 *     it is important that if you omit this property, all of
 *     the notes passed should be of the same note value.
 *       notes_occupied defaults to 2 -- so you should almost
 *     certainly pass this parameter for anything other than
 *     a basic triplet.
 *
 *   location:
 *     default 1, which is above the notes: ┌─── 3 ───┐
 *      -1 is below the notes └─── 3 ───┘
 *
 *   bracketed: boolean, draw a bracket around the tuplet number
 *     when true: ┌─── 3 ───┐   when false: 3
 *     defaults to true if notes are not beamed, false otherwise
 *
 *   ratioed: boolean
 *     when true: ┌─── 7:8 ───┐, when false: ┌─── 7 ───┐
 *     defaults to true if the difference between num_notes and
 *     notes_occupied is greater than 1.
 *
 *   y_offset: int, default 0
 *     manually offset a tuplet, for instance to avoid collisions
 *     with articulations, etc...
 * }
 */

var Tuplet = exports.Tuplet = function (_Element) {
  _inherits(Tuplet, _Element);

  _createClass(Tuplet, null, [{
    key: 'LOCATION_TOP',
    get: function get() {
      return 1;
    }
  }, {
    key: 'LOCATION_BOTTOM',
    get: function get() {
      return -1;
    }
  }, {
    key: 'NESTING_OFFSET',
    get: function get() {
      return 15;
    }
  }]);

  function Tuplet(notes, options) {
    _classCallCheck(this, Tuplet);

    var _this = _possibleConstructorReturn(this, (Tuplet.__proto__ || Object.getPrototypeOf(Tuplet)).call(this));

    _this.setAttribute('type', 'Tuplet');
    if (!notes || !notes.length) {
      throw new _vex.Vex.RuntimeError('BadArguments', 'No notes provided for tuplet.');
    }

    _this.options = _vex.Vex.Merge({}, options);
    _this.notes = notes;
    _this.num_notes = 'num_notes' in _this.options ? _this.options.num_notes : notes.length;

    // We accept beats_occupied, but warn that it's deprecated:
    // the preferred property name is now notes_occupied.
    if (_this.options.beats_occupied) {
      _this.beatsOccupiedDeprecationWarning();
    }
    _this.notes_occupied = _this.options.notes_occupied || _this.options.beats_occupied || 2;
    if ('bracketed' in _this.options) {
      _this.bracketed = _this.options.bracketed;
    } else {
      _this.bracketed = notes.some(function (note) {
        return note.beam === null;
      });
    }

    _this.ratioed = 'ratioed' in _this.options ? _this.options.ratioed : Math.abs(_this.notes_occupied - _this.num_notes) > 1;
    _this.point = 28;
    _this.y_pos = 16;
    _this.x_pos = 100;
    _this.width = 200;
    _this.location = _this.options.location || Tuplet.LOCATION_TOP;

    _formatter.Formatter.AlignRestsToNotes(notes, true, true);
    _this.resolveGlyphs();
    _this.attach();
    return _this;
  }

  _createClass(Tuplet, [{
    key: 'attach',
    value: function attach() {
      for (var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        note.setTuplet(this);
      }
    }
  }, {
    key: 'detach',
    value: function detach() {
      for (var i = 0; i < this.notes.length; i++) {
        var note = this.notes[i];
        note.resetTuplet(this);
      }
    }

    /**
     * Set whether or not the bracket is drawn.
     */

  }, {
    key: 'setBracketed',
    value: function setBracketed(bracketed) {
      this.bracketed = !!bracketed;
      return this;
    }

    /**
     * Set whether or not the ratio is shown.
     */

  }, {
    key: 'setRatioed',
    value: function setRatioed(ratioed) {
      this.ratioed = !!ratioed;
      return this;
    }

    /**
     * Set the tuplet to be displayed either on the top or bottom of the stave
     */

  }, {
    key: 'setTupletLocation',
    value: function setTupletLocation(location) {
      if (!location) {
        location = Tuplet.LOCATION_TOP;
      } else if (location !== Tuplet.LOCATION_TOP && location !== Tuplet.LOCATION_BOTTOM) {
        throw new _vex.Vex.RERR('BadArgument', 'Invalid tuplet location: ' + location);
      }

      this.location = location;
      return this;
    }
  }, {
    key: 'getNotes',
    value: function getNotes() {
      return this.notes;
    }
  }, {
    key: 'getNoteCount',
    value: function getNoteCount() {
      return this.num_notes;
    }
  }, {
    key: 'beatsOccupiedDeprecationWarning',
    value: function beatsOccupiedDeprecationWarning() {
      var msg = ['beats_occupied has been deprecated as an ', 'option for tuplets. Please use notes_occupied ', 'instead. Calls to getBeatsOccupied and ', 'setBeatsOccupied should now be routed to ', 'getNotesOccupied and setNotesOccupied instead'].join('');

      if (console && console.warn) {
        // eslint-disable-line no-console
        console.warn(msg); // eslint-disable-line no-console
      } else if (console) {
        console.log(msg); // eslint-disable-line no-console
      }
    }
  }, {
    key: 'getBeatsOccupied',
    value: function getBeatsOccupied() {
      this.beatsOccupiedDeprecationWarning();
      return this.getNotesOccupied();
    }
  }, {
    key: 'setBeatsOccupied',
    value: function setBeatsOccupied(beats) {
      this.beatsOccupiedDeprecationWarning();
      return this.setNotesOccupied(beats);
    }
  }, {
    key: 'getNotesOccupied',
    value: function getNotesOccupied() {
      return this.notes_occupied;
    }
  }, {
    key: 'setNotesOccupied',
    value: function setNotesOccupied(notes) {
      this.detach();
      this.notes_occupied = notes;
      this.resolveGlyphs();
      this.attach();
    }
  }, {
    key: 'resolveGlyphs',
    value: function resolveGlyphs() {
      this.num_glyphs = [];
      var n = this.num_notes;
      while (n >= 1) {
        this.num_glyphs.push(new _glyph.Glyph('v' + n % 10, this.point));
        n = parseInt(n / 10, 10);
      }

      this.denom_glyphs = [];
      n = this.notes_occupied;
      while (n >= 1) {
        this.denom_glyphs.push(new _glyph.Glyph('v' + n % 10, this.point));
        n = parseInt(n / 10, 10);
      }
    }

    // determine how many tuplets are nested within this tuplet
    // on the same side (above/below), to calculate a y
    // offset for this tuplet:

  }, {
    key: 'getNestedTupletCount',
    value: function getNestedTupletCount() {
      var location = this.location;
      var first_note = this.notes[0];
      var maxTupletCount = countTuplets(first_note, location);
      var minTupletCount = countTuplets(first_note, location);

      // Count the tuplets that are on the same side (above/below)
      // as this tuplet:
      function countTuplets(note, location) {
        return note.tupletStack.filter(function (tuplet) {
          return tuplet.location === location;
        }).length;
      }

      this.notes.forEach(function (note) {
        var tupletCount = countTuplets(note, location);
        maxTupletCount = tupletCount > maxTupletCount ? tupletCount : maxTupletCount;
        minTupletCount = tupletCount < minTupletCount ? tupletCount : minTupletCount;
      });

      return maxTupletCount - minTupletCount;
    }

    // determine the y position of the tuplet:

  }, {
    key: 'getYPosition',
    value: function getYPosition() {
      // offset the tuplet for any nested tuplets between
      // it and the notes:
      var nested_tuplet_y_offset = this.getNestedTupletCount() * Tuplet.NESTING_OFFSET * -this.location;

      // offset the tuplet for any manual y_offset:
      var y_offset = this.options.y_offset || 0;

      // now iterate through the notes and find our highest
      // or lowest locations, to form a base y_pos
      var first_note = this.notes[0];
      var y_pos = void 0;
      if (this.location === Tuplet.LOCATION_TOP) {
        y_pos = first_note.getStave().getYForLine(0) - 15;
        // y_pos = first_note.getStemExtents().topY - 10;

        for (var i = 0; i < this.notes.length; ++i) {
          var top_y = this.notes[i].getStemDirection() === _stem.Stem.UP ? this.notes[i].getStemExtents().topY - 10 : this.notes[i].getStemExtents().baseY - 20;

          if (top_y < y_pos) {
            y_pos = top_y;
          }
        }
      } else {
        y_pos = first_note.getStave().getYForLine(4) + 20;

        for (var _i = 0; _i < this.notes.length; ++_i) {
          var bottom_y = this.notes[_i].getStemDirection() === _stem.Stem.UP ? this.notes[_i].getStemExtents().baseY + 20 : this.notes[_i].getStemExtents().topY + 10;
          if (bottom_y > y_pos) {
            y_pos = bottom_y;
          }
        }
      }

      return y_pos + nested_tuplet_y_offset + y_offset;
    }
  }, {
    key: 'draw',
    value: function draw() {
      var _this2 = this;

      this.checkContext();
      this.setRendered();

      // determine x value of left bound of tuplet
      var first_note = this.notes[0];
      var last_note = this.notes[this.notes.length - 1];

      if (!this.bracketed) {
        this.x_pos = first_note.getStemX();
        this.width = last_note.getStemX() - this.x_pos;
      } else {
        this.x_pos = first_note.getTieLeftX() - 5;
        this.width = last_note.getTieRightX() - this.x_pos + 5;
      }

      // determine y value for tuplet
      this.y_pos = this.getYPosition();

      var addGlyphWidth = function addGlyphWidth(width, glyph) {
        return width + glyph.getMetrics().width;
      };

      // calculate total width of tuplet notation
      var width = this.num_glyphs.reduce(addGlyphWidth, 0);
      if (this.ratioed) {
        width = this.denom_glyphs.reduce(addGlyphWidth, width);
        width += this.point * 0.32;
      }

      var notation_center_x = this.x_pos + this.width / 2;
      var notation_start_x = notation_center_x - width / 2;

      // draw bracket if the tuplet is not beamed
      if (this.bracketed) {
        var line_width = this.width / 2 - width / 2 - 5;

        // only draw the bracket if it has positive length
        if (line_width > 0) {
          this.context.fillRect(this.x_pos, this.y_pos, line_width, 1);
          this.context.fillRect(this.x_pos + this.width / 2 + width / 2 + 5, this.y_pos, line_width, 1);
          this.context.fillRect(this.x_pos, this.y_pos + (this.location === Tuplet.LOCATION_BOTTOM), 1, this.location * 10);
          this.context.fillRect(this.x_pos + this.width, this.y_pos + (this.location === Tuplet.LOCATION_BOTTOM), 1, this.location * 10);
        }
      }

      // draw numerator glyphs
      var x_offset = 0;
      this.num_glyphs.forEach(function (glyph) {
        glyph.render(_this2.context, notation_start_x + x_offset, _this2.y_pos + _this2.point / 3 - 2);
        x_offset += glyph.getMetrics().width;
      });

      // display colon and denominator if the ratio is to be shown
      if (this.ratioed) {
        var colon_x = notation_start_x + x_offset + this.point * 0.16;
        var colon_radius = this.point * 0.06;
        this.context.beginPath();
        this.context.arc(colon_x, this.y_pos - this.point * 0.08, colon_radius, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fill();
        this.context.beginPath();
        this.context.arc(colon_x, this.y_pos + this.point * 0.12, colon_radius, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fill();
        x_offset += this.point * 0.32;
        this.denom_glyphs.forEach(function (glyph) {
          glyph.render(_this2.context, notation_start_x + x_offset, _this2.y_pos + _this2.point / 3 - 2);
          x_offset += glyph.getMetrics().width;
        });
      }
    }
  }]);

  return Tuplet;
}(_element.Element);