Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ornament = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _modifier = require('./modifier');

var _tickcontext = require('./tickcontext');

var _stavenote = require('./stavenote');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author: Cyril Silverman
//
// ## Description
//
// This file implements ornaments as modifiers that can be
// attached to notes. The complete list of ornaments is available in
// `tables.js` under `Vex.Flow.ornamentCodes`.
//
// See `tests/ornament_tests.js` for usage examples.

// To enable logging for this class. Set `Vex.Flow.Ornament.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (Ornament.DEBUG) _vex.Vex.L('Vex.Flow.Ornament', args);
}

var Ornament = exports.Ornament = function (_Modifier) {
  _inherits(Ornament, _Modifier);

  _createClass(Ornament, null, [{
    key: 'format',


    // ## Static Methods
    // Arrange ornaments inside `ModifierContext`
    value: function format(ornaments, state) {
      if (!ornaments || ornaments.length === 0) return false;

      var width = 0;
      for (var i = 0; i < ornaments.length; ++i) {
        var ornament = ornaments[i];
        var increment = 2;

        width = Math.max(ornament.getWidth(), width);

        if (ornament.getPosition() === _modifier.Modifier.Position.ABOVE) {
          ornament.setTextLine(state.top_text_line);
          state.top_text_line += increment;
        } else {
          ornament.setTextLine(state.text_line);
          state.text_line += increment;
        }
      }

      state.left_shift += width / 2;
      state.right_shift += width / 2;
      return true;
    }

    // Create a new ornament of type `type`, which is an entry in
    // `Vex.Flow.ornamentCodes` in `tables.js`.

  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'ornaments';
    }
  }]);

  function Ornament(type) {
    _classCallCheck(this, Ornament);

    var _this = _possibleConstructorReturn(this, (Ornament.__proto__ || Object.getPrototypeOf(Ornament)).call(this));

    _this.setAttribute('type', 'Ornament');

    _this.note = null;
    _this.index = null;
    _this.type = type;
    _this.position = _modifier.Modifier.Position.ABOVE;
    _this.delayed = false;

    _this.accidentalUpper = null;
    _this.accidentalLower = null;

    _this.render_options = {
      font_scale: 38,
      accidentalLowerPadding: 3,
      accidentalUpperPadding: 3
    };

    _this.ornament = _tables.Flow.ornamentCodes(_this.type);
    if (!_this.ornament) {
      throw new _vex.Vex.RERR('ArgumentError', 'Ornament not found: \'' + _this.type + '\'');
    }

    _this.glyph = new _glyph.Glyph(_this.ornament.code, _this.render_options.font_scale);
    _this.glyph.setOrigin(0.5, 1.0); // FIXME: SMuFL won't require a vertical origin shift
    return _this;
  }

  _createClass(Ornament, [{
    key: 'getCategory',
    value: function getCategory() {
      return Ornament.CATEGORY;
    }

    // Set whether the ornament is to be delayed

  }, {
    key: 'setDelayed',
    value: function setDelayed(delayed) {
      this.delayed = delayed;return this;
    }

    // Set the upper accidental for the ornament

  }, {
    key: 'setUpperAccidental',
    value: function setUpperAccidental(accid) {
      var scale = this.render_options.font_scale / 1.3;
      this.accidentalUpper = new _glyph.Glyph(_tables.Flow.accidentalCodes(accid).code, scale);
      this.accidentalUpper.setOrigin(0.5, 1.0);
      return this;
    }

    // Set the lower accidental for the ornament

  }, {
    key: 'setLowerAccidental',
    value: function setLowerAccidental(accid) {
      var scale = this.render_options.font_scale / 1.3;
      this.accidentalLower = new _glyph.Glyph(_tables.Flow.accidentalCodes(accid).code, scale);
      this.accidentalLower.setOrigin(0.5, 1.0);
      return this;
    }

    // Render ornament in position next to note.

  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();

      if (!this.note || this.index == null) {
        throw new _vex.Vex.RERR('NoAttachedNote', "Can't draw Ornament without a note and index.");
      }

      this.setRendered();

      var ctx = this.context;
      var stemDir = this.note.getStemDirection();
      var stave = this.note.getStave();

      // Get stem extents
      var stemExtents = this.note.getStem().getExtents();
      var y = stemDir === _stavenote.StaveNote.STEM_DOWN ? stemExtents.baseY : stemExtents.topY;

      // TabNotes don't have stems attached to them. Tab stems are rendered
      // outside the stave.
      if (this.note.getCategory() === 'tabnotes') {
        if (this.note.hasStem()) {
          if (stemDir === _stavenote.StaveNote.STEM_DOWN) {
            y = stave.getYForTopText(this.text_line);
          }
        } else {
          // Without a stem
          y = stave.getYForTopText(this.text_line);
        }
      }

      var isPlacedOnNoteheadSide = stemDir === _stavenote.StaveNote.STEM_DOWN;
      var spacing = stave.getSpacingBetweenLines();
      var lineSpacing = 1;

      // Beamed stems are longer than quarter note stems, adjust accordingly
      if (!isPlacedOnNoteheadSide && this.note.beam) {
        lineSpacing += 0.5;
      }

      var totalSpacing = spacing * (this.text_line + lineSpacing);
      var glyphYBetweenLines = y - totalSpacing;

      // Get initial coordinates for the modifier position
      var start = this.note.getModifierStartXY(this.position, this.index);
      var glyphX = start.x;
      var glyphY = Math.min(stave.getYForTopText(this.text_line), glyphYBetweenLines);
      glyphY += this.y_shift;

      // Ajdust x position if ornament is delayed
      if (this.delayed) {
        glyphX += this.glyph.getMetrics().width;
        var nextContext = _tickcontext.TickContext.getNextContext(this.note.getTickContext());
        if (nextContext) {
          glyphX += (nextContext.getX() - glyphX) * 0.5;
        } else {
          glyphX += (stave.x + stave.width - glyphX) * 0.5;
        }
      }

      L('Rendering ornament: ', this.ornament, glyphX, glyphY);

      if (this.accidentalLower) {
        this.accidentalLower.render(ctx, glyphX, glyphY);
        glyphY -= this.accidentalLower.getMetrics().height;
        glyphY -= this.render_options.accidentalLowerPadding;
      }

      this.glyph.render(ctx, glyphX, glyphY);
      glyphY -= this.glyph.getMetrics().height;

      if (this.accidentalUpper) {
        glyphY -= this.render_options.accidentalUpperPadding;
        this.accidentalUpper.render(ctx, glyphX, glyphY);
      }
    }
  }]);

  return Ornament;
}(_modifier.Modifier);