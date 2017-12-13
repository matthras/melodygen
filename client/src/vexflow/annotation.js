Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Annotation = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vex = require('./vex');

var _tables = require('./tables');

var _modifier = require('./modifier');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This file implements text annotations as modifiers that can be attached to
// notes.
//
// See `tests/annotation_tests.js` for usage examples.

// To enable logging for this class. Set `Vex.Flow.Annotation.DEBUG` to `true`.
function L() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (Annotation.DEBUG) _vex.Vex.L('Vex.Flow.Annotation', args);
}

var Annotation = exports.Annotation = function (_Modifier) {
  _inherits(Annotation, _Modifier);

  _createClass(Annotation, null, [{
    key: 'format',


    // Arrange annotations within a `ModifierContext`
    value: function format(annotations, state) {
      if (!annotations || annotations.length === 0) return false;

      var width = 0;
      for (var i = 0; i < annotations.length; ++i) {
        var annotation = annotations[i];
        width = Math.max(annotation.getWidth(), width);
        if (annotation.getPosition() === _modifier.Modifier.Position.ABOVE) {
          annotation.setTextLine(state.top_text_line);
          state.top_text_line++;
        } else {
          annotation.setTextLine(state.text_line);
          state.text_line++;
        }
      }

      state.left_shift += width / 2;
      state.right_shift += width / 2;
      return true;
    }

    // ## Prototype Methods
    //
    // Annotations inherit from `Modifier` and is positioned correctly when
    // in a `ModifierContext`.
    // Create a new `Annotation` with the string `text`.

  }, {
    key: 'CATEGORY',
    get: function get() {
      return 'annotations';
    }

    // Text annotations can be positioned and justified relative to the note.

  }, {
    key: 'Justify',
    get: function get() {
      return {
        LEFT: 1,
        CENTER: 2,
        RIGHT: 3,
        CENTER_STEM: 4
      };
    }
  }, {
    key: 'JustifyString',
    get: function get() {
      return {
        left: Annotation.Justify.LEFT,
        right: Annotation.Justify.RIGHT,
        center: Annotation.Justify.CENTER,
        centerStem: Annotation.Justify.CENTER_STEM
      };
    }
  }, {
    key: 'VerticalJustify',
    get: function get() {
      return {
        TOP: 1,
        CENTER: 2,
        BOTTOM: 3,
        CENTER_STEM: 4
      };
    }
  }, {
    key: 'VerticalJustifyString',
    get: function get() {
      return {
        above: Annotation.VerticalJustify.TOP,
        top: Annotation.VerticalJustify.TOP,
        below: Annotation.VerticalJustify.BOTTOM,
        bottom: Annotation.VerticalJustify.BOTTOM,
        center: Annotation.VerticalJustify.CENTER,
        centerStem: Annotation.VerticalJustify.CENTER_STEM
      };
    }
  }]);

  function Annotation(text) {
    _classCallCheck(this, Annotation);

    var _this = _possibleConstructorReturn(this, (Annotation.__proto__ || Object.getPrototypeOf(Annotation)).call(this));

    _this.setAttribute('type', 'Annotation');

    _this.note = null;
    _this.index = null;
    _this.text = text;
    _this.justification = Annotation.Justify.CENTER;
    _this.vert_justification = Annotation.VerticalJustify.TOP;
    _this.font = {
      family: 'Arial',
      size: 10,
      weight: ''
    };

    // The default width is calculated from the text.
    _this.setWidth(_tables.Flow.textWidth(text));
    return _this;
  }

  _createClass(Annotation, [{
    key: 'getCategory',
    value: function getCategory() {
      return Annotation.CATEGORY;
    }

    // Set font family, size, and weight. E.g., `Arial`, `10pt`, `Bold`.

  }, {
    key: 'setFont',
    value: function setFont(family, size, weight) {
      this.font = { family: family, size: size, weight: weight };
      return this;
    }

    // Set vertical position of text (above or below stave). `just` must be
    // a value in `Annotation.VerticalJustify`.

  }, {
    key: 'setVerticalJustification',
    value: function setVerticalJustification(just) {
      this.vert_justification = typeof just === 'string' ? Annotation.VerticalJustifyString[just] : just;
      return this;
    }

    // Get and set horizontal justification. `justification` is a value in
    // `Annotation.Justify`.

  }, {
    key: 'getJustification',
    value: function getJustification() {
      return this.justification;
    }
  }, {
    key: 'setJustification',
    value: function setJustification(just) {
      this.justification = typeof just === 'string' ? Annotation.JustifyString[just] : just;
      return this;
    }

    // Render text beside the note.

  }, {
    key: 'draw',
    value: function draw() {
      this.checkContext();

      if (!this.note) {
        throw new _vex.Vex.RERR('NoNoteForAnnotation', "Can't draw text annotation without an attached note.");
      }

      this.setRendered();
      var start = this.note.getModifierStartXY(_modifier.Modifier.Position.ABOVE, this.index);

      // We're changing context parameters. Save current state.
      this.context.save();
      this.context.setFont(this.font.family, this.font.size, this.font.weight);
      var text_width = this.context.measureText(this.text).width;

      // Estimate text height to be the same as the width of an 'm'.
      //
      // This is a hack to work around the inability to measure text height
      // in HTML5 Canvas (and SVG).
      var text_height = this.context.measureText('m').width;
      var x = void 0;
      var y = void 0;

      if (this.justification === Annotation.Justify.LEFT) {
        x = start.x;
      } else if (this.justification === Annotation.Justify.RIGHT) {
        x = start.x - text_width;
      } else if (this.justification === Annotation.Justify.CENTER) {
        x = start.x - text_width / 2;
      } else /* CENTER_STEM */{
          x = this.note.getStemX() - text_width / 2;
        }

      var stem_ext = void 0;
      var spacing = void 0;
      var has_stem = this.note.hasStem();
      var stave = this.note.getStave();

      // The position of the text varies based on whether or not the note
      // has a stem.
      if (has_stem) {
        stem_ext = this.note.getStem().getExtents();
        spacing = stave.getSpacingBetweenLines();
      }

      if (this.vert_justification === Annotation.VerticalJustify.BOTTOM) {
        // HACK: We need to compensate for the text's height since its origin
        // is bottom-right.
        y = stave.getYForBottomText(this.text_line + _tables.Flow.TEXT_HEIGHT_OFFSET_HACK);
        if (has_stem) {
          var stem_base = this.note.getStemDirection() === 1 ? stem_ext.baseY : stem_ext.topY;
          y = Math.max(y, stem_base + spacing * (this.text_line + 2));
        }
      } else if (this.vert_justification === Annotation.VerticalJustify.CENTER) {
        var yt = this.note.getYForTopText(this.text_line) - 1;
        var yb = stave.getYForBottomText(this.text_line);
        y = yt + (yb - yt) / 2 + text_height / 2;
      } else if (this.vert_justification === Annotation.VerticalJustify.TOP) {
        y = Math.min(stave.getYForTopText(this.text_line), this.note.getYs()[0] - 10);
        if (has_stem) {
          y = Math.min(y, stem_ext.topY - 5 - spacing * this.text_line);
        }
      } else /* CENTER_STEM */{
          var extents = this.note.getStemExtents();
          y = extents.topY + (extents.baseY - extents.topY) / 2 + text_height / 2;
        }

      L('Rendering annotation: ', this.text, x, y);
      this.context.fillText(this.text, x, y);
      this.context.restore();
    }
  }]);

  return Annotation;
}(_modifier.Modifier);