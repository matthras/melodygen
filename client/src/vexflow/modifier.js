Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Modifier = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _element = require('./element');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// `Modifier` is an abstract interface for notational elements that modify
// a `Note`. Examples of modifiers are `Accidental`, `Annotation`, `Stroke`, etc.
//
// For a `Modifier` instance to be positioned correctly, it must be part of
// a `ModifierContext`. All modifiers in the same context are rendered relative to
// one another.
//
// Typically, all modifiers to a note are part of the same `ModifierContext` instance. Also,
// in multi-voice staves, all modifiers to notes on the same `tick` are part of the same
// `ModifierContext`. This ensures that multiple voices don't trample all over each other.

// To enable logging for this class. Set `Vex.Flow.Modifier.DEBUG` to `true`.
// function L(...args) { if (Modifier.DEBUG) Vex.L('Vex.Flow.Modifier', args); }

var Modifier = exports.Modifier = function (_Element) {
  _inherits(Modifier, _Element);

  _createClass(Modifier, null, [{
    key: 'CATEGORY',
    get: function get() {
      return 'none';
    }

    // Modifiers can be positioned almost anywhere, relative to a note.

  }, {
    key: 'Position',
    get: function get() {
      return {
        LEFT: 1,
        RIGHT: 2,
        ABOVE: 3,
        BELOW: 4
      };
    }
  }, {
    key: 'PositionString',
    get: function get() {
      return {
        above: Modifier.Position.ABOVE,
        below: Modifier.Position.BELOW,
        left: Modifier.Position.LEFT,
        right: Modifier.Position.RIGHT
      };
    }
  }]);

  function Modifier() {
    _classCallCheck(this, Modifier);

    var _this = _possibleConstructorReturn(this, (Modifier.__proto__ || Object.getPrototypeOf(Modifier)).call(this));

    _this.setAttribute('type', 'Modifier');

    _this.width = 0;

    // Modifiers are attached to a note and an index. An index is a
    // specific head in a chord.
    _this.note = null;
    _this.index = null;

    // The `text_line` is reserved space above or below a stave.
    _this.text_line = 0;
    _this.position = Modifier.Position.LEFT;
    _this.modifier_context = null;
    _this.x_shift = 0;
    _this.y_shift = 0;
    _this.spacingFromNextModifier = 0;
    return _this;
  }

  // Every modifier has a category. The `ModifierContext` uses this to determine
  // the type and order of the modifiers.


  _createClass(Modifier, [{
    key: 'getCategory',
    value: function getCategory() {
      return Modifier.CATEGORY;
    }

    // Get and set modifier widths.

  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.width;
    }
  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      this.width = width;return this;
    }

    // Get and set attached note (`StaveNote`, `TabNote`, etc.)

  }, {
    key: 'getNote',
    value: function getNote() {
      return this.note;
    }
  }, {
    key: 'setNote',
    value: function setNote(note) {
      this.note = note;return this;
    }

    // Get and set note index, which is a specific note in a chord.

  }, {
    key: 'getIndex',
    value: function getIndex() {
      return this.index;
    }
  }, {
    key: 'setIndex',
    value: function setIndex(index) {
      this.index = index;return this;
    }

    // Every modifier must be part of a `ModifierContext`.

  }, {
    key: 'getModifierContext',
    value: function getModifierContext() {
      return this.modifier_context;
    }
  }, {
    key: 'setModifierContext',
    value: function setModifierContext(c) {
      this.modifier_context = c;return this;
    }

    // Get and set articulation position.

  }, {
    key: 'getPosition',
    value: function getPosition() {
      return this.position;
    }
  }, {
    key: 'setPosition',
    value: function setPosition(position) {
      this.position = typeof position === 'string' ? Modifier.PositionString[position] : position;
      return this;
    }

    // Set the `text_line` for the modifier.

  }, {
    key: 'setTextLine',
    value: function setTextLine(line) {
      this.text_line = line;return this;
    }

    // Shift modifier down `y` pixels. Negative values shift up.

  }, {
    key: 'setYShift',
    value: function setYShift(y) {
      this.y_shift = y;return this;
    }
  }, {
    key: 'setSpacingFromNextModifier',
    value: function setSpacingFromNextModifier(x) {
      this.spacingFromNextModifier = x;
    }
  }, {
    key: 'getSpacingFromNextModifier',
    value: function getSpacingFromNextModifier() {
      return this.spacingFromNextModifier;
    }

    // Shift modifier `x` pixels in the direction of the modifier. Negative values
    // shift reverse.

  }, {
    key: 'setXShift',
    value: function setXShift(x) {
      this.x_shift = 0;
      if (this.position === Modifier.Position.LEFT) {
        this.x_shift -= x;
      } else {
        this.x_shift += x;
      }
    }
  }, {
    key: 'getXShift',
    value: function getXShift() {
      return this.x_shift;
    }

    // Render the modifier onto the canvas.

  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();
      throw new _vex.Vex.RERR('MethodNotImplemented', 'draw() not implemented for this modifier.');
    }
  }]);

  return Modifier;
}(_element.Element);