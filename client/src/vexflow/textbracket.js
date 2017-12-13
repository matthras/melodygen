Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextBracket = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _element = require('./element');

var _renderer = require('./renderer');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// Author: Cyril Silverman
//
// ## Description
//
// This file implement `TextBrackets` which extend between two notes.
// The octave transposition markings (8va, 8vb, 15va, 15vb) can be created
// using this class.

// To enable logging for this class. Set `Vex.Flow.TextBracket.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (TextBracket.DEBUG) _vex.Vex.L('Vex.Flow.TextBracket', args);
}

var TextBracket = exports.TextBracket = function (_Element) {
  _inherits(TextBracket, _Element);

  _createClass(TextBracket, null, [{
    key: 'Positions',

    // FIXME: Modifier.Position is singular while this is plural, make consistent
    get: function get() {
      return {
        TOP: 1,
        BOTTOM: -1
      };
    }
  }, {
    key: 'PositionString',
    get: function get() {
      return {
        top: TextBracket.Positions.TOP,
        bottom: TextBracket.Positions.BOTTOM
      };
    }
  }]);

  function TextBracket(_ref) {
    var start = _ref.start,
        stop = _ref.stop,
        _ref$text = _ref.text,
        text = _ref$text === undefined ? '' : _ref$text,
        _ref$superscript = _ref.superscript,
        superscript = _ref$superscript === undefined ? '' : _ref$superscript,
        _ref$position = _ref.position,
        position = _ref$position === undefined ? TextBracket.Positions.TOP : _ref$position;

    _classCallCheck(this, TextBracket);

    var _this = _possibleConstructorReturn(this, (TextBracket.__proto__ || Object.getPrototypeOf(TextBracket)).call(this));

    _this.setAttribute('type', 'TextBracket');

    _this.start = start;
    _this.stop = stop;

    _this.text = text;
    _this.superscript = superscript;

    _this.position = typeof position === 'string' ? TextBracket.PositionString[position] : position;

    _this.line = 1;

    _this.font = {
      family: 'Serif',
      size: 15,
      weight: 'italic'
    };

    _this.render_options = {
      dashed: true,
      dash: [5],
      color: 'black',
      line_width: 1,
      show_bracket: true,
      bracket_height: 8,

      // In the BOTTOM position, the bracket line can extend
      // under the superscript.
      underline_superscript: true
    };
    return _this;
  }

  // Apply the text backet styling to the provided `context`


  _createClass(TextBracket, [{
    key: 'applyStyle',
    value: function applyStyle(context) {
      // Apply style for the octave bracket
      context.setFont(this.font.family, this.font.size, this.font.weight);
      context.setStrokeStyle(this.render_options.color);
      context.setFillStyle(this.render_options.color);
      context.setLineWidth(this.render_options.line_width);

      return this;
    }

    // Set whether the bracket line should be `dashed`. You can also
    // optionally set the `dash` pattern by passing in an array of numbers

  }, {
    key: 'setDashed',
    value: function setDashed(dashed, dash) {
      this.render_options.dashed = dashed;
      if (dash) this.render_options.dash = dash;
      return this;
    }

    // Set the font for the text

  }, {
    key: 'setFont',
    value: function setFont(font) {
      // We use Object.assign to support partial updates to the font object
      this.font = Object.assign({}, this.font, font);
      return this;
    }
    // Set the rendering `context` for the octave bracket

  }, {
    key: 'setLine',
    value: function setLine(line) {
      this.line = line;return this;
    }

    // Draw the octave bracket on the rendering context

  }, {
    key: 'draw',
    value: function draw() {
      var ctx = this.context;
      this.setRendered();

      var y = 0;
      switch (this.position) {
        case TextBracket.Positions.TOP:
          y = this.start.getStave().getYForTopText(this.line);
          break;
        case TextBracket.Positions.BOTTOM:
          y = this.start.getStave().getYForBottomText(this.line + _tables.Flow.TEXT_HEIGHT_OFFSET_HACK);
          break;
        default:
          throw new _vex.Vex.RERR('InvalidPosition', 'The position ' + this.position + ' is invalid');
      }

      // Get the preliminary start and stop coordintates for the bracket
      var start = { x: this.start.getAbsoluteX(), y: y };
      var stop = { x: this.stop.getAbsoluteX(), y: y };

      L('Rendering TextBracket: start:', start, 'stop:', stop, 'y:', y);

      var bracket_height = this.render_options.bracket_height * this.position;

      ctx.save();
      this.applyStyle(ctx);

      // Draw text
      ctx.fillText(this.text, start.x, start.y);

      // Get the width and height for the octave number
      var main_width = ctx.measureText(this.text).width;
      var main_height = ctx.measureText('M').width;

      // Calculate the y position for the super script
      var super_y = start.y - main_height / 2.5;

      // Draw the superscript
      ctx.setFont(this.font.family, this.font.size / 1.4, this.font.weight);
      ctx.fillText(this.superscript, start.x + main_width + 1, super_y);

      // Determine width and height of the superscript
      var superscript_width = ctx.measureText(this.superscript).width;
      var super_height = ctx.measureText('M').width;

      // Setup initial coordinates for the bracket line
      var start_x = start.x;
      var line_y = super_y;
      var end_x = stop.x + this.stop.getGlyph().getWidth();

      // Adjust x and y coordinates based on position
      if (this.position === TextBracket.Positions.TOP) {
        start_x += main_width + superscript_width + 5;
        line_y -= super_height / 2.7;
      } else if (this.position === TextBracket.Positions.BOTTOM) {
        line_y += super_height / 2.7;
        start_x += main_width + 2;

        if (!this.render_options.underline_superscript) {
          start_x += superscript_width;
        }
      }

      if (this.render_options.dashed) {
        // Main line
        _renderer.Renderer.drawDashedLine(ctx, start_x, line_y, end_x, line_y, this.render_options.dash);
        // Ending Bracket
        if (this.render_options.show_bracket) {
          _renderer.Renderer.drawDashedLine(ctx, end_x, line_y + 1 * this.position, end_x, line_y + bracket_height, this.render_options.dash);
        }
      } else {
        ctx.beginPath();
        ctx.moveTo(start_x, line_y);
        // Main line
        ctx.lineTo(end_x, line_y);
        if (this.render_options.show_bracket) {
          // Ending bracket
          ctx.lineTo(end_x, line_y + bracket_height);
        }
        ctx.stroke();
        ctx.closePath();
      }

      ctx.restore();
    }
  }]);

  return TextBracket;
}(_element.Element);