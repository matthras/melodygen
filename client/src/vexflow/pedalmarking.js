Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PedalMarking = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

var _glyph = require('./glyph');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This file implements different types of pedal markings. These notation
// elements indicate to the performer when to depress and release the a pedal.
//
// In order to create "Sostenuto", and "una corda" markings, you must set
// custom text for the release/depress pedal markings.

// To enable logging for this class. Set `Vex.Flow.PedalMarking.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (PedalMarking.DEBUG) _vex.Vex.L('Vex.Flow.PedalMarking', args);
}

// Draws a pedal glyph with the provided `name` on a rendering `context`
// at the coordinates `x` and `y. Takes into account the glyph data
// coordinate shifts.
function drawPedalGlyph(name, context, x, y, point) {
  var glyph_data = PedalMarking.GLYPHS[name];
  var glyph = new _glyph.Glyph(glyph_data.code, point);
  glyph.render(context, x + glyph_data.x_shift, y + glyph_data.y_shift);
}

var PedalMarking = exports.PedalMarking = function (_Element) {
  _inherits(PedalMarking, _Element);

  _createClass(PedalMarking, null, [{
    key: 'createSustain',


    // Create a sustain pedal marking. Returns the defaults PedalMarking.
    // Which uses the traditional "Ped" and "*"" markings.
    value: function createSustain(notes) {
      var pedal = new PedalMarking(notes);
      return pedal;
    }

    // Create a sostenuto pedal marking

  }, {
    key: 'createSostenuto',
    value: function createSostenuto(notes) {
      var pedal = new PedalMarking(notes);
      pedal.setStyle(PedalMarking.Styles.MIXED);
      pedal.setCustomText('Sost. Ped.');
      return pedal;
    }

    // Create an una corda pedal marking

  }, {
    key: 'createUnaCorda',
    value: function createUnaCorda(notes) {
      var pedal = new PedalMarking(notes);
      pedal.setStyle(PedalMarking.Styles.TEXT);
      pedal.setCustomText('una corda', 'tre corda');
      return pedal;
    }

    // ## Prototype Methods

  }, {
    key: 'GLYPHS',

    // Glyph data
    get: function get() {
      return {
        'pedal_depress': {
          code: 'v36',
          x_shift: -10,
          y_shift: 0
        },
        'pedal_release': {
          code: 'v5d',
          x_shift: -2,
          y_shift: 3
        }
      };
    }
  }, {
    key: 'Styles',
    get: function get() {
      return {
        TEXT: 1,
        BRACKET: 2,
        MIXED: 3
      };
    }
  }, {
    key: 'StylesString',
    get: function get() {
      return {
        text: PedalMarking.Styles.TEXT,
        bracket: PedalMarking.Styles.BRACKET,
        mixed: PedalMarking.Styles.MIXED
      };
    }
  }]);

  function PedalMarking(notes) {
    _classCallCheck(this, PedalMarking);

    var _this = _possibleConstructorReturn(this, (PedalMarking.__proto__ || Object.getPrototypeOf(PedalMarking)).call(this));

    _this.setAttribute('type', 'PedalMarking');

    _this.notes = notes;
    _this.style = PedalMarking.TEXT;
    _this.line = 0;

    // Custom text for the release/depress markings
    _this.custom_depress_text = '';
    _this.custom_release_text = '';

    _this.font = {
      family: 'Times New Roman',
      size: 12,
      weight: 'italic bold'
    };

    _this.render_options = {
      bracket_height: 10,
      text_margin_right: 6,
      bracket_line_width: 1,
      glyph_point_size: 40,
      color: 'black'
    };
    return _this;
  }

  // Set custom text for the `depress`/`release` pedal markings. No text is
  // set if the parameter is falsy.


  _createClass(PedalMarking, [{
    key: 'setCustomText',
    value: function setCustomText(depress, release) {
      this.custom_depress_text = depress || '';
      this.custom_release_text = release || '';
      return this;
    }

    // Set the pedal marking style

  }, {
    key: 'setStyle',
    value: function setStyle(style) {
      if (style < 1 && style > 3) {
        throw new _vex.Vex.RERR('InvalidParameter', 'The style must be one found in PedalMarking.Styles');
      }

      this.style = style;
      return this;
    }

    // Set the staff line to render the markings on

  }, {
    key: 'setLine',
    value: function setLine(line) {
      this.line = line;return this;
    }

    // Draw the bracket based pedal markings

  }, {
    key: 'drawBracketed',
    value: function drawBracketed() {
      var ctx = this.context;
      var is_pedal_depressed = false;
      var prev_x = void 0;
      var prev_y = void 0;
      var pedal = this;

      // Iterate through each note
      this.notes.forEach(function (note, index, notes) {
        // Each note triggers the opposite pedal action
        is_pedal_depressed = !is_pedal_depressed;

        // Get the initial coordinates for the note
        var x = note.getAbsoluteX();
        var y = note.getStave().getYForBottomText(pedal.line + 3);

        // Throw if current note is positioned before the previous note
        if (x < prev_x) {
          throw new _vex.Vex.RERR('InvalidConfiguration', 'The notes provided must be in order of ascending x positions');
        }

        // Determine if the previous or next note are the same
        // as the current note. We need to keep track of this for
        // when adjustments are made for the release+depress action
        var next_is_same = notes[index + 1] === note;
        var prev_is_same = notes[index - 1] === note;

        var x_shift = 0;
        if (is_pedal_depressed) {
          // Adjustment for release+depress
          x_shift = prev_is_same ? 5 : 0;

          if (pedal.style === PedalMarking.Styles.MIXED && !prev_is_same) {
            // For MIXED style, start with text instead of bracket
            if (pedal.custom_depress_text) {
              // If we have custom text, use instead of the default "Ped" glyph
              var text_width = ctx.measureText(pedal.custom_depress_text).width;
              ctx.fillText(pedal.custom_depress_text, x - text_width / 2, y);
              x_shift = text_width / 2 + pedal.render_options.text_margin_right;
            } else {
              // Render the Ped glyph in position
              drawPedalGlyph('pedal_depress', ctx, x, y, pedal.render_options.glyph_point_size);
              x_shift = 20 + pedal.render_options.text_margin_right;
            }
          } else {
            // Draw start bracket
            ctx.beginPath();
            ctx.moveTo(x, y - pedal.render_options.bracket_height);
            ctx.lineTo(x + x_shift, y);
            ctx.stroke();
            ctx.closePath();
          }
        } else {
          // Adjustment for release+depress
          x_shift = next_is_same ? -5 : 0;

          // Draw end bracket
          ctx.beginPath();
          ctx.moveTo(prev_x, prev_y);
          ctx.lineTo(x + x_shift, y);
          ctx.lineTo(x, y - pedal.render_options.bracket_height);
          ctx.stroke();
          ctx.closePath();
        }

        // Store previous coordinates
        prev_x = x + x_shift;
        prev_y = y;
      });
    }

    // Draw the text based pedal markings. This defaults to the traditional
    // "Ped" and "*"" symbols if no custom text has been provided.

  }, {
    key: 'drawText',
    value: function drawText() {
      var ctx = this.context;
      var is_pedal_depressed = false;
      var pedal = this;

      // The glyph point size
      var point = pedal.render_options.glyph_point_size;

      // Iterate through each note, placing glyphs or custom text accordingly
      this.notes.forEach(function (note) {
        is_pedal_depressed = !is_pedal_depressed;
        var stave = note.getStave();
        var x = note.getAbsoluteX();
        var y = stave.getYForBottomText(pedal.line + 3);

        var text_width = 0;
        if (is_pedal_depressed) {
          if (pedal.custom_depress_text) {
            text_width = ctx.measureText(pedal.custom_depress_text).width;
            ctx.fillText(pedal.custom_depress_text, x - text_width / 2, y);
          } else {
            drawPedalGlyph('pedal_depress', ctx, x, y, point);
          }
        } else {
          if (pedal.custom_release_text) {
            text_width = ctx.measureText(pedal.custom_release_text).width;
            ctx.fillText(pedal.custom_release_text, x - text_width / 2, y);
          } else {
            drawPedalGlyph('pedal_release', ctx, x, y, point);
          }
        }
      });
    }

    // Render the pedal marking in position on the rendering context

  }, {
    key: 'draw',
    value: function draw() {
      var ctx = this.checkContext();
      this.setRendered();

      ctx.save();
      ctx.setStrokeStyle(this.render_options.color);
      ctx.setFillStyle(this.render_options.color);
      ctx.setFont(this.font.family, this.font.size, this.font.weight);

      L('Rendering Pedal Marking');

      if (this.style === PedalMarking.Styles.BRACKET || this.style === PedalMarking.Styles.MIXED) {
        ctx.setLineWidth(this.render_options.bracket_line_width);
        this.drawBracketed();
      } else if (this.style === PedalMarking.Styles.TEXT) {
        this.drawText();
      }

      ctx.restore();
    }
  }]);

  return PedalMarking;
}(_element.Element);